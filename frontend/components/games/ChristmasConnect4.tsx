import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ArrowLeft, Sparkles } from 'lucide-react';
import AIDifficultySelector from '../shared/AIDifficultySelector';

interface Connect4Props {
  onBack: () => void;
}

type GameMode = 'menu' | 'playing';

const ROWS = 6;
const COLS = 7;

export default function ChristmasConnect4({ onBack }: Connect4Props) {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [aiDifficulty, setAiDifficulty] = useState(1200);
  const [board, setBoard] = useState<number[][]>(initializeBoard());
  const [currentTurn, setCurrentTurn] = useState(1);
  const [winner, setWinner] = useState<number | null>(null);

  function initializeBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  }

  const startAIGame = () => {
    setBoard(initializeBoard());
    setCurrentTurn(1);
    setWinner(null);
    setGameMode('playing');
  };

  const checkWinner = (b: number[][]): number | null => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (b[row][col] !== 0 && 
            b[row][col] === b[row][col + 1] && 
            b[row][col] === b[row][col + 2] && 
            b[row][col] === b[row][col + 3]) {
          return b[row][col];
        }
      }
    }

    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS; col++) {
        if (b[row][col] !== 0 && 
            b[row][col] === b[row + 1][col] && 
            b[row][col] === b[row + 2][col] && 
            b[row][col] === b[row + 3][col]) {
          return b[row][col];
        }
      }
    }

    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (b[row][col] !== 0 && 
            b[row][col] === b[row + 1][col + 1] && 
            b[row][col] === b[row + 2][col + 2] && 
            b[row][col] === b[row + 3][col + 3]) {
          return b[row][col];
        }
      }
    }

    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (b[row][col] !== 0 && 
            b[row][col] === b[row - 1][col + 1] && 
            b[row][col] === b[row - 2][col + 2] && 
            b[row][col] === b[row - 3][col + 3]) {
          return b[row][col];
        }
      }
    }

    return null;
  };

  const isBoardFull = (b: number[][]): boolean => {
    return b[0].every(cell => cell !== 0);
  };

  const getValidColumns = (b: number[][]): number[] => {
    const cols: number[] = [];
    for (let col = 0; col < COLS; col++) {
      if (b[0][col] === 0) cols.push(col);
    }
    return cols;
  };

  const dropPiece = (b: number[][], col: number, player: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (b[row][col] === 0) {
        b[row][col] = player;
        return row;
      }
    }
    return -1;
  };

  const removePiece = (b: number[][], col: number): void => {
    for (let row = 0; row < ROWS; row++) {
      if (b[row][col] !== 0) {
        b[row][col] = 0;
        return;
      }
    }
  };

  const evaluateWindow = (window: number[], player: number): number => {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    
    const playerCount = window.filter(c => c === player).length;
    const opponentCount = window.filter(c => c === opponent).length;
    const emptyCount = window.filter(c => c === 0).length;

    if (playerCount === 4) score += 100;
    else if (playerCount === 3 && emptyCount === 1) score += 5;
    else if (playerCount === 2 && emptyCount === 2) score += 2;

    if (opponentCount === 3 && emptyCount === 1) score -= 4;

    return score;
  };

  const scorePosition = (b: number[][], player: number): number => {
    let score = 0;

    const centerArray = b.map(row => row[3]);
    const centerCount = centerArray.filter(c => c === player).length;
    score += centerCount * 3;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const window = [b[row][col], b[row][col + 1], b[row][col + 2], b[row][col + 3]];
        score += evaluateWindow(window, player);
      }
    }

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const window = [b[row][col], b[row + 1][col], b[row + 2][col], b[row + 3][col]];
        score += evaluateWindow(window, player);
      }
    }

    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const window = [b[row][col], b[row + 1][col + 1], b[row + 2][col + 2], b[row + 3][col + 3]];
        score += evaluateWindow(window, player);
      }
    }

    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const window = [b[row][col], b[row - 1][col + 1], b[row - 2][col + 2], b[row - 3][col + 3]];
        score += evaluateWindow(window, player);
      }
    }

    return score;
  };

  const minimax = (b: number[][], depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number => {
    const validCols = getValidColumns(b);
    const gameWinner = checkWinner(b);
    
    if (depth === 0 || validCols.length === 0 || gameWinner !== null) {
      if (gameWinner === 2) return 100000;
      else if (gameWinner === 1) return -100000;
      else if (validCols.length === 0) return 0;
      else return scorePosition(b, 2);
    }

    if (maximizingPlayer) {
      let value = -Infinity;
      for (const col of validCols) {
        dropPiece(b, col, 2);
        value = Math.max(value, minimax(b, depth - 1, alpha, beta, false));
        removePiece(b, col);
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return value;
    } else {
      let value = Infinity;
      for (const col of validCols) {
        dropPiece(b, col, 1);
        value = Math.min(value, minimax(b, depth - 1, alpha, beta, true));
        removePiece(b, col);
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return value;
    }
  };

  const getAIMove = (b: number[][]): number => {
    const validCols = getValidColumns(b);
    
    if (aiDifficulty < 1100) {
      return validCols[Math.floor(Math.random() * validCols.length)];
    } else if (aiDifficulty < 1300) {
      for (const col of validCols) {
        dropPiece(b, col, 2);
        if (checkWinner(b) === 2) {
          removePiece(b, col);
          return col;
        }
        removePiece(b, col);
      }
      
      for (const col of validCols) {
        dropPiece(b, col, 1);
        if (checkWinner(b) === 1) {
          removePiece(b, col);
          return col;
        }
        removePiece(b, col);
      }
      
      return validCols[Math.floor(Math.random() * validCols.length)];
    } else {
      const depth = aiDifficulty >= 1400 ? 5 : 4;
      let bestScore = -Infinity;
      let bestCol = validCols[0];

      for (const col of validCols) {
        dropPiece(b, col, 2);
        const score = minimax(b, depth - 1, -Infinity, Infinity, false);
        removePiece(b, col);
        
        if (score > bestScore) {
          bestScore = score;
          bestCol = col;
        }
      }
      
      return bestCol;
    }
  };

  const handleColumnClick = (col: number) => {
    if (currentTurn !== 1 || winner) return;

    const validCols = getValidColumns(board);
    if (!validCols.includes(col)) return;

    const newBoard = board.map(r => [...r]);
    dropPiece(newBoard, col, 1);
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner(0);
      return;
    }

    setCurrentTurn(2);

    setTimeout(() => {
      const aiCol = getAIMove(newBoard);
      dropPiece(newBoard, aiCol, 2);
      setBoard([...newBoard]);

      const aiWinner = checkWinner(newBoard);
      if (aiWinner) {
        setWinner(aiWinner);
      } else if (isBoardFull(newBoard)) {
        setWinner(0);
      } else {
        setCurrentTurn(1);
      }
    }, 500);
  };

  const getPieceColor = (value: number) => {
    if (value === 1) return 'bg-red-500 shadow-lg shadow-red-500/50';
    if (value === 2) return 'bg-green-500 shadow-lg shadow-green-500/50';
    return 'bg-blue-100/30';
  };

  const getPieceIcon = (value: number) => {
    if (value === 1) return '🔴';
    if (value === 2) return '🟢';
    return '';
  };

  if (winner !== null) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-4 border-yellow-400 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">
              {winner === 1 ? '🎉' : winner === 2 ? '🤖' : '🤝'}
            </div>
            <div className="text-2xl font-bold text-white mb-6">
              {winner === 1 && 'You Win!'}
              {winner === 2 && 'AI Wins!'}
              {winner === 0 && "It's a Draw!"}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={startAIGame} className="bg-blue-600 hover:bg-blue-700">
                Play Again
              </Button>
              <Button onClick={onBack} variant="outline" className="bg-white/10 border-white text-white">
                Back to Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameMode === 'playing') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-4 border-yellow-400 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              Christmas Connect 4
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-blue-800 p-6 rounded-2xl border-4 border-blue-400 shadow-2xl">
                <div className="grid grid-cols-7 gap-2">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${getPieceColor(cell)}`}
                        onClick={() => handleColumnClick(colIndex)}
                      >
                        <span className="text-3xl">{getPieceIcon(cell)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-center text-white text-lg font-bold">
                {currentTurn === 1 ? 'Your Turn (Red)' : "AI's Turn (Green)..."}
              </div>

              <Button
                onClick={() => {
                  setGameMode('menu');
                  setBoard(initializeBoard());
                }}
                variant="outline"
                className="bg-white/10 border-white text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Resign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border-4 border-yellow-400 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center">🔴 Christmas Connect 4 🟢</CardTitle>
          <p className="text-center text-gray-300 mt-2">Align festive ornaments to win!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AIDifficultySelector difficulty={aiDifficulty} onChange={setAiDifficulty} />
          <Button onClick={startAIGame} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
            <Bot className="w-6 h-6 mr-2" />
            Play vs AI
          </Button>

          <Button onClick={onBack} variant="outline" className="w-full bg-white/10 border-white text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
