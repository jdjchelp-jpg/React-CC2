import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';

interface TowerBuilderProps {
  onBack: () => void;
}

interface Block {
  x: number;
  width: number;
  color: string;
}

export default function ElfTowerBuilder({ onBack }: TowerBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(1);
  const animationRef = useRef<number | undefined>(undefined);

  const BLOCK_HEIGHT = 30;
  const CANVAS_WIDTH = 400;
  const INITIAL_WIDTH = 100;

  useEffect(() => {
    startGame();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentBlock && !gameOver) {
      const animate = () => {
        if (!currentBlock || gameOver) return;
        const newX = currentBlock.x + direction * 2;
        if (newX <= 0 || newX + currentBlock.width >= CANVAS_WIDTH) {
          setDirection(-direction);
        }
        setCurrentBlock({ ...currentBlock, x: newX });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentBlock?.x, direction, gameOver]);

  const startGame = () => {
    const firstBlock: Block = {
      x: CANVAS_WIDTH / 2 - INITIAL_WIDTH / 2,
      width: INITIAL_WIDTH,
      color: getRandomColor(),
    };
    setBlocks([firstBlock]);
    setScore(0);
    setGameOver(false);
    spawnNewBlock(INITIAL_WIDTH);
  };

  const spawnNewBlock = (width: number) => {
    setCurrentBlock({
      x: 0,
      width,
      color: getRandomColor(),
    });
    setDirection(1);
  };



  const dropBlock = () => {
    if (!currentBlock || gameOver) return;

    const lastBlock = blocks[blocks.length - 1];
    const overlap = Math.min(
      currentBlock.x + currentBlock.width,
      lastBlock.x + lastBlock.width
    ) - Math.max(currentBlock.x, lastBlock.x);

    if (overlap <= 0) {
      setGameOver(true);
      return;
    }

    const newX = Math.max(currentBlock.x, lastBlock.x);
    const newWidth = overlap;

    const newBlock: Block = {
      x: newX,
      width: newWidth,
      color: currentBlock.color,
    };

    setBlocks([...blocks, newBlock]);
    setScore(score + 1);
    setCurrentBlock(null);

    setTimeout(() => {
      spawnNewBlock(newWidth);
    }, 100);
  };

  const getRandomColor = () => {
    const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-green-900 to-red-900 border-4 border-yellow-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
          <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
            🧱 Elf Tower Builder 🧱
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-white text-2xl font-bold">Height: {score}</div>

            {gameOver && (
              <div className="bg-red-600 text-white p-4 rounded-lg text-center">
                <Trophy className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xl font-bold">Game Over!</div>
                <div>Final Height: {score}</div>
              </div>
            )}

            <div
              className="relative bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-white rounded-lg overflow-hidden"
              style={{ width: CANVAS_WIDTH, height: 500 }}
              onClick={dropBlock}
            >
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className="absolute transition-all"
                  style={{
                    bottom: index * BLOCK_HEIGHT,
                    left: block.x,
                    width: block.width,
                    height: BLOCK_HEIGHT,
                    backgroundColor: block.color,
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                  }}
                />
              ))}

              {currentBlock && !gameOver && (
                <div
                  className="absolute"
                  style={{
                    bottom: blocks.length * BLOCK_HEIGHT,
                    left: currentBlock.x,
                    width: currentBlock.width,
                    height: BLOCK_HEIGHT,
                    backgroundColor: currentBlock.color,
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  }}
                />
              )}

              {!gameOver && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                  Click to drop!
                </div>
              )}
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
