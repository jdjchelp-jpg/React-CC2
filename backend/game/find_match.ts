import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface FindMatchRequest {
  game_type: string;
}

interface FindMatchResponse {
  match_id: number | null;
  status: 'searching' | 'found';
  estimated_wait?: number;
}

export const findMatch = api<FindMatchRequest, FindMatchResponse>(
  { expose: true, method: "POST", path: "/game/matchmaking/find", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const player = await db.queryRow<{ id: number; overall_elo: number }>`
      SELECT id, overall_elo FROM players WHERE user_id = ${auth.userID}
    `;

    if (!player) {
      throw APIError.notFound("Player not found");
    }

    const gameStat = await db.queryRow<{ qualified: boolean; elo_rating: number }>`
      SELECT 
        (games_played >= 5) as qualified,
        elo_rating
      FROM game_stats
      WHERE player_id = ${player.id} AND game_type = ${req.game_type}
    `;

    if (!gameStat || !gameStat.qualified) {
      throw APIError.permissionDenied("Must complete 5 AI games to unlock multiplayer");
    }

    const existingQueue = await db.queryRow<{ player_id: number }>`
      SELECT player_id FROM matchmaking_queue
      WHERE player_id = ${player.id} AND game_type = ${req.game_type}
    `;

    if (existingQueue) {
      return { match_id: null, status: 'searching', estimated_wait: 30 };
    }

    const ELO_RANGE = 200;
    const opponent = await db.queryRow<{ id: number; player_id: number; elo: number }>`
      SELECT id, player_id, elo
      FROM matchmaking_queue
      WHERE game_type = ${req.game_type} 
        AND player_id != ${player.id}
        AND elo BETWEEN ${gameStat.elo_rating - ELO_RANGE} AND ${gameStat.elo_rating + ELO_RANGE}
      ORDER BY created_at ASC
      LIMIT 1
    `;

    if (opponent) {
      await db.exec`
        DELETE FROM matchmaking_queue WHERE id = ${opponent.id}
      `;

      const colors = Math.random() > 0.5 
        ? { p1Color: 'white', p2Color: 'black' } 
        : { p1Color: 'black', p2Color: 'white' };

      const initialState = getInitialGameState(req.game_type);

      const match = await db.queryRow<{ id: number }>`
        INSERT INTO matches (
          game_type, player1_id, player2_id, player1_color, player2_color,
          result, game_state
        )
        VALUES (
          ${req.game_type}, ${player.id}, ${opponent.player_id}, 
          ${colors.p1Color}, ${colors.p2Color}, 'in_progress', ${JSON.stringify(initialState)}
        )
        RETURNING id
      `;

      if (!match) {
        throw APIError.internal("Failed to create match");
      }

      await db.exec`
        INSERT INTO active_games (
          match_id, game_type, player1_id, player2_id,
          current_turn, game_state, is_ai_match
        )
        VALUES (
          ${match.id}, ${req.game_type}, ${player.id}, ${opponent.player_id},
          ${colors.p1Color}, ${JSON.stringify(initialState)}, false
        )
      `;

      return { match_id: match.id, status: 'found' };
    }

    await db.exec`
      INSERT INTO matchmaking_queue (player_id, game_type, elo)
      VALUES (${player.id}, ${req.game_type}, ${gameStat.elo_rating})
    `;

    return { match_id: null, status: 'searching', estimated_wait: 30 };
  }
);

function getInitialGameState(gameType: string): any {
  switch (gameType) {
    case 'chess':
      return {
        board: [
          ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
          ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
          ['.', '.', '.', '.', '.', '.', '.', '.'],
          ['.', '.', '.', '.', '.', '.', '.', '.'],
          ['.', '.', '.', '.', '.', '.', '.', '.'],
          ['.', '.', '.', '.', '.', '.', '.', '.'],
          ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
          ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ],
        currentTurn: 'white',
      };
    case 'connect4':
      return {
        board: Array(6).fill(null).map(() => Array(7).fill(0)),
        currentTurn: 1,
      };
    case 'tictactoe':
      return {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentTurn: 'X',
      };
    default:
      return {};
  }
}
