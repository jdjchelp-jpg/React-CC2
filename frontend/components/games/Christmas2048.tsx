import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3x3, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Grid = (number | null)[][];

const emojis: { [key: number]: string } = {
  2: '🎄',
  4: '⛄',
  8: '🎅',
  16: '🎁',
  32: '🔔',
  64: '⭐',
  128: '🕯️',
  256: '🦌',
  512: '🍪',
  1024: '🎉',
  2048: '👑',
  4096: '💎'
};

export default function Christmas2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver]);

  const initGame = () => {
    const newGrid: Grid = Array(4).fill(null).map(() => Array(4).fill(null));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const addRandomTile = (g: Grid) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (g[i][j] === null) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      g[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveAndMerge = (line: (number | null)[]) => {
      const filtered = line.filter(cell => cell !== null) as number[];
      const merged: number[] = [];
      let skip = false;

      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const newValue = filtered[i] * 2;
          merged.push(newValue);
          newScore += newValue;
          skip = true;
          
          if (newValue === 2048 && !won) {
            setWon(true);
          }
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      return merged.map(n => n === 0 ? null : n);
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const newRow = moveAndMerge(newGrid[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const reversed = [...newGrid[i]].reverse();
        const newRow = moveAndMerge(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
        const newCol = moveAndMerge(column);
        if (JSON.stringify(newCol) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = newCol[i];
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]];
        const newCol = moveAndMerge(column);
        if (JSON.stringify(newCol) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) {
          newGrid[3 - i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const canMove = (g: Grid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (g[i][j] === null) return true;
        
        if (j < 3 && g[i][j] === g[i][j + 1]) return true;
        if (i < 3 && g[i][j] === g[i + 1][j]) return true;
      }
    }
    return false;
  };

  const getTileColor = (value: number | null) => {
    if (!value) return 'bg-white/10';
    
    const colors: { [key: number]: string } = {
      2: 'bg-red-500/40',
      4: 'bg-blue-500/40',
      8: 'bg-green-500/40',
      16: 'bg-yellow-500/40',
      32: 'bg-purple-500/40',
      64: 'bg-pink-500/40',
      128: 'bg-orange-500/40',
      256: 'bg-teal-500/40',
      512: 'bg-indigo-500/40',
      1024: 'bg-rose-500/40',
      2048: 'bg-amber-500/40',
    };
    
    return colors[value] || 'bg-white/20';
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Grid3x3 className="w-6 h-6" />
          Christmas 2048
        </h2>
        <div className="text-white font-bold">
          Score: {score}
        </div>
      </div>

      {won && (
        <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4 mb-4">
          <p className="text-green-100 font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            You reached 2048! Keep going!
          </p>
        </div>
      )}

      <div className="mb-4 space-y-2">
        <p className="text-white/80 text-sm">Use arrow keys or buttons to move tiles</p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => move('up')}
            disabled={gameOver}
            className="bg-white/20 hover:bg-white/30"
            size="sm"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => move('left')}
            disabled={gameOver}
            className="bg-white/20 hover:bg-white/30"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => move('down')}
            disabled={gameOver}
            className="bg-white/20 hover:bg-white/30"
            size="sm"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => move('right')}
            disabled={gameOver}
            className="bg-white/20 hover:bg-white/30"
            size="sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 bg-white/5 p-2 rounded-lg">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`aspect-square flex items-center justify-center rounded-lg ${getTileColor(cell)} transition-all duration-200`}
            >
              {cell && (
                <div className="text-center">
                  <div className="text-3xl">{emojis[cell] || '🎄'}</div>
                  <div className="text-xs text-white font-bold mt-1">{cell}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-white">Game Over!</div>
          <div className="text-lg text-white">Final Score: {score}</div>
        </div>
      )}

      <Button
        onClick={initGame}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </Card>
  );
}
