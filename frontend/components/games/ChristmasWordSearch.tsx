import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw, Trophy } from 'lucide-react';

const words = ['SANTA', 'RUDOLPH', 'SLEIGH', 'GIFTS', 'SNOW', 'TREE', 'BELLS', 'STAR'];

type Cell = {
  letter: string;
  row: number;
  col: number;
  isFound: boolean;
  isSelected: boolean;
};

export default function ChristmasWordSearch() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const size = 10;
    const newGrid: Cell[][] = Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        letter: '',
        row,
        col,
        isFound: false,
        isSelected: false,
      }))
    );

    words.forEach(word => placeWord(newGrid, word));

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setFoundWords(new Set());
    setGameWon(false);
  };

  const placeWord = (grid: Cell[][], word: string) => {
    const size = grid.length;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [0, -1],
      [-1, 0],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      let canPlace = true;
      const positions: [number, number][] = [];

      for (let i = 0; i < word.length; i++) {
        const row = startRow + dir[0] * i;
        const col = startCol + dir[1] * i;

        if (row < 0 || row >= size || col < 0 || col >= size) {
          canPlace = false;
          break;
        }

        if (grid[row][col].letter && grid[row][col].letter !== word[i]) {
          canPlace = false;
          break;
        }

        positions.push([row, col]);
      }

      if (canPlace) {
        positions.forEach(([row, col], i) => {
          grid[row][col].letter = word[i];
        });
        placed = true;
      }
    }
  };

  const handleMouseDown = (cell: Cell) => {
    setSelecting(true);
    setSelectedCells([cell]);
    updateCellSelection([cell]);
  };

  const handleMouseEnter = (cell: Cell) => {
    if (!selecting) return;

    const newSelected = [...selectedCells];
    
    if (newSelected.length === 1) {
      newSelected.push(cell);
    } else {
      const first = newSelected[0];
      const rowDiff = cell.row - first.row;
      const colDiff = cell.col - first.col;

      if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
        newSelected.length = 1;
        
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = steps === 0 ? 0 : rowDiff / steps;
        const colStep = steps === 0 ? 0 : colDiff / steps;

        for (let i = 1; i <= steps; i++) {
          const r = first.row + Math.round(rowStep * i);
          const c = first.col + Math.round(colStep * i);
          newSelected.push(grid[r][c]);
        }
      }
    }

    setSelectedCells(newSelected);
    updateCellSelection(newSelected);
  };

  const handleMouseUp = () => {
    if (!selecting) return;
    
    setSelecting(false);
    checkWord();
    
    setSelectedCells([]);
    updateCellSelection([]);
  };

  const updateCellSelection = (cells: Cell[]) => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isSelected: cells.some(c => c.row === cell.row && c.col === cell.col) && !cell.isFound,
      }))
    );
    setGrid(newGrid);
  };

  const checkWord = () => {
    const selectedWord = selectedCells.map(c => c.letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    if (words.includes(selectedWord) && !foundWords.has(selectedWord)) {
      const newFound = new Set(foundWords);
      newFound.add(selectedWord);
      setFoundWords(newFound);
      
      const newGrid = grid.map(row =>
        row.map(cell => ({
          ...cell,
          isFound: cell.isFound || selectedCells.some(c => c.row === cell.row && c.col === cell.col),
        }))
      );
      setGrid(newGrid);

      if (newFound.size === words.length) {
        setGameWon(true);
      }
    } else if (words.includes(reversedWord) && !foundWords.has(reversedWord)) {
      const newFound = new Set(foundWords);
      newFound.add(reversedWord);
      setFoundWords(newFound);
      
      const newGrid = grid.map(row =>
        row.map(cell => ({
          ...cell,
          isFound: cell.isFound || selectedCells.some(c => c.row === cell.row && c.col === cell.col),
        }))
      );
      setGrid(newGrid);

      if (newFound.size === words.length) {
        setGameWon(true);
      }
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="w-6 h-6" />
          Christmas Word Search
        </h2>
        <div className="text-white font-bold">
          {foundWords.size}/{words.length} Found
        </div>
      </div>

      {gameWon && (
        <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4 mb-4">
          <p className="text-green-100 font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            Congratulations! You found all the words!
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-white font-semibold mb-2">Find these words:</h3>
          <div className="space-y-1">
            {words.map(word => (
              <div
                key={word}
                className={`text-sm ${
                  foundWords.has(word)
                    ? 'text-green-300 line-through'
                    : 'text-white'
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div
          className="grid gap-1 select-none"
          style={{ gridTemplateColumns: `repeat(10, 1fr)` }}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`aspect-square flex items-center justify-center text-xs font-bold rounded cursor-pointer transition-all ${
                  cell.isFound
                    ? 'bg-green-500/40 text-white'
                    : cell.isSelected
                    ? 'bg-yellow-500/40 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onMouseDown={() => handleMouseDown(cell)}
                onMouseEnter={() => handleMouseEnter(cell)}
                onMouseUp={handleMouseUp}
              >
                {cell.letter}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-white/60 text-sm mb-4">
        Click and drag to select words. Words can be horizontal, vertical, or diagonal.
      </p>

      <Button
        onClick={initializeGrid}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        New Puzzle
      </Button>
    </Card>
  );
}
