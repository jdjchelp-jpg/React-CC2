import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../lib/backend';

interface CandyCane {
  id: number;
  x: number;
  width: number;
}

export default function CandyCaneStack() {
  const backend = useBackend();
  const [stack, setStack] = useState<CandyCane[]>([]);
  const [currentCane, setCurrentCane] = useState<CandyCane | null>(null);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const caneIdRef = useRef(0);

  useEffect(() => {
    if (!isPlaying || !currentCane) return;

    const moveInterval = setInterval(() => {
      setCurrentCane(prev => {
        if (!prev) return prev;
        const newX = prev.x + direction * 3;
        
        if (newX <= 0 || newX + prev.width >= 400) {
          setDirection(d => -d);
        }
        
        return { ...prev, x: Math.max(0, Math.min(400 - prev.width, newX)) };
      });
    }, 20);

    return () => clearInterval(moveInterval);
  }, [isPlaying, currentCane, direction]);

  const spawnNewCane = () => {
    const width = stack.length === 0 ? 100 : Math.max(30, stack[stack.length - 1].width - 10);
    const newCane: CandyCane = {
      id: caneIdRef.current++,
      x: 0,
      width
    };
    setCurrentCane(newCane);
    setDirection(1);
  };

  const dropCane = () => {
    if (!currentCane) return;

    if (stack.length === 0) {
      setStack([currentCane]);
      spawnNewCane();
      return;
    }

    const lastCane = stack[stack.length - 1];
    const overlap = Math.min(
      currentCane.x + currentCane.width,
      lastCane.x + lastCane.width
    ) - Math.max(currentCane.x, lastCane.x);

    if (overlap <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      const finalScore = stack.length * 100;
      if (stack.length > highScore) {
        setHighScore(stack.length);
      }
      return;
    }

    const alignedCane: CandyCane = {
      ...currentCane,
      x: Math.max(currentCane.x, lastCane.x),
      width: overlap
    };

    setStack(prev => [...prev, alignedCane]);
    spawnNewCane();
  };

  const startGame = () => {
    setStack([]);
    setGameOver(false);
    setIsPlaying(true);
    caneIdRef.current = 0;
    spawnNewCane();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Candy Cane Stack</h2>
          <div className="flex gap-4 text-sm">
            <span>Stack: {stack.length}</span>
            {highScore > 0 && <span>High: {highScore}</span>}
          </div>
        </div>

        {gameOver && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
            <p className="text-lg font-bold">Stack Collapsed!</p>
            <p>Final Height: {stack.length}</p>
            <p className="text-sm">Score: {stack.length * 100}</p>
          </div>
        )}

        <p className="text-sm text-center mb-2 text-muted-foreground">
          Click or press Space to drop the candy cane
        </p>

        <div
          className="relative w-full h-96 bg-gradient-to-b from-red-900 to-green-900 rounded-lg overflow-hidden mb-4 flex flex-col-reverse items-center"
          role="application"
          aria-label="Candy cane stacking game"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' && isPlaying) {
              e.preventDefault();
              dropCane();
            }
          }}
        >
          {stack.map((cane, index) => (
            <div
              key={cane.id}
              className="absolute bg-gradient-to-r from-red-500 to-white h-8 rounded shadow-lg"
              style={{
                width: `${cane.width}px`,
                left: `${cane.x}px`,
                bottom: `${index * 8}px`
              }}
              aria-label={`Candy cane ${index + 1}`}
            />
          ))}

          {currentCane && isPlaying && (
            <div
              className="absolute bg-gradient-to-r from-red-600 to-white h-8 rounded shadow-xl animate-pulse"
              style={{
                width: `${currentCane.width}px`,
                left: `${currentCane.x}px`,
                bottom: `${stack.length * 8}px`
              }}
              aria-label="Moving candy cane"
            />
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xl font-bold">
                Press Start to Play!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={startGame} 
            className="flex-1" 
            disabled={isPlaying && !gameOver}
            aria-label="Start new game"
          >
            {isPlaying && !gameOver ? 'Playing...' : 'Start Game'}
          </Button>
          {isPlaying && (
            <Button 
              onClick={dropCane} 
              className="flex-1"
              aria-label="Drop candy cane"
            >
              Drop
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
