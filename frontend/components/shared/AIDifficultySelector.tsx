import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Bot, Snowflake } from 'lucide-react';

interface AIDifficultySelectorProps {
  difficulty: number;
  onChange: (difficulty: number) => void;
}

const DIFFICULTY_LEVELS = [
  { elo: 800, label: 'Beginner Elf', color: 'bg-green-500' },
  { elo: 1000, label: 'Apprentice Snowman', color: 'bg-blue-500' },
  { elo: 1200, label: 'Skilled Reindeer', color: 'bg-cyan-500' },
  { elo: 1400, label: 'Expert Santa Helper', color: 'bg-yellow-500' },
  { elo: 1600, label: 'Master Ice Wizard', color: 'bg-orange-500' },
  { elo: 1800, label: 'Legendary Frost Giant', color: 'bg-purple-500' },
  { elo: 2000, label: 'Grandmaster Blizzard', color: 'bg-red-500' },
  { elo: 2400, label: 'Ultimate Winter God', color: 'bg-pink-500' },
];

export default function AIDifficultySelector({ difficulty, onChange }: AIDifficultySelectorProps) {
  const getDifficultyLevel = (elo: number) => {
    for (let i = DIFFICULTY_LEVELS.length - 1; i >= 0; i--) {
      if (elo >= DIFFICULTY_LEVELS[i].elo) {
        return DIFFICULTY_LEVELS[i];
      }
    }
    return DIFFICULTY_LEVELS[0];
  };

  const level = getDifficultyLevel(difficulty);

  return (
    <Card className="bg-white/10 border-2 border-white/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-white flex items-center justify-center gap-2">
          <Bot className="w-6 h-6" />
          AI Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Snowflake className="w-8 h-8 mx-auto mb-2 text-blue-300 animate-spin-slow" />
          <Badge className={`${level.color} text-white text-lg px-4 py-1`}>
            {level.label}
          </Badge>
          <div className="text-2xl font-bold text-white mt-2">{difficulty} ELO</div>
        </div>
        <Slider
          value={[difficulty]}
          onValueChange={(value) => onChange(value[0])}
          min={800}
          max={2400}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/70">
          <span>Easy</span>
          <span>Impossible</span>
        </div>
      </CardContent>
    </Card>
  );
}
