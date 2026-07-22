import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Volume2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ColorTheme } from '../lib/themes';
import { themes } from '../lib/themes';
import { speakText, triggerHaptic } from '../lib/accessibility';
import { getSystemTimezone } from '../lib/timezone';

interface CountdownTimerProps {
  selectedYear: number;
  onChristmas: (isChristmas: boolean) => void;
  theme: ColorTheme;
  onYearChange?: (year: number) => void;
  isMobile?: boolean;
  timezone?: string;
  targetDate?: string;
  targetEventName?: string;
  targetEventEmoji?: string;
  textToSpeech?: boolean;
  magnifierMode?: boolean;
  hapticFeedback?: boolean;
  reducedMotion?: boolean;
  largeText?: boolean;
  highContrast?: boolean;
  fontWeight?: number;
  lineSpacing?: number;
  dyslexiaFont?: boolean;
  uiScale?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  selectedYear, 
  onChristmas, 
  theme, 
  onYearChange, 
  isMobile,
  timezone,
  targetDate,
  targetEventName,
  targetEventEmoji,
  textToSpeech,
  magnifierMode,
  hapticFeedback,
  reducedMotion,
  largeText,
  highContrast,
  fontWeight,
  lineSpacing,
  dyslexiaFont,
  uiScale = 1,
}: CountdownTimerProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetYear, setTargetYear] = useState(selectedYear);
  const [showMagnifier, setShowMagnifier] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const christmasThisYear = new Date(currentYear, 11, 25);
      const christmasNextYear = new Date(currentYear + 1, 11, 25);
      
      let christmas: Date;
      
      if (targetDate) {
        christmas = new Date(targetDate);
        setTargetYear(christmas.getFullYear());
      } else if (selectedYear) {
        christmas = new Date(selectedYear, 11, 25);
        
        if (currentMonth === 11 && currentDay === 26 && selectedYear === currentYear) {
          const newYear = currentYear + 1;
          setTargetYear(newYear);
          if (onYearChange) {
            onYearChange(newYear);
          }
          christmas = new Date(newYear, 11, 25);
        }
      } else {
        if (now > christmasThisYear) {
          christmas = christmasNextYear;
          setTargetYear(currentYear + 1);
        } else {
          christmas = christmasThisYear;
          setTargetYear(currentYear);
        }
      }
      
      const difference = christmas.getTime() - now.getTime();

      if (difference <= 0) {
        onChristmas(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      onChristmas(false);

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedYear, onChristmas, onYearChange, targetDate]);

  const themeColors = themes[theme];

  const speakCountdown = () => {
    if (!textToSpeech) return;
    const text = `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes until ${targetEventName || 'Christmas'}`;
    speakText(text);
    if (hapticFeedback) {
      triggerHaptic('medium');
    }
  };

  const toggleMagnifier = () => {
    setShowMagnifier(!showMagnifier);
    if (hapticFeedback) {
      triggerHaptic('light');
    }
  };

  const containerStyle: React.CSSProperties = {
    transform: `scale(${uiScale})`,
    transformOrigin: 'top center',
  };

  const textStyle: React.CSSProperties = {
    fontWeight: fontWeight || 400,
    lineHeight: lineSpacing || 1.5,
    fontFamily: dyslexiaFont ? 'OpenDyslexic, Arial, sans-serif' : undefined,
  };

  if (showMagnifier && magnifierMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={toggleMagnifier}>
        <div className="text-center space-y-8 p-8">
          <h2 className="text-4xl font-bold text-white mb-8" style={textStyle}>
            {targetEventName || `Christmas ${selectedYear || targetYear}`}
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-9xl font-bold text-white mb-4" style={textStyle}>
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-3xl text-white/80 uppercase tracking-wider" style={textStyle}>
                  {t(`countdown.${key}`)}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={toggleMagnifier}
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white mt-8"
          >
            Exit Magnifier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`} style={containerStyle}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
          <h2 
            className={`${largeText ? 'text-3xl md:text-4xl' : isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-white drop-shadow-lg`}
            style={textStyle}
          >
            {targetEventEmoji && <span className="text-2xl md:text-3xl">{targetEventEmoji}</span>}
            {targetEventName || `Christmas ${selectedYear || targetYear}`}
          </h2>
        </div>
        
        <p className={`text-white/90 flex items-center justify-center gap-2 ${isMobile ? 'text-sm' : ''}`} style={textStyle}>
          <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          {t('countdown.yearProgress')}
        </p>
        {textToSpeech && (
          <Button
            onClick={speakCountdown}
            size="sm"
            variant="outline"
            className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Speak Countdown
          </Button>
        )}
        {magnifierMode && (
          <Button
            onClick={toggleMagnifier}
            size="sm"
            variant="outline"
            className="mt-2 ml-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Magnify
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'md:grid-cols-4 gap-4'}`}>
        {Object.entries(timeLeft).map(([key, value], index) => (
          <Card
            key={key}
            className={`${themeColors.card} backdrop-blur-md ${highContrast ? 'border-white border-2' : 'border-white/20'} shadow-xl ${reducedMotion ? '' : 'hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'}`}
            style={reducedMotion ? {} : { animationDelay: `${index * 100}ms` }}
          >
            <div className={`${isMobile ? 'p-3' : 'p-6'} text-center`}>
              <div 
                className={`${largeText ? 'text-5xl md:text-6xl' : isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold mb-2 ${themeColors.text} drop-shadow-lg`}
                style={{...textStyle, fontFamily: "'Poppins', 'Inter', sans-serif"}}
              >
                {value.toString().padStart(2, '0')}
              </div>
              <div 
                className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} ${highContrast ? 'text-white' : 'text-white/80'} uppercase tracking-wider font-semibold`}
                style={textStyle}
              >
                {t(`countdown.${key}`)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <div className={`mt-8 text-center ${reducedMotion ? '' : 'animate-in fade-in zoom-in duration-1000'}`}>
          <h3 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4" style={textStyle}>
            {targetEventName ? `🎉 ${targetEventName}! 🎉` : t('countdown.christmas')}
          </h3>
          <p className="text-xl text-white/90" style={textStyle}>
            {t('app.footer')}
          </p>
        </div>
      )}
    </div>
  );
}
