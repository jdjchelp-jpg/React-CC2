import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SnowmanPart {
  id: string;
  name: string;
  emoji: string;
  placed: boolean;
  position?: { x: number; y: number };
}

const SNOWMAN_PARTS: Omit<SnowmanPart, 'placed' | 'position'>[] = [
  { id: 'base', name: 'Base', emoji: '⚪' },
  { id: 'middle', name: 'Middle', emoji: '⚪' },
  { id: 'head', name: 'Head', emoji: '⚪' },
  { id: 'hat', name: 'Hat', emoji: '🎩' },
  { id: 'carrot', name: 'Carrot Nose', emoji: '🥕' },
  { id: 'eyes', name: 'Eyes', emoji: '👀' },
  { id: 'scarf', name: 'Scarf', emoji: '🧣' },
  { id: 'buttons', name: 'Buttons', emoji: '🔘' },
  { id: 'arms', name: 'Arms', emoji: '🌿' },
];

export default function BuildSnowman() {
  const { t } = useTranslation();
  const [parts, setParts] = useState<SnowmanPart[]>(
    SNOWMAN_PARTS.map(part => ({ ...part, placed: false }))
  );
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedPart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setParts(prev => prev.map(part => 
      part.id === selectedPart 
        ? { ...part, placed: true, position: { x, y } }
        : part
    ));

    const newScore = score + 10;
    setScore(newScore);
    setSelectedPart(null);

    if (parts.filter(p => !p.placed).length === 1) {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setParts(SNOWMAN_PARTS.map(part => ({ ...part, placed: false })));
    setSelectedPart(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">{t('games.snowman.name')}</h2>
        <p className="text-muted-foreground mb-4">{t('games.snowman.description')}</p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div 
              className="relative bg-gradient-to-b from-blue-100 to-white rounded-lg border-2 border-border min-h-[400px] cursor-crosshair"
              onClick={handleCanvasClick}
            >
              {parts.filter(p => p.placed && p.position).map(part => (
                <div
                  key={part.id}
                  className="absolute text-4xl pointer-events-none"
                  style={{
                    left: `${part.position!.x - 20}px`,
                    top: `${part.position!.y - 20}px`,
                  }}
                >
                  {part.emoji}
                </div>
              ))}
              {!selectedPart && parts.filter(p => !p.placed).length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
                  {t('games.snowman.selectPart')}
                </div>
              )}
              {selectedPart && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
                  {t('games.snowman.clickToPlace', { 
                    part: parts.find(p => p.id === selectedPart)?.name 
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">
                {t('games.snowman.score')}: {score}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('games.snowman.partsPlaced')}: {parts.filter(p => p.placed).length}/{parts.length}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm font-semibold">{t('games.snowman.availableParts')}</p>
              <div className="grid grid-cols-3 gap-2">
                {parts.filter(p => !p.placed).map(part => (
                  <Button
                    key={part.id}
                    variant={selectedPart === part.id ? 'default' : 'outline'}
                    onClick={() => handlePartClick(part.id)}
                    className="h-16 text-2xl"
                  >
                    {part.emoji}
                  </Button>
                ))}
              </div>
            </div>

            {completed && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                <p className="font-bold text-lg">{t('games.snowman.congratulations')}</p>
                <p className="text-sm">{t('games.snowman.finalScore', { score })}</p>
              </div>
            )}

            <Button onClick={handleReset} variant="secondary" className="w-full">
              {t('games.snowman.resetSnowman')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
