import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';

interface ReindeerRunProps {
  onBack: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ReindeerRun({ onBack }: ReindeerRunProps) {
  const [playerY, setPlayerY] = useState(250);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PLAYER_SIZE = 40;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const OBSTACLE_SPEED = 5;

  const velocityRef = useRef(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const animate = () => {
        if (!gameStarted || gameOver) return;
        
        velocityRef.current += GRAVITY;
        let newY = playerY + velocityRef.current;

        if (newY > CANVAS_HEIGHT - PLAYER_SIZE) {
          newY = CANVAS_HEIGHT - PLAYER_SIZE;
          velocityRef.current = 0;
        }
        if (newY < 0) {
          newY = 0;
          velocityRef.current = 0;
        }

        setPlayerY(newY);

        setObstacles((prev) => {
          const updated = prev
            .map((obs) => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
            .filter((obs) => obs.x + obs.width > 0);

          if (Math.random() < 0.02) {
            const newObstacle: Obstacle = {
              x: CANVAS_WIDTH,
              y: Math.random() > 0.5 ? 0 : CANVAS_HEIGHT - 60,
              width: 40,
              height: 60,
            };
            updated.push(newObstacle);
          }

          for (const obs of updated) {
            if (
              CANVAS_WIDTH / 4 < obs.x + obs.width &&
              CANVAS_WIDTH / 4 + PLAYER_SIZE > obs.x &&
              newY < obs.y + obs.height &&
              newY + PLAYER_SIZE > obs.y
            ) {
              setGameOver(true);
            }
          }

          return updated;
        });

        setScore((s) => s + 1);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setPlayerY(250);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    velocityRef.current = 0;
  };

  const jump = () => {
    if (!gameStarted || gameOver) {
      if (!gameStarted) startGame();
      return;
    }
    velocityRef.current = JUMP_FORCE;
  };



  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-4 border-yellow-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
          <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
            🦌 Reindeer Run 🦌
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-white text-2xl font-bold">Score: {Math.floor(score / 10)}</div>

            {gameOver && (
              <div className="bg-red-600 text-white p-4 rounded-lg text-center">
                <Trophy className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xl font-bold">Game Over!</div>
                <div>Score: {Math.floor(score / 10)}</div>
              </div>
            )}

            <div
              className="relative bg-gradient-to-b from-sky-400 to-sky-600 border-4 border-white rounded-lg overflow-hidden cursor-pointer"
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              onClick={jump}
            >
              <div
                className="absolute text-5xl transition-all"
                style={{
                  left: CANVAS_WIDTH / 4,
                  top: playerY,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE,
                }}
              >
                🦌
              </div>

              {obstacles.map((obs, index) => (
                <div
                  key={index}
                  className="absolute bg-gradient-to-br from-green-700 to-green-900 border-2 border-green-500 rounded"
                  style={{
                    left: obs.x,
                    top: obs.y,
                    width: obs.width,
                    height: obs.height,
                  }}
                >
                  <div className="text-2xl text-center">🌲</div>
                </div>
              ))}

              {!gameStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-2xl font-bold">Click or Press Space to Start!</div>
                </div>
              )}
            </div>

            <div className="text-white text-center text-sm">
              Click or press SPACE to jump!
            </div>

            <div className="flex gap-4">
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                New Game
              </Button>
              <Button onClick={onBack} variant="outline" className="bg-white/10 border-white text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
