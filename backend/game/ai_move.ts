import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { 
  getChessMove, getConnect4Move, getCheckersMove, 
  getTicTacToeMove, getOthelloMove 
} from "./lib/ai_engines";

interface AIMoveRequest {
  game_id: number;
}

interface AIMoveResponse {
  move: any;
  game_state: any;
}

export const getAIMove = api<AIMoveRequest, AIMoveResponse>(
  { expose: true, method: "POST", path: "/game/ai/move", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const game = await db.queryRow<{
      id: number;
      game_type: string;
      game_state: any;
      ai_difficulty: number;
      player1_id: number;
    }>`
      SELECT ag.id, ag.game_type, ag.game_state, ag.ai_difficulty, ag.player1_id
      FROM active_games ag
      WHERE ag.id = ${req.game_id} AND ag.is_ai_match = true
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

    let aiMove: any = null;

    switch (game.game_type) {
      case 'chess':
        aiMove = getChessMove(gameState.board, 'black', game.ai_difficulty);
        break;
      case 'connect4':
        aiMove = getConnect4Move(gameState.board, 2, game.ai_difficulty);
        break;
      case 'checkers':
        aiMove = getCheckersMove(gameState.board, 2, game.ai_difficulty);
        break;
      case 'tictactoe':
        aiMove = getTicTacToeMove(gameState.board, 'O', game.ai_difficulty);
        break;
      case 'othello':
        aiMove = getOthelloMove(gameState.board, 2, game.ai_difficulty);
        break;
      default:
        throw APIError.invalidArgument("Unsupported game type");
    }

    if (!aiMove) {
      throw APIError.internal("AI could not find a move");
    }

    return {
      move: aiMove,
      game_state: gameState,
    };
  }
);
