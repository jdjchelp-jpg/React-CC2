import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { randomUUID } from "crypto";

interface CreateGameParams {
  game_type: string;
  is_ai: boolean;
  ai_difficulty?: number;
}

interface GameSession {
  id: string;
  game_type: string;
  player_white: string;
  player_black?: string;
  is_ai: boolean;
  ai_difficulty?: number;
  status: string;
  current_turn: string;
  game_state: any;
}

export const create = api<CreateGameParams, GameSession>(
  { auth: true, expose: true, method: "POST", path: "/game/create" },
  async ({ game_type, is_ai, ai_difficulty }) => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    const sessionId = randomUUID();
    const initialState = getInitialGameState(game_type);

    const session = await db.queryRow<GameSession>`
      INSERT INTO game_sessions (
        id, game_type, player_white, player_black, is_ai, ai_difficulty,
        status, current_turn, game_state
      )
      VALUES (
        ${sessionId}, ${game_type}, ${user_id},
        ${is_ai ? "AI" : null}, ${is_ai}, ${ai_difficulty || null},
        ${is_ai ? "playing" : "waiting"}, ${user_id}, ${JSON.stringify(initialState)}
      )
      RETURNING id, game_type, player_white, player_black, is_ai, ai_difficulty, status, current_turn, game_state
    `;

    return session!;
  }
);

function getInitialGameState(gameType: string): any {
  switch (gameType) {
    case "chess":
      return { board: getInitialChessBoard(), moveHistory: [] };
    case "connect4":
      return { board: Array(6).fill(null).map(() => Array(7).fill(null)), moveHistory: [] };
    case "checkers":
      return { board: getInitialCheckersBoard(), moveHistory: [] };
    case "tictactoe":
      return { board: Array(9).fill(null), moveHistory: [] };
    case "othello":
      return { board: getInitialOthelloBoard(), moveHistory: [] };
    case "memory":
      return { cards: [], flipped: [], matched: [], moveHistory: [] };
    case "tower":
      return { blocks: [], height: 0, moveHistory: [] };
    case "reindeer":
      return { score: 0, obstacles: [], position: 0 };
    default:
      return {};
  }
}

function getInitialChessBoard(): string[][] {
  return [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];
}

function getInitialCheckersBoard(): string[][] {
  const board = Array(8).fill(null).map(() => Array(8).fill("."));
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "b";
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "r";
    }
  }
  return board;
}

function getInitialOthelloBoard(): string[][] {
  const board = Array(8).fill(null).map(() => Array(8).fill("."));
  board[3][3] = "w";
  board[3][4] = "b";
  board[4][3] = "b";
  board[4][4] = "w";
  return board;
}
