import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../lib/backend';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export default function CatchSnowflakes() {
  const backend = useBackend();
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const snowflakeIdRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const newSnowflake: Snowflake = {
          id: snowflakeIdRef.current++,
          x: Math.random() * (gameAreaRef.current.clientWidth - 40),
          y: -40,
          speed: 2 + Math.random() * 3
        };
        setSnowflakes(prev => [...prev, newSnowflake]);
      }
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setSnowflakes(prev => 
        prev
          .map(s => ({ ...s, y: s.y + s.speed }))
          .filter(s => s.y < (gameAreaRef.current?.clientHeight || 400))
      );
    }, 16);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);

          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  const handleSnowflakeClick = (id: number) => {
    setSnowflakes(prev => prev.filter(s => s.id !== id));
    setScore(prev => prev + 10);
  };

  const startGame = () => {
    setSnowflakes([]);
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    snowflakeIdRef.current = 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Catch the Snowflakes</h2>
          <div className="flex gap-4 text-sm">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        {!isPlaying && timeLeft === 0 && (
          <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-center">
            <p className="text-lg font-bold">Game Over!</p>
            <p>Final Score: {score}</p>
            {highScore > 0 && <p className="text-sm">High Score: {highScore}</p>}
          </div>
        )}

        <div
          ref={gameAreaRef}
          className="relative w-full h-96 bg-gradient-to-b from-blue-900 to-blue-700 rounded-lg overflow-hidden mb-4"
          role="application"
          aria-label="Snowflake catching game area"
        >
          {snowflakes.map(snowflake => (
            <button
              key={snowflake.id}
              onClick={() => handleSnowflakeClick(snowflake.id)}
              className="absolute text-3xl cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: `${snowflake.x}px`,
                top: `${snowflake.y}px`
              }}
              aria-label="Catch snowflake"
              tabIndex={isPlaying ? 0 : -1}
            >
              ❄️
            </button>
          ))}

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-xl font-bold">
                {timeLeft === 30 ? 'Click Start to Play!' : 'Game Over!'}
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
