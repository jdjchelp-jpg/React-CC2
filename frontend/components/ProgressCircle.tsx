import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColorTheme } from '../lib/themes';
import { themes } from '../lib/themes';

interface ProgressCircleProps {
  selectedYear: number;
  theme: ColorTheme;
}

export default function ProgressCircle({ selectedYear, theme }: ProgressCircleProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const christmas = new Date(selectedYear, 11, 25);
      const endOfYear = new Date(currentYear, 11, 31);

      const totalDays = selectedYear === currentYear
        ? Math.floor((christmas.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        : 365;

      const daysElapsed = selectedYear === currentYear
        ? Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const daysRemaining = Math.floor((christmas.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const percentage = selectedYear === currentYear
        ? Math.min(100, (daysElapsed / totalDays) * 100)
        : 0;

      setProgress(percentage);
      setDaysLeft(Math.max(0, daysRemaining));
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 60000);

    return () => clearInterval(timer);
  }, [selectedYear]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const themeColors = themes[theme];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={themeColors.progressStart} />
              <stop offset="100%" stopColor={themeColors.progressEnd} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white drop-shadow-lg">{daysLeft}</div>
          <div className="text-sm text-white/80 uppercase tracking-wider">{t('countdown.daysLeft')}</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white/90 text-sm">
          {t('countdown.yearComplete', { percent: progress.toFixed(1) })}
        </p>
      </div>
    </div>
  );
}
