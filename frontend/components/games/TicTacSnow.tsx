import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ArrowLeft, Snowflake } from 'lucide-react';
import AIDifficultySelector from '../shared/AIDifficultySelector';

interface TicTacSnowProps {
  onBack: () => void;
}

type GameMode = 'menu' | 'playing';

export default function TicTacSnow({ onBack }: TicTacSnowProps) {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [aiDifficulty, setAiDifficulty] = useState(1200);
  const [board, setBoard] = useState<string[][]>([['', '', ''], ['', '', ''], ['', '', '']]);
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);

  const startAIGame = () => {
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setCurrentTurn('X');
    setWinner(null);
    setGameMode('playing');
  };

  const checkWinner = (b: string[][]): string | null => {
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
      if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    return null;
  };

  const isBoardFull = (b: string[][]): boolean => {
    return b.every(row => row.every(cell => cell !== ''));
  };

  const getEmptyCells = (b: string[][]): [number, number][] => {
    const empty: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j] === '') empty.push([i, j]);
      }
    }
    return empty;
  };

  const minimax = (b: string[][], isMaximizing: boolean, depth: number): number => {
    const gameWinner = checkWinner(b);
    if (gameWinner === 'O') return 10 - depth;
    if (gameWinner === 'X') return depth - 10;
    if (isBoardFull(b)) return 0;

    const emptyCells = getEmptyCells(b);
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const [row, col] of emptyCells) {
        b[row][col] = 'O';
        const score = minimax(b, false, depth + 1);
        b[row][col] = '';
        maxScore = Math.max(maxScore, score);
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const [row, col] of emptyCells) {
        b[row][col] = 'X';
        const score = minimax(b, true, depth + 1);
        b[row][col] = '';
        minScore = Math.min(minScore, score);
      }
      return minScore;
    }
  };

  const getAIMove = (b: string[][]): [number, number] => {
    const emptyCells = getEmptyCells(b);
    
    if (aiDifficulty < 1100) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (aiDifficulty < 1300) {
      for (const [row, col] of emptyCells) {
        b[row][col] = 'O';
        if (checkWinner(b) === 'O') {
          b[row][col] = '';
          return [row, col];
        }
        b[row][col] = '';
      }
      
      for (const [row, col] of emptyCells) {
        b[row][col] = 'X';
        if (checkWinner(b) === 'X') {
          b[row][col] = '';
          return [row, col];
        }
        b[row][col] = '';
      }
      
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
      let bestScore = -Infinity;
      let bestMove: [number, number] = emptyCells[0];
      
      for (const [row, col] of emptyCells) {
        b[row][col] = 'O';
        const score = minimax(b, false, 0);
        b[row][col] = '';
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = [row, col];
        }
      }
      
      return bestMove;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== '' || currentTurn !== 'X' || winner) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      return;
    }

    setCurrentTurn('O');

    setTimeout(() => {
      const [aiRow, aiCol] = getAIMove(newBoard);
      newBoard[aiRow][aiCol] = 'O';
      setBoard(newBoard);

      const aiWinner = checkWinner(newBoard);
      if (aiWinner) {
        setWinner(aiWinner);
      } else if (isBoardFull(newBoard)) {
        setWinner('draw');
      } else {
        setCurrentTurn('X');
      }
    }, 300);
  };

  const getSymbolIcon = (symbol: string) => {
    if (symbol === 'X') return '❄️';
    if (symbol === 'O') return '🔴';
    return '';
  };

  if (winner) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-cyan-100 to-blue-200 border-4 border-blue-500 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 border-b-4 border-white">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">
              {winner === 'X' ? '🎉' : winner === 'O' ? '🤖' : '🤝'}
            </div>
            <div className="text-2xl font-bold mb-6">
              {winner === 'X' && 'You Win!'}
              {winner === 'O' && 'AI Wins!'}
              {winner === 'draw' && "It's a Draw!"}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={startAIGame} className="bg-cyan-600 hover:bg-cyan-700">
                Play Again
              </Button>
              <Button onClick={onBack} variant="outline">
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
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-cyan-100 to-blue-200 border-4 border-blue-500 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 border-b-4 border-white">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
              <Snowflake className="w-8 h-8" />
              Tic-Tac-Snow
              <Snowflake className="w-8 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-cyan-400">
                <div className="grid grid-cols-3 gap-4">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 border-4 border-blue-300 rounded-lg flex items-center justify-center text-6xl cursor-pointer hover:scale-105 transition-transform hover:shadow-xl"
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {getSymbolIcon(cell)}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-center text-lg font-bold">
                {currentTurn === 'X' ? (
                  <span className="text-blue-600">Your Turn (Snowflake)</span>
                ) : (
                  <span className="text-red-600">AI's Turn (Ornament)...</span>
                )}
              </div>

              <Button
                onClick={() => {
                  setGameMode('menu');
                  setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
                }}
                variant="outline"
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
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border-4 border-cyan-400 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center">❄️ Tic-Tac-Snow 🔴</CardTitle>
          <p className="text-center text-gray-300 mt-2">Snowflake vs ornament showdown!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AIDifficultySelector difficulty={aiDifficulty} onChange={setAiDifficulty} />
          <Button onClick={startAIGame} className="w-full bg-cyan-600 hover:bg-cyan-700 text-lg py-6">
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
