import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface MakeMoveParams {
  session_id: string;
  move: any;
}

interface GameSession {
  id: string;
  game_type: string;
  player_white: string;
  player_black: string | null;
  is_ai: boolean;
  ai_difficulty?: number;
  current_turn: string;
  game_state: any;
  status: string;
  winner?: string;
  result?: string;
}

export const makeMove = api<MakeMoveParams, GameSession>(
  { auth: true, expose: true, method: "POST", path: "/game/move" },
  async ({ session_id, move }) => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    const session = await db.queryRow<any>`
      SELECT * FROM game_sessions WHERE id = ${session_id}
    `;

    if (!session) {
      throw APIError.notFound("game session not found");
    }

    if (session.status !== "playing") {
      throw APIError.invalidArgument("game not in playing state");
    }

    if (session.current_turn !== user_id) {
      throw APIError.invalidArgument("not your turn");
    }

    const gameState = session.game_state;
    gameState.moveHistory = gameState.moveHistory || [];
    gameState.moveHistory.push(move);

    applyMove(session.game_type, gameState, move);

    const nextPlayer = session.current_turn === session.player_white
      ? session.player_black
      : session.player_white;

    const gameOver = checkGameOver(session.game_type, gameState);

    const updated = await db.queryRow<GameSession>`
      UPDATE game_sessions
      SET game_state = ${JSON.stringify(gameState)},
          current_turn = ${nextPlayer},
          status = ${gameOver.isOver ? "finished" : "playing"},
          winner = ${gameOver.winner || null},
          result = ${gameOver.result || null},
          updated_at = NOW()
      WHERE id = ${session_id}
      RETURNING *
    `;

    if (gameOver.isOver) {
      await recordGameResult(updated!);
    }

    return updated!;
  }
);

function applyMove(gameType: string, gameState: any, move: any): void {
  switch (gameType) {
    case "connect4":
      const col = move.column;
      for (let row = 5; row >= 0; row--) {
        if (!gameState.board[row][col]) {
          gameState.board[row][col] = move.player;
          break;
        }
      }
      break;
    case "tictactoe":
      gameState.board[move.position] = move.player;
      break;
    default:
      gameState.lastMove = move;
  }
}

function checkGameOver(gameType: string, gameState: any): { isOver: boolean; winner?: string; result?: string } {
  switch (gameType) {
    case "connect4":
      return checkConnect4Winner(gameState.board);
    case "tictactoe":
      return checkTicTacToeWinner(gameState.board);
    default:
      return { isOver: false };
  }
}

function checkConnect4Winner(board: any[][]): { isOver: boolean; winner?: string; result?: string } {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const player = board[row][col];
      if (player && board[row][col + 1] === player && board[row][col + 2] === player && board[row][col + 3] === player) {
        return { isOver: true, winner: player, result: "win" };
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const player = board[row][col];
      if (player && board[row + 1][col] === player && board[row + 2][col] === player && board[row + 3][col] === player) {
        return { isOver: true, winner: player, result: "win" };
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const player = board[row][col];
      if (player && board[row + 1][col + 1] === player && board[row + 2][col + 2] === player && board[row + 3][col + 3] === player) {
        return { isOver: true, winner: player, result: "win" };
      }
    }
  }

  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const player = board[row][col];
      if (player && board[row - 1][col + 1] === player && board[row - 2][col + 2] === player && board[row - 3][col + 3] === player) {
        return { isOver: true, winner: player, result: "win" };
      }
    }
  }

  const isFull = board.every(row => row.every(cell => cell !== null));
  if (isFull) {
    return { isOver: true, result: "draw" };
  }

  return { isOver: false };
}

function checkTicTacToeWinner(board: any[]): { isOver: boolean; winner?: string; result?: string } {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { isOver: true, winner: board[a], result: "win" };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { isOver: true, result: "draw" };
  }

  return { isOver: false };
}

async function recordGameResult(session: GameSession): Promise<void> {
  if (!session.winner && !session.result) return;

  await db.exec`
    INSERT INTO game_history (
      session_id, game_type, player_white, player_black, winner, result, moves
    )
    VALUES (
      ${session.id}, ${session.game_type}, ${session.player_white},
      ${session.player_black || "AI"}, ${session.winner || null},
      ${session.result || "draw"}, ${JSON.stringify(session.game_state.moveHistory)}
    )
  `;

  if (!session.is_ai && session.player_black && session.player_black !== "AI") {
    await updateEloRatings(session);
  }

  await updatePlayerStats(session);
}

