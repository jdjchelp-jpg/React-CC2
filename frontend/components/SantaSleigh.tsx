import { useState, useEffect } from 'react';

export default function SantaSleigh() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    }, 60000);

    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/4 -left-32 z-50 animate-sleigh pointer-events-none">
      <div className="text-6xl transform -rotate-12">
        🎅🦌🦌🦌
      </div>
      <style>{`
        @keyframes sleigh {
          0% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(50vw) translateY(-20vh);
          }
          100% {
            transform: translateX(100vw) translateY(0);
          }
        }
        .animate-sleigh {
          animation: sleigh 10s ease-in-out;
        }
      `}</style>
    </div>
  );
}
