import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveScore } from '../../lib/storage';

interface Ornament {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

const ORNAMENTS = ['🔴', '🟡', '🔵', '⭐', '🎀', '🔔', '🎁', '❄️'];

export default function DecorateTreeGame() {
  const [placedOrnaments, setPlacedOrnaments] = useState<Ornament[]>([]);
  const [selectedOrnament, setSelectedOrnament] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const ornamentIdRef = useRef(0);
  const treeRef = useRef<HTMLDivElement>(null);

  const handleTreeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedOrnament || !treeRef.current) return;

    const rect = treeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newOrnament: Ornament = {
      id: ornamentIdRef.current++,
      emoji: selectedOrnament,
      x,
      y
    };

    setPlacedOrnaments(prev => [...prev, newOrnament]);
    setScore(prev => prev + 10);
    setSelectedOrnament(null);
  };

  const handleOrnamentRemove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlacedOrnaments(prev => prev.filter(o => o.id !== id));
    setScore(prev => Math.max(0, prev - 5));
  };

  const handleReset = () => {
    setPlacedOrnaments([]);
    setSelectedOrnament(null);
    setScore(0);
    ornamentIdRef.current = 0;
  };

  const handleSave = () => {
    saveScore('decorateTree', score);
    alert(`Tree saved! Score: ${score}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Decorate the Tree</h2>
          <div className="text-sm">
            Score: {score} | Ornaments: {placedOrnaments.length}
          </div>
        </div>

        <div className="mb-4 flex gap-2 flex-wrap" role="toolbar" aria-label="Ornament selection">
          {ORNAMENTS.map(ornament => (
            <button
              key={ornament}
              onClick={() => setSelectedOrnament(ornament)}
              className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                selectedOrnament === ornament 
                  ? 'bg-green-500 ring-2 ring-green-400' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              aria-label={`Select ${ornament} ornament`}
              aria-pressed={selectedOrnament === ornament}
            >
              {ornament}
            </button>
          ))}
        </div>

        {selectedOrnament && (
          <p className="text-sm text-center mb-2 text-muted-foreground">
            Click on the tree to place {selectedOrnament}
          </p>
        )}

        <div
          ref={treeRef}
          onClick={handleTreeClick}
          className="relative w-full h-96 bg-gradient-to-b from-blue-900 to-green-900 rounded-lg overflow-hidden mb-4 cursor-crosshair flex items-center justify-center"
          role="application"
          aria-label="Christmas tree decoration area"
          tabIndex={0}
        >
          <div className="text-9xl select-none pointer-events-none">🎄</div>
          
          {placedOrnaments.map(ornament => (
            <button
              key={ornament.id}
              onClick={(e) => handleOrnamentRemove(ornament.id, e)}
              className="absolute text-2xl hover:scale-125 transition-transform cursor-pointer"
              style={{
                left: `${ornament.x - 16}px`,
                top: `${ornament.y - 16}px`
              }}
              aria-label={`Remove ${ornament.emoji} ornament`}
            >
              {ornament.emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="flex-1" aria-label="Clear all ornaments">
            Clear Tree
          </Button>
          <Button onClick={handleSave} className="flex-1" aria-label="Save decorated tree">
            Save Tree
          </Button>
        </div>
      </Card>
    </div>
  );
}
