import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface StartAIGameRequest {
  game_type: string;
  ai_difficulty: number;
}

interface StartAIGameResponse {
  match_id: number;
  game_id: number;
  player_color?: string;
  initial_state: any;
}

export const startAIGame = api<StartAIGameRequest, StartAIGameResponse>(
  { expose: true, method: "POST", path: "/game/ai/start", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const player = await db.queryRow<{ id: number }>`
      SELECT id FROM players WHERE user_id = ${auth.userID}
    `;

    if (!player) {
      throw APIError.notFound("Player not found");
    }

    let gameStat = await db.queryRow<{ id: number }>`
      SELECT id FROM game_stats 
      WHERE player_id = ${player.id} AND game_type = ${req.game_type}
    `;

    if (!gameStat) {
      await db.exec`
        INSERT INTO game_stats (player_id, game_type)
        VALUES (${player.id}, ${req.game_type})
      `;
      gameStat = await db.queryRow<{ id: number }>`
        SELECT id FROM game_stats 
        WHERE player_id = ${player.id} AND game_type = ${req.game_type}
      `;
    }

    const playerColor = req.game_type === 'chess' 
      ? (Math.random() > 0.5 ? 'white' : 'black')
      : undefined;

    const initialState = getInitialGameState(req.game_type);

    const matchResult = await db.queryRow<{ id: number }>`
      INSERT INTO matches (
        game_type, player1_id, is_ai_match, ai_difficulty, 
        player1_color, result, game_state
      )
      VALUES (
        ${req.game_type}, ${player.id}, true, ${req.ai_difficulty},
        ${playerColor || null}, 'in_progress', ${JSON.stringify(initialState)}
      )
      RETURNING id
    `;

    if (!matchResult) {
      throw APIError.internal("Failed to create match");
    }

    const gameResult = await db.queryRow<{ id: number }>`
      INSERT INTO active_games (
        match_id, game_type, player1_id, 
        current_turn, game_state, is_ai_match, ai_difficulty
      )
      VALUES (
        ${matchResult.id}, ${req.game_type}, ${player.id},
        ${playerColor || 'player1'}, ${JSON.stringify(initialState)}, 
        true, ${req.ai_difficulty}
      )
      RETURNING id
    `;

    if (!gameResult) {
      throw APIError.internal("Failed to create active game");
    }

    return {
      match_id: matchResult.id,
      game_id: gameResult.id,
      player_color: playerColor,
      initial_state: initialState,
    };
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
    case 'checkers':
      return {
        board: [
          [0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0],
        ],
        currentTurn: 1,
      };
    case 'tictactoe':
      return {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentTurn: 'X',
      };
    case 'othello':
      return {
        board: Array(8).fill(null).map((_, i) => 
          Array(8).fill(0).map((_, j) => {
            if ((i === 3 && j === 3) || (i === 4 && j === 4)) return 1;
            if ((i === 3 && j === 4) || (i === 4 && j === 3)) return 2;
            return 0;
          })
        ),
        currentTurn: 1,
      };
    default:
      return {};
  }
}
