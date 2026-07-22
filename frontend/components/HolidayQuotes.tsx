import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { eventQuotes, getEventQuotes } from '../lib/eventQuotes';
import { quotes } from '../lib/quotes';
import type { HolidayEvent } from '../lib/events';

interface HolidayQuotesProps {
  selectedEvent?: HolidayEvent | null;
}

export default function HolidayQuotes({ selectedEvent }: HolidayQuotesProps) {
  const { i18n } = useTranslation();
  const [currentQuote, setCurrentQuote] = useState(0);
  const language = i18n.language;

  const activeQuotes = selectedEvent && eventQuotes[selectedEvent]
    ? getEventQuotes(selectedEvent, language)
    : quotes;

  useEffect(() => {
    setCurrentQuote(0);
  }, [selectedEvent, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % activeQuotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeQuotes.length, language]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <blockquote
        key={currentQuote + (selectedEvent || 'default')}
        className="text-lg md:text-xl text-white/90 italic animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        "{activeQuotes[currentQuote]}"
      </blockquote>
    </div>
  );
}
