import { useState, useEffect } from 'react';
import { Calendar, Minimize2, Maximize2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ColorTheme } from '../lib/themes';
import { themes } from '../lib/themes';

interface MiniModeProps {
  selectedYear: number;
  onToggle?: () => void;
  selectedTheme?: ColorTheme;
  onThemeChange?: (theme: ColorTheme) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MiniMode({ selectedYear, onToggle, selectedTheme = 'classic', onThemeChange }: MiniModeProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const getTheme = () => {
    if (selectedTheme === 'custom') {
      const saved = localStorage.getItem('activeCustomTheme');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            gradient: '',
            bgStyle: { background: parsed.gradient },
          };
        } catch {
          return { gradient: themes.classic.gradient, bgStyle: {} };
        }
      }
    }
    return { gradient: themes[selectedTheme].gradient, bgStyle: {} };
  };

  const themeData = getTheme();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const christmas = new Date(selectedYear || currentYear, 11, 25);
      const difference = christmas.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

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
  }, [selectedYear]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, select')) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const widgetWidth = isCollapsed ? 200 : 288;
      const widgetHeight = isCollapsed ? 56 : (showThemeSelector ? 280 : 220);
      
      const maxX = window.innerWidth - widgetWidth;
      const maxY = window.innerHeight - widgetHeight;
      
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, maxX));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, maxY));
      
      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isCollapsed, showThemeSelector]);

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x === 0 ? 'auto' : `${position.x}px`,
        top: position.y === 0 ? 'auto' : `${position.y}px`,
        right: position.x === 0 ? '1rem' : 'auto',
        bottom: position.y === 0 ? '1rem' : 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 overflow-hidden ${themeData.gradient}`} style={themeData.bgStyle}>
        {!isCollapsed ? (
          <div className="p-4 space-y-3 w-72">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">Christmas {selectedYear}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                >
                  <Palette className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsCollapsed(true)}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                {onToggle && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    onClick={onToggle}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {showThemeSelector && onThemeChange && (
              <div className="bg-white/10 rounded-lg p-2">
                <Select value={selectedTheme} onValueChange={onThemeChange}>
                  <SelectTrigger className="w-full bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="royal">Royal</SelectItem>
                    <SelectItem value="candy">Candy</SelectItem>
                    <SelectItem value="golden">Golden</SelectItem>
                    <SelectItem value="icy">Icy</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="aurora">Aurora</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] text-white/80 uppercase">
                  Days
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-white/80 uppercase">
                  Hours
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-white/80 uppercase">
                  Min
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-xl font-bold text-white">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-white/80 uppercase">
                  Sec
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-white/20 ml-auto"
              onClick={() => setIsCollapsed(false)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
