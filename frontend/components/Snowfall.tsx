import { useMemo } from 'react';
import type { ColorTheme } from '../lib/themes';

interface SnowfallProps {
  intensity: number;
  theme: ColorTheme;
}

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
  opacity: number;
}

export default function Snowfall({ intensity, theme }: SnowfallProps) {
  const snowflakes = useMemo(() => {
    const count = Math.floor((intensity / 100) * 100);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      size: 2 + Math.random() * 4,
      delay: Math.random() * -20,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [intensity]);

  const snowflakeColor = theme === 'winter' ? 'bg-blue-100' : 'bg-white';

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`absolute ${snowflakeColor} rounded-full animate-fall`}
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
