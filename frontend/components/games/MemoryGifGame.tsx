import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../lib/backend';

const CHRISTMAS_GIFS = [
  '🎄', '🎅', '🎁', '⛄', '🔔', '🕯️', '🦌', '⭐',
  '🎄', '🎅', '🎁', '⛄', '🔔', '🕯️', '🦌', '⭐'
];

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGifGame() {
  const backend = useBackend();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...CHRISTMAS_GIFS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsGameComplete(false);
  };

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setMatchedPairs(matchedPairs + 1);
          setFlippedIndices([]);

          if (matchedPairs + 1 === CHRISTMAS_GIFS.length / 2) {
            setIsGameComplete(true);
            const score = Math.max(0, 1000 - moves * 10);

          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Memory GIF Game</h2>
          <div className="flex gap-4 text-sm">
            <span>Moves: {moves}</span>
            <span>Pairs: {matchedPairs}/8</span>
          </div>
        </div>

        {isGameComplete && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
            <p className="text-lg font-bold">🎉 Congratulations!</p>
            <p>You completed the game in {moves} moves!</p>
            <p className="text-sm">Score: {Math.max(0, 1000 - moves * 10)}</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-4" role="grid" aria-label="Memory card game">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isFlipped || card.isMatched}
              className={`aspect-square rounded-lg text-4xl flex items-center justify-center transition-all transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white/90'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              aria-label={card.isFlipped || card.isMatched ? `Card ${card.emoji}` : 'Hidden card'}
              tabIndex={0}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </button>
          ))}
        </div>

        <Button onClick={initializeGame} className="w-full" aria-label="Reset game">
          New Game
        </Button>
      </Card>
    </div>
  );
}
