import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, Save, Trash2, Plus, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ColorTheme } from '../lib/themes';

interface CustomTheme {
  name: string;
  gradient: string;
  card: string;
  text: string;
  sparkle: string;
  progressStart: string;
  progressEnd: string;
}

interface ThemeBuilderProps {
  selectedTheme?: ColorTheme;
  onThemeChange?: (theme: ColorTheme) => void;
}

export default function ThemeBuilder({ selectedTheme, onThemeChange }: ThemeBuilderProps) {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [themeName, setThemeName] = useState('');
  const [gradientFrom, setGradientFrom] = useState('#991b1b');
  const [gradientVia, setGradientVia] = useState('#14532d');
  const [gradientTo, setGradientTo] = useState('#991b1b');
  const [cardColor, setCardColor] = useState('#ef4444');
  const [textColor, setTextColor] = useState('#fecaca');
  const [sparkleColor, setSparkleColor] = useState('#fde047');
  const [progressStart, setProgressStart] = useState('#ef4444');
  const [progressEnd, setProgressEnd] = useState('#22c55e');

  useEffect(() => {
    const saved = localStorage.getItem('customThemes');
    if (saved) {
      setCustomThemes(JSON.parse(saved));
    }
  }, []);

  const saveTheme = () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme: CustomTheme = {
      name: themeName,
      gradient: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
      card: `${cardColor}33`,
      text: textColor,
      sparkle: sparkleColor,
      progressStart,
      progressEnd,
    };

    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    localStorage.setItem('customThemes', JSON.stringify(updated));
    
    setThemeName('');
    alert(`Theme "${themeName}" saved!`);
  };

  const deleteTheme = (index: number) => {
    const updated = customThemes.filter((_, i) => i !== index);
    setCustomThemes(updated);
    localStorage.setItem('customThemes', JSON.stringify(updated));
  };

  const loadTheme = (theme: CustomTheme) => {
    const match = theme.gradient.match(/linear-gradient\(to bottom right, (#[0-9a-f]{6}), (#[0-9a-f]{6}), (#[0-9a-f]{6})\)/i);
    if (match) {
      setGradientFrom(match[1]);
      setGradientVia(match[2]);
      setGradientTo(match[3]);
    }
    setCardColor(theme.card.replace('33', ''));
    setTextColor(theme.text);
    setSparkleColor(theme.sparkle);
    setProgressStart(theme.progressStart);
    setProgressEnd(theme.progressEnd);
    setThemeName(theme.name);
  };

  const applyThemeToApp = (theme: CustomTheme) => {
    localStorage.setItem('activeCustomTheme', JSON.stringify({
      gradient: theme.gradient,
      card: theme.card,
      text: theme.text,
      sparkle: theme.sparkle,
      progressStart: theme.progressStart,
      progressEnd: theme.progressEnd,
    }));
    
    if (onThemeChange) {
      onThemeChange('custom');
    }
    
    alert(`Theme "${theme.name}" is now active!`);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-6 h-6" />
          Custom Theme Builder
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="theme-name" className="text-white">Theme Name</Label>
            <input
              id="theme-name"
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Custom Theme"
              className="w-full px-3 py-2 mt-1 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gradient-from" className="text-white">Gradient From</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="gradient-from"
                  type="color"
                  value={gradientFrom}
                  onChange={(e) => setGradientFrom(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={gradientFrom}
                  onChange={(e) => setGradientFrom(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gradient-via" className="text-white">Gradient Via</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="gradient-via"
                  type="color"
                  value={gradientVia}
                  onChange={(e) => setGradientVia(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={gradientVia}
                  onChange={(e) => setGradientVia(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gradient-to" className="text-white">Gradient To</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="gradient-to"
                  type="color"
                  value={gradientTo}
                  onChange={(e) => setGradientTo(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={gradientTo}
                  onChange={(e) => setGradientTo(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="card-color" className="text-white">Card Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="card-color"
                  type="color"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="text-white">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sparkle-color" className="text-white">Sparkle Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="sparkle-color"
                  type="color"
                  value={sparkleColor}
                  onChange={(e) => setSparkleColor(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={sparkleColor}
                  onChange={(e) => setSparkleColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="progress-start" className="text-white">Progress Start</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="progress-start"
                  type="color"
                  value={progressStart}
                  onChange={(e) => setProgressStart(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={progressStart}
                  onChange={(e) => setProgressStart(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="progress-end" className="text-white">Progress End</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="progress-end"
                  type="color"
                  value={progressEnd}
                  onChange={(e) => setProgressEnd(e.target.value)}
                  className="h-10 w-20 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={progressEnd}
                  onChange={(e) => setProgressEnd(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
            </div>
          </div>

          <div
            className="h-32 rounded-lg border-2 border-white/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
            }}
          >
            <div
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: `${cardColor}33`, color: textColor }}
            >
              <span className="font-bold">Preview</span>
            </div>
          </div>

          <Button onClick={saveTheme} className="w-full bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Theme
          </Button>
        </div>
      </Card>

      {customThemes.length > 0 && (
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Saved Themes</h3>
          <div className="space-y-2">
            {customThemes.map((theme, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/20"
                style={{ background: theme.gradient }}
              >
                <div className="flex-1">
                  <span className="font-semibold" style={{ color: theme.text }}>
                    {theme.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => loadTheme(theme)}
                  className="text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Load
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => applyThemeToApp(theme)}
                  className="text-green-300 hover:bg-green-500/20"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTheme(index)}
                  className="text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
