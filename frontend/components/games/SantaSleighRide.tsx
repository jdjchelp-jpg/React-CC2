import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../lib/backend';

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

export default function SantaSleighRide() {
  const backend = useBackend();
  const [santaY, setSantaY] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const obstacleIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSantaY(prev => Math.max(0, prev - 30));
      } else if (e.key === 'ArrowDown') {
        setSantaY(prev => Math.min(360, prev + 30));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const newObstacle: Obstacle = {
        id: obstacleIdRef.current++,
        x: 600,
        y: Math.random() * 360
      };
      setObstacles(prev => [...prev, newObstacle]);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const moved = prev.map(o => ({ ...o, x: o.x - 5 }));
        return moved.filter(o => o.x > -50);
      });

      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    obstacles.forEach(obstacle => {
      if (
        obstacle.x < 100 &&
        obstacle.x > 20 &&
        Math.abs(obstacle.y - santaY) < 40
      ) {
        setIsPlaying(false);
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);

        }
      }
    });
  }, [obstacles, santaY, isPlaying, score, highScore]);

  const startGame = () => {
    setSantaY(200);
    setObstacles([]);
    setScore(0);
    setIsPlaying(true);
    setGameOver(false);
    obstacleIdRef.current = 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Santa Sleigh Ride</h2>
          <div className="flex gap-4 text-sm">
            <span>Score: {score}</span>
            {highScore > 0 && <span>High: {highScore}</span>}
          </div>
        </div>

        {gameOver && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
            <p className="text-lg font-bold">Crash!</p>
            <p>Final Score: {score}</p>
          </div>
        )}

        <p className="text-sm text-center mb-2 text-muted-foreground">
          Use ↑ and ↓ arrow keys to move Santa
        </p>

        <div
          ref={gameAreaRef}
          className="relative w-full h-96 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-lg overflow-hidden mb-4"
          role="application"
          aria-label="Santa sleigh ride game"
          tabIndex={0}
        >
          <div
            className="absolute text-4xl transition-all duration-100"
            style={{
              left: '50px',
              top: `${santaY}px`
            }}
            aria-label="Santa on sleigh"
          >
            🎅🛷
          </div>

          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute text-3xl"
              style={{
                left: `${obstacle.x}px`,
                top: `${obstacle.y}px`
              }}
              aria-hidden="true"
            >
              🌲
            </div>
          ))}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xl font-bold">
                Press Start to Play!
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={startGame} 
          className="w-full" 
          disabled={isPlaying}
          aria-label={isPlaying ? 'Game in progress' : 'Start game'}
        >
          {isPlaying ? 'Playing...' : 'Start Game'}
        </Button>
      </Card>
    </div>
  );
}
