import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Trophy } from 'lucide-react';
import MemoryGifGame from './games/MemoryGifGame';
import CatchSnowflakes from './games/CatchSnowflakes';
import DecorateTreeGame from './games/DecorateTreeGame';
import SantaSleighRide from './games/SantaSleighRide';
import CandyCaneStack from './games/CandyCaneStack';
import GiftWrapper from './games/GiftWrapper';
import ElfWorkshop from './games/ElfWorkshop';
import BuildSnowman from './games/BuildSnowman';
import ChristmasTrivia from './games/ChristmasTrivia';
import Christmas2048 from './games/Christmas2048';
import ChristmasWordSearch from './games/ChristmasWordSearch';

interface Game {
  id: string;
  name: string;
  description: string;
  unlockDays: number;
  component: React.ComponentType;
}

const GAMES: Game[] = [
  {
    id: 'memory',
    name: 'Memory GIF Game',
    description: 'Match pairs of Christmas emojis',
    unlockDays: 25,
    component: MemoryGifGame
  },
  {
    id: 'snowflakes',
    name: 'Catch the Snowflakes',
    description: 'Click falling snowflakes to score points',
    unlockDays: 20,
    component: CatchSnowflakes
  },
  {
    id: 'decorate',
    name: 'Decorate the Tree',
    description: 'Drag and drop ornaments onto the tree',
    unlockDays: 15,
    component: DecorateTreeGame
  },
  {
    id: 'sleigh',
    name: 'Santa Sleigh Ride',
    description: 'Help Santa avoid obstacles',
    unlockDays: 10,
    component: SantaSleighRide
  },
  {
    id: 'stack',
    name: 'Candy Cane Stack',
    description: 'Stack candy canes as high as you can',
    unlockDays: 5,
    component: CandyCaneStack
  },
  {
    id: 'giftwrapper',
    name: 'Gift Wrapper',
    description: 'Wrap gifts and design beautiful presents',
    unlockDays: 45,
    component: GiftWrapper
  },
  {
    id: 'elfworkshop',
    name: 'Elf Workshop',
    description: 'Build toys and upgrade your workshop',
    unlockDays: 45,
    component: ElfWorkshop
  },
  {
    id: 'snowman',
    name: 'Build a Snowman',
    description: 'Drag and drop parts to build your snowman',
    unlockDays: 45,
    component: BuildSnowman
  },
  {
    id: 'trivia',
    name: 'Christmas Trivia',
    description: 'Test your Christmas knowledge',
    unlockDays: 50,
    component: ChristmasTrivia
  },
  {
    id: '2048',
    name: 'Christmas 2048',
    description: 'Merge tiles to reach 2048',
    unlockDays: 50,
    component: Christmas2048
  },
  {
    id: 'wordsearch',
    name: 'Word Search',
    description: 'Find hidden Christmas words',
    unlockDays: 50,
    component: ChristmasWordSearch
  }
];

interface GamesHubProps {
  daysUntilChristmas: number;
}

export default function GamesHub({ daysUntilChristmas }: GamesHubProps) {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const isGameUnlocked = (unlockDays: number) => {
    return daysUntilChristmas <= unlockDays;
  };

  if (selectedGame) {
    const game = GAMES.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="w-full">
          <Button 
            onClick={() => setSelectedGame(null)} 
            variant="outline" 
            className="mb-4"
            aria-label="Back to games menu"
          >
            {t('games.backToGames')}
          </Button>
          <GameComponent />
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="p-6 bg-background/90 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8" />
          {t('games.title')}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('games.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GAMES.map(game => {
            const unlocked = isGameUnlocked(game.unlockDays);
            return (
              <Card
                key={game.id}
                className={`p-4 transition-all ${
                  unlocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => unlocked && setSelectedGame(game.id)}
                role="button"
                tabIndex={unlocked ? 0 : -1}
                aria-label={unlocked ? `Play ${game.name}` : `${game.name} - Locked`}
                onKeyDown={(e) => {
                  if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedGame(game.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  {!unlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {game.description}
                </p>
                {unlocked ? (
                  <Button className="w-full" size="sm">
                    {t('games.playNow')}
                  </Button>
                ) : (
                  <p className="text-xs text-center text-muted-foreground">
                    {t('games.unlocksIn', { days: Math.abs(daysUntilChristmas - game.unlockDays) })}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
