import { useState, useEffect } from 'react';
import type { ColorTheme } from '../lib/themes';
import { themes } from '../lib/themes';

interface ChristmasTreeProps {
  theme: ColorTheme;
  progress?: number;
}

export default function ChristmasTree({ theme, progress: externalProgress }: ChristmasTreeProps) {
  const [progress, setProgress] = useState(externalProgress || 0);
  const [ornaments, setOrnaments] = useState<
    Array<{ id: number; x: number; y: number; delay: number; color: string }>
  >([]);
  const [lights, setLights] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [blinkingLights, setBlinkingLights] = useState<Set<number>>(new Set());

  const themeColors = themes[theme];

  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
    }
  }, [externalProgress]);

  // --- Initialize ornaments and lights ---
  useEffect(() => {
    const ornamentPositions = [
      { x: 50, y: 20 }, { x: 30, y: 30 }, { x: 70, y: 30 },
      { x: 25, y: 45 }, { x: 50, y: 42 }, { x: 75, y: 45 },
      { x: 20, y: 60 }, { x: 40, y: 58 }, { x: 60, y: 58 }, { x: 80, y: 60 },
      { x: 15, y: 75 }, { x: 35, y: 72 }, { x: 50, y: 70 }, { x: 65, y: 72 }, { x: 85, y: 75 },
    ];

    const lightPositions = [
      { x: 40, y: 15 }, { x: 60, y: 15 }, { x: 22, y: 35 }, { x: 78, y: 35 },
      { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 18, y: 68 }, { x: 82, y: 68 },
      { x: 25, y: 80 }, { x: 75, y: 80 }, { x: 12, y: 85 }, { x: 88, y: 85 },
    ];

    const colors = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7'];

    setOrnaments(
      ornamentPositions.map((pos, i) => ({
        id: i,
        x: pos.x,
        y: pos.y,
        delay: i * 50,
        color: colors[i % colors.length],
      }))
    );

    setLights(
      lightPositions.map((pos, i) => ({
        id: i,
        x: pos.x,
        y: pos.y,
        delay: i * 40,
      }))
    );
  }, []);

  // --- Blinking lights effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkingLights(prev => {
        const newSet = new Set<number>();
        lights.forEach(light => {
          if (Math.random() > 0.5) newSet.add(light.id);
        });
        return newSet;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [lights]);

  useEffect(() => {
    if (externalProgress !== undefined) return;

    const interval = setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();

      const start = new Date(year, 11, 24, 0, 0, 0);
      const end = new Date(year, 11, 25, 0, 0, 0);

      let newProgress = 0;

      if (now < start) newProgress = 0;
      else if (now >= end) newProgress = 100;
      else newProgress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

      setProgress(newProgress);
    }, 500);

    return () => clearInterval(interval);
  }, [externalProgress]);

  const visibleOrnaments = Math.floor((ornaments.length * progress) / 100);
  const visibleLights = Math.floor((lights.length * progress) / 100);

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '3/4' }}>
      <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="treeGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.9" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="sparkle">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <polygon
          points="150,40 120,100 90,100 70,150 50,150 30,200 20,250 10,300 290,300 280,250 270,200 250,150 230,150 210,100 180,100"
          fill="url(#treeGradient)"
          className="transition-all duration-1000"
          style={{ filter: progress > 50 ? 'url(#glow)' : 'none' }}
        />

        <rect x="130" y="300" width="40" height="60" fill="#8b4513" rx="5" />

        <polygon
          points="150,20 145,35 155,35"
          fill="#fbbf24"
          filter="url(#sparkle)"
          className="animate-pulse"
        />

        {lights.slice(0, visibleLights).map(light => (
          <g key={`light-${light.id}`}>
            <circle
              cx={(light.x / 100) * 300}
              cy={(light.y / 100) * 400}
              r="4"
              fill={blinkingLights.has(light.id) ? '#fef08a' : '#eab308'}
              filter="url(#glow)"
              className="transition-all duration-300 animate-in fade-in zoom-in"
              style={{ animationDelay: `${light.delay}ms`, opacity: blinkingLights.has(light.id) ? 1 : 0.7 }}
            />
            {blinkingLights.has(light.id) && (
              <circle
                cx={(light.x / 100) * 300}
                cy={(light.y / 100) * 400}
                r="8"
                fill="#fef08a"
                opacity="0.3"
                filter="url(#glow)"
                className="animate-ping"
              />
            )}
          </g>
        ))}

        {ornaments.slice(0, visibleOrnaments).map(ornament => (
          <g key={`ornament-${ornament.id}`}>
            <circle
              cx={(ornament.x / 100) * 300}
              cy={(ornament.y / 100) * 400}
              r="6"
              fill={ornament.color}
              className="transition-all duration-500 animate-in fade-in zoom-in"
              style={{ animationDelay: `${ornament.delay}ms`, filter: 'url(#sparkle)' }}
            />
            <circle
              cx={(ornament.x / 100) * 300 - 2}
              cy={(ornament.y / 100) * 400 - 2}
              r="2"
              fill="white"
              opacity="0.6"
              className="animate-in fade-in"
              style={{ animationDelay: `${ornament.delay + 100}ms` }}
            />
          </g>
        ))}

        {progress === 100 && (
          <>
            {[...Array(20)].map((_, i) => (
              <circle
                key={`sparkle-${i}`}
                cx={Math.random() * 280 + 10}
                cy={Math.random() * 300 + 40}
                r={Math.random() * 2 + 1}
                fill={themeColors.sparkle}
                className="animate-ping"
                style={{
                  animationDelay: `${Math.random() * 1000}ms`,
                  animationDuration: `${Math.random() * 2000 + 1000}ms`,
                }}
              />
            ))}
          </>
        )}
      </svg>

      {progress === 100 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-full animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
              animationDuration: '3s',
            }}
          />
        </div>
      )}
    </div>
  );
}
