export interface ChessMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

export interface Connect4Move {
  col: number;
}

export interface CheckersMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
  jumps?: Array<{ row: number; col: number }>;
}

export interface TicTacToeMove {
  row: number;
  col: number;
}

export interface OthelloMove {
  row: number;
  col: number;
}

function getRandomMove<T>(validMoves: T[]): T {
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function scaleEloToDepth(elo: number, maxDepth: number = 6): number {
  if (elo <= 800) return 1;
  if (elo <= 1200) return 2;
  if (elo <= 1600) return 3;
  if (elo <= 2000) return 4;
  if (elo <= 2400) return 5;
  return maxDepth;
}

export function getChessMove(board: string[][], aiColor: 'black' | 'white', aiElo: number): ChessMove | null {
  const validMoves: ChessMove[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === '.') continue;
      
      const isAIPiece = aiColor === 'white' 
        ? piece === piece.toUpperCase() 
        : piece === piece.toLowerCase();
      
      if (!isAIPiece) continue;
      
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (row === toRow && col === toCol) continue;
          validMoves.push({ from: { row, col }, to: { row: toRow, col: toCol } });
        }
      }
    }
  }
  
  if (validMoves.length === 0) return null;
  return getRandomMove(validMoves);
}

export function getConnect4Move(board: number[][], aiPlayer: 1 | 2, aiElo: number): Connect4Move | null {
  const validMoves: Connect4Move[] = [];
  
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === 0) {
      validMoves.push({ col });
    }
  }
  
  if (validMoves.length === 0) return null;
  return getRandomMove(validMoves);
}

export function getCheckersMove(board: number[][], aiPlayer: 1 | 2, aiElo: number): CheckersMove | null {
  const validMoves: CheckersMove[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== aiPlayer && piece !== aiPlayer + 2) continue;
      
      const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol] === 0) {
          validMoves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
        }
      }
    }
  }
  
  if (validMoves.length === 0) return null;
  return getRandomMove(validMoves);
}

export function getTicTacToeMove(board: string[][], aiSymbol: 'X' | 'O', aiElo: number): TicTacToeMove | null {
  const validMoves: TicTacToeMove[] = [];
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === '') {
        validMoves.push({ row, col });
      }
    }
  }
  
  if (validMoves.length === 0) return null;
  
  if (aiElo < 1000) {
    return getRandomMove(validMoves);
  }
  
  const opponent = aiSymbol === 'X' ? 'O' : 'X';
  
  for (const move of validMoves) {
    const testBoard = board.map(r => [...r]);
    testBoard[move.row][move.col] = aiSymbol;
    if (checkWin(testBoard, aiSymbol)) {
      return move;
    }
  }
  
  for (const move of validMoves) {
    const testBoard = board.map(r => [...r]);
    testBoard[move.row][move.col] = opponent;
    if (checkWin(testBoard, opponent)) {
      return move;
    }
  }
  
  if (board[1][1] === '') return { row: 1, col: 1 };
  
  return getRandomMove(validMoves);
}

function checkWin(board: string[][], symbol: string): boolean {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === symbol && board[i][1] === symbol && board[i][2] === symbol) return true;
    if (board[0][i] === symbol && board[1][i] === symbol && board[2][i] === symbol) return true;
  }
  if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true;
  if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true;
  return false;
}

export function getOthelloMove(board: number[][], aiPlayer: 1 | 2, aiElo: number): OthelloMove | null {
  const validMoves: OthelloMove[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 0 && isValidOthelloMove(board, row, col, aiPlayer)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  if (validMoves.length === 0) return null;
  return getRandomMove(validMoves);
}

function isValidOthelloMove(board: number[][], row: number, col: number, player: number): boolean {
  const directions = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
  const opponent = player === 1 ? 2 : 1;
  
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let hasOpponent = false;
    
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === 0) break;
      if (board[r][c] === opponent) {
        hasOpponent = true;
      } else if (board[r][c] === player && hasOpponent) {
        return true;
      } else {
        break;
      }
      r += dr;
      c += dc;
    }
  }
  
  return false;
}
