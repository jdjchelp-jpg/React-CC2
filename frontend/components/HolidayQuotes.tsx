import { useState, useEffect } from 'react';
import { quotes } from '../lib/quotes';

export default function HolidayQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <blockquote
        key={currentQuote}
        className="text-lg md:text-xl text-white/90 italic animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        "{quotes[currentQuote]}"
      </blockquote>
    </div>
  );
}
