import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface MakeAIMoveRequest {
  game_id: number;
  move: any;
}

interface MakeAIMoveResponse {
  success: boolean;
  game_state: any;
  game_over: boolean;
  result?: 'win' | 'loss' | 'draw';
}

export const makeAIMove = api<MakeAIMoveRequest, MakeAIMoveResponse>(
  { expose: true, method: "POST", path: "/game/ai/make-move", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const game = await db.queryRow<{
      id: number;
      match_id: number;
      game_type: string;
      game_state: any;
      move_history: any;
      player1_id: number;
    }>`
      SELECT id, match_id, game_type, game_state, move_history, player1_id
      FROM active_games
      WHERE id = ${req.game_id} AND is_ai_match = true
    `;

    if (!game) {
      throw APIError.notFound("Game not found");
    }

    const player = await db.queryRow<{ id: number }>`
      SELECT id FROM players WHERE user_id = ${auth.userID}
    `;

    if (!player || player.id !== game.player1_id) {
      throw APIError.permissionDenied("Not your game");
    }

    const gameState = typeof game.game_state === 'string' 
      ? JSON.parse(game.game_state) 
      : game.game_state;

    const moveHistory = typeof game.move_history === 'string'
      ? JSON.parse(game.move_history)
      : (game.move_history || []);

    moveHistory.push({ player: 'human', move: req.move, timestamp: new Date() });

    const updatedState = applyMove(gameState, req.move, game.game_type, 'player');

    await db.exec`
      UPDATE active_games
      SET game_state = ${JSON.stringify(updatedState)},
          move_history = ${JSON.stringify(moveHistory)},
          last_move_at = NOW(),
          updated_at = NOW()
      WHERE id = ${req.game_id}
    `;

    const gameOver = checkGameOver(updatedState, game.game_type);
    let result: 'win' | 'loss' | 'draw' | undefined;

    if (gameOver) {
      result = determineResult(updatedState, game.game_type);
      await finishGame(game.match_id, game.id, result, player.id, game.game_type);
    }

    return {
      success: true,
      game_state: updatedState,
      game_over: gameOver,
      result,
    };
  }
);

function applyMove(state: any, move: any, gameType: string, player: string): any {
  const newState = JSON.parse(JSON.stringify(state));
  
  switch (gameType) {
    case 'tictactoe':
      if (newState.board[move.row][move.col] === '') {
        newState.board[move.row][move.col] = player === 'player' ? 'X' : 'O';
        newState.currentTurn = newState.currentTurn === 'X' ? 'O' : 'X';
      }
      break;
    case 'connect4':
      for (let row = 5; row >= 0; row--) {
        if (newState.board[row][move.col] === 0) {
          newState.board[row][move.col] = player === 'player' ? 1 : 2;
          newState.currentTurn = newState.currentTurn === 1 ? 2 : 1;
          break;
        }
      }
      break;
  }
  
  return newState;
}

function checkGameOver(state: any, gameType: string): boolean {
  switch (gameType) {
    case 'tictactoe':
      for (let i = 0; i < 3; i++) {
        if (state.board[i][0] && state.board[i][0] === state.board[i][1] && state.board[i][1] === state.board[i][2]) return true;
        if (state.board[0][i] && state.board[0][i] === state.board[1][i] && state.board[1][i] === state.board[2][i]) return true;
      }
      if (state.board[0][0] && state.board[0][0] === state.board[1][1] && state.board[1][1] === state.board[2][2]) return true;
      if (state.board[0][2] && state.board[0][2] === state.board[1][1] && state.board[1][1] === state.board[2][0]) return true;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (state.board[i][j] === '') return false;
        }
      }
      return true;
  }
  return false;
}

function determineResult(state: any, gameType: string): 'win' | 'loss' | 'draw' {
  switch (gameType) {
    case 'tictactoe':
      for (let i = 0; i < 3; i++) {
        if (state.board[i][0] === 'X' && state.board[i][1] === 'X' && state.board[i][2] === 'X') return 'win';
        if (state.board[0][i] === 'X' && state.board[1][i] === 'X' && state.board[2][i] === 'X') return 'win';
        if (state.board[i][0] === 'O' && state.board[i][1] === 'O' && state.board[i][2] === 'O') return 'loss';
        if (state.board[0][i] === 'O' && state.board[1][i] === 'O' && state.board[2][i] === 'O') return 'loss';
      }
      if (state.board[0][0] === 'X' && state.board[1][1] === 'X' && state.board[2][2] === 'X') return 'win';
      if (state.board[0][2] === 'X' && state.board[1][1] === 'X' && state.board[2][0] === 'X') return 'win';
      if (state.board[0][0] === 'O' && state.board[1][1] === 'O' && state.board[2][2] === 'O') return 'loss';
      if (state.board[0][2] === 'O' && state.board[1][1] === 'O' && state.board[2][0] === 'O') return 'loss';
  }
  return 'draw';
}

async function finishGame(matchId: number, gameId: number, result: string, playerId: number, gameType: string) {
  await db.exec`
    DELETE FROM active_games WHERE id = ${gameId}
  `;

  await db.exec`
    UPDATE matches
    SET result = ${result}, completed_at = NOW()
    WHERE id = ${matchId}
  `;

  const currentStats = await db.queryRow<{ 
    elo_rating: number; 
    games_played: number;
    wins: number;
    losses: number;
    draws: number;
    ai_games: number;
  }>`
    SELECT elo_rating, games_played, wins, losses, draws, ai_games
    FROM game_stats
    WHERE player_id = ${playerId} AND game_type = ${gameType}
  `;

  if (currentStats) {
    const newElo = result === 'win' 
      ? currentStats.elo_rating + 25 
      : result === 'loss' 
        ? Math.max(800, currentStats.elo_rating - 15)
        : currentStats.elo_rating + 5;

    await db.exec`
      UPDATE game_stats
      SET elo_rating = ${newElo},
          games_played = ${currentStats.games_played + 1},
          wins = ${result === 'win' ? currentStats.wins + 1 : currentStats.wins},
          losses = ${result === 'loss' ? currentStats.losses + 1 : currentStats.losses},
          draws = ${result === 'draw' ? currentStats.draws + 1 : currentStats.draws},
          ai_games = ${currentStats.ai_games + 1},
          updated_at = NOW()
      WHERE player_id = ${playerId} AND game_type = ${gameType}
    `;
  }
}
