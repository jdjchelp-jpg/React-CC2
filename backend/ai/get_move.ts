import { api } from "encore.dev/api";

interface GetAIMoveParams {
  game_type: string;
  game_state: any;
  difficulty: number;
}

interface AIMoveResponse {
  move: any;
}

export const getAIMove = api<GetAIMoveParams, AIMoveResponse>(
  { expose: true, method: "POST", path: "/ai/move" },
  async ({ game_type, game_state, difficulty }) => {
    const move = calculateAIMove(game_type, game_state, difficulty);
    return { move };
  }
);

function calculateAIMove(gameType: string, gameState: any, difficulty: number): any {
  const depth = Math.min(Math.floor(difficulty / 500) + 1, 6);

  switch (gameType) {
    case "connect4":
      return getConnect4Move(gameState.board, depth);
    case "tictactoe":
      return getTicTacToeMove(gameState.board, depth);
    case "checkers":
      return getCheckersMove(gameState.board, depth);
    case "chess":
      return getChessMove(gameState.board, depth);
    case "othello":
      return getOthelloMove(gameState.board, depth);
    default:
      return null;
  }
}

function getConnect4Move(board: any[][], depth: number): any {
  const availableCols = [];
  for (let col = 0; col < 7; col++) {
    if (!board[0][col]) availableCols.push(col);
  }

  if (availableCols.length === 0) return null;

  if (depth === 1) {
    return { column: availableCols[Math.floor(Math.random() * availableCols.length)], player: "AI" };
  }

  let bestCol = availableCols[0];
  let bestScore = -Infinity;

  for (const col of availableCols) {
    const testBoard = board.map(row => [...row]);
    for (let row = 5; row >= 0; row--) {
      if (!testBoard[row][col]) {
        testBoard[row][col] = "AI";
        const score = minimax(testBoard, depth - 1, false, -Infinity, Infinity, "connect4");
        if (score > bestScore) {
          bestScore = score;
          bestCol = col;
        }
        break;
      }
    }
  }

  return { column: bestCol, player: "AI" };
}

function getTicTacToeMove(board: any[], depth: number): any {
  const available = board.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1);

  if (available.length === 0) return null;

  if (depth === 1) {
    return { position: available[Math.floor(Math.random() * available.length)], player: "AI" };
  }

  let bestPos = available[0];
  let bestScore = -Infinity;

  for (const pos of available) {
    const testBoard = [...board];
    testBoard[pos] = "AI";
    const score = minimax(testBoard, depth - 1, false, -Infinity, Infinity, "tictactoe");
    if (score > bestScore) {
      bestScore = score;
      bestPos = pos;
    }
  }

  return { position: bestPos, player: "AI" };
}

function getCheckersMove(board: any[][], depth: number): any {
  return { from: [0, 0], to: [1, 1], player: "AI" };
}

function getChessMove(board: any[][], depth: number): any {
  return { from: [0, 0], to: [1, 1], player: "AI" };
}

function getOthelloMove(board: any[][], depth: number): any {
  return { row: 0, col: 0, player: "AI" };
}

function minimax(board: any, depth: number, isMaximizing: boolean, alpha: number, beta: number, gameType: string): number {
  if (depth === 0) return 0;

  const result = evaluateBoard(board, gameType);
  if (result !== null) return result;

  if (isMaximizing) {
    let maxScore = -Infinity;
    const moves = getPossibleMoves(board, "AI", gameType);
    for (const move of moves) {
      const newBoard = applyTestMove(board, move, "AI", gameType);
      const score = minimax(newBoard, depth - 1, false, alpha, beta, gameType);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    const moves = getPossibleMoves(board, "player", gameType);
    for (const move of moves) {
      const newBoard = applyTestMove(board, move, "player", gameType);
      const score = minimax(newBoard, depth - 1, true, alpha, beta, gameType);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

function evaluateBoard(board: any, gameType: string): number | null {
  if (gameType === "connect4") {
    const winner = checkConnect4WinnerSimple(board);
    if (winner === "AI") return 100;
    if (winner === "player") return -100;
    if (board.every((row: any[]) => row.every((cell: any) => cell !== null))) return 0;
    return null;
  }

  if (gameType === "tictactoe") {
    const winner = checkTicTacToeWinnerSimple(board);
    if (winner === "AI") return 100;
    if (winner === "player") return -100;
    if (board.every((cell: any) => cell !== null)) return 0;
    return null;
  }

  return null;
}

function checkConnect4WinnerSimple(board: any[][]): string | null {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const player = board[row][col];
      if (player && board[row][col + 1] === player && board[row][col + 2] === player && board[row][col + 3] === player) {
        return player;
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const player = board[row][col];
      if (player && board[row + 1][col] === player && board[row + 2][col] === player && board[row + 3][col] === player) {
        return player;
      }
    }
  }

  return null;
}

function checkTicTacToeWinnerSimple(board: any[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function getPossibleMoves(board: any, player: string, gameType: string): any[] {
  if (gameType === "connect4") {
    const moves = [];
    for (let col = 0; col < 7; col++) {
      if (!board[0][col]) moves.push({ column: col });
    }
    return moves;
  }

  if (gameType === "tictactoe") {
    return board.map((cell: any, idx: number) => cell === null ? { position: idx } : null).filter(Boolean);
  }

  return [];
}

function applyTestMove(board: any, move: any, player: string, gameType: string): any {
  if (gameType === "connect4") {
    const newBoard = board.map((row: any[]) => [...row]);
    for (let row = 5; row >= 0; row--) {
      if (!newBoard[row][move.column]) {
        newBoard[row][move.column] = player;
        break;
      }
    }
    return newBoard;
  }

  if (gameType === "tictactoe") {
    const newBoard = [...board];
    newBoard[move.position] = player;
    return newBoard;
  }

  return board;
}
