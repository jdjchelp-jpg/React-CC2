import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gift, Star, Trophy } from 'lucide-react';

interface MemoryMatchProps {
  onBack: () => void;
}

const ICONS = ['🎄', '🎁', '⛄', '🔔', '⭐', '🕯️', '🦌', '🎅'];

export default function SantasMemoryMatch({ onBack }: MemoryMatchProps) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped]);

  const initializeGame = () => {
    const doubled = [...ICONS, ...ICONS];
    const shuffled = doubled.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped([...flipped, index]);
    setMoves(moves + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-4 border-yellow-400 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
          <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
            <Gift className="w-8 h-8 text-yellow-300" />
            Santa's Memory Match
            <Star className="w-8 h-8 text-yellow-300" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-white text-xl font-bold">
              Moves: {Math.floor(moves / 2)} | Matched: {matched.length / 2}/{ICONS.length}
            </div>

            {gameWon && (
              <div className="bg-yellow-400 text-black p-6 rounded-lg text-center">
                <Trophy className="w-16 h-16 mx-auto mb-2" />
                <div className="text-2xl font-bold">You Won!</div>
                <div className="text-lg">Total Moves: {Math.floor(moves / 2)}</div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              {cards.map((icon, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-4xl cursor-pointer transition-all transform hover:scale-105 ${
                    flipped.includes(index) || matched.includes(index)
                      ? 'bg-white shadow-lg'
                      : 'bg-gradient-to-br from-red-500 to-green-500 hover:from-red-600 hover:to-green-600'
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  {(flipped.includes(index) || matched.includes(index)) && icon}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700">
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