async function updateEloRatings(session: GameSession): Promise<void> {
  const whiteStats = await db.queryRow<{ elo_rating: number }>`
    SELECT elo_rating FROM game_stats
    WHERE user_id = ${session.player_white} AND game_type = ${session.game_type}
  `;

  const blackStats = await db.queryRow<{ elo_rating: number }>`
    SELECT elo_rating FROM game_stats
    WHERE user_id = ${session.player_black} AND game_type = ${session.game_type}
  `;

  const whiteElo = whiteStats?.elo_rating || 1200;
  const blackElo = blackStats?.elo_rating || 1200;

  const { whiteChange, blackChange } = calculateEloChanges(
    whiteElo,
    blackElo,
    session.winner === session.player_white ? 1 : session.winner === session.player_black ? 0 : 0.5
  );

  await db.exec`
    UPDATE game_history
    SET white_elo_change = ${whiteChange}, black_elo_change = ${blackChange}
    WHERE session_id = ${session.id}
  `;
}

function calculateEloChanges(whiteElo: number, blackElo: number, score: number): { whiteChange: number; blackChange: number } {
  const K = 32;
  const expectedWhite = 1 / (1 + Math.pow(10, (blackElo - whiteElo) / 400));
  const whiteChange = Math.round(K * (score - expectedWhite));
  const blackChange = -whiteChange;

  return { whiteChange, blackChange };
}

async function updatePlayerStats(session: GameSession): Promise<void> {
  const players = [session.player_white];
  if (session.player_black && session.player_black !== "AI") {
    players.push(session.player_black);
  }

  for (const userId of players) {
    const isWinner = session.winner === userId;
    const isDraw = session.result === "draw";

    await db.exec`
      INSERT INTO game_stats (user_id, game_type, wins, losses, draws, total_games, qualification_games)
      VALUES (
        ${userId}, ${session.game_type},
        ${isWinner ? 1 : 0}, ${!isWinner && !isDraw ? 1 : 0}, ${isDraw ? 1 : 0}, 1,
        ${session.is_ai ? 1 : 0}
      )
      ON CONFLICT (user_id, game_type)
      DO UPDATE SET
        wins = game_stats.wins + ${isWinner ? 1 : 0},
        losses = game_stats.losses + ${!isWinner && !isDraw ? 1 : 0},
        draws = game_stats.draws + ${isDraw ? 1 : 0},
        total_games = game_stats.total_games + 1,
        qualification_games = game_stats.qualification_games + ${session.is_ai ? 1 : 0},
        qualified = CASE WHEN game_stats.qualification_games + ${session.is_ai ? 1 : 0} >= 5 THEN true ELSE game_stats.qualified END,
        updated_at = NOW()
    `;

    if (session.winner || session.result === "draw") {
      const stats = await db.queryRow<{ total_games: number }>`
        SELECT total_games FROM game_stats WHERE user_id = ${userId} AND game_type = ${session.game_type}
      `;

      if (stats && stats.total_games >= 10) {
        await updateHeroClass(userId);
      }
    }
  }
}

async function updateHeroClass(userId: string): Promise<void> {
  const stats = await db.queryAll<{ elo_rating: number }>`
    SELECT elo_rating FROM game_stats WHERE user_id = ${userId}
  `;

  const avgElo = stats.reduce((sum, s) => sum + s.elo_rating, 0) / stats.length;

  let heroClass = "Snow Recruit";
  if (avgElo >= 2400) heroClass = "Blizzard Grandmaster";
  else if (avgElo >= 2000) heroClass = "Arctic Champion";
  else if (avgElo >= 1800) heroClass = "Frost Knight";
  else if (avgElo >= 1600) heroClass = "Winter Warrior";
  else if (avgElo >= 1400) heroClass = "Ice Guardian";

  await db.exec`
    UPDATE user_profiles SET hero_class = ${heroClass}, updated_at = NOW() WHERE user_id = ${userId}
  `;
}
