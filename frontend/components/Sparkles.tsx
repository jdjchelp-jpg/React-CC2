import { useMemo } from 'react';
import type { ColorTheme } from '../lib/themes';
import { themes } from '../lib/themes';

interface SparklesProps {
  theme: ColorTheme;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  animationDuration: number;
  delay: number;
  size: number;
}

export default function Sparkles({ theme }: SparklesProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: 2 + Math.random() * 3,
      delay: Math.random() * -5,
      size: 2 + Math.random() * 3,
    }));
  }, []);

  const themeColors = themes[theme];
  const sparkleColor = themeColors.sparkle;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute rounded-full ${sparkleColor} animate-sparkle`}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.animationDuration}s`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-sparkle {
          animation: sparkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
