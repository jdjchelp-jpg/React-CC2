import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus, Star, Home } from 'lucide-react';

interface GameResultScreenProps {
  result: 'win' | 'loss' | 'draw';
  eloChange?: number;
  newElo?: number;
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export default function GameResultScreen({
  result,
  eloChange,
  newElo,
  onPlayAgain,
  onBackToHub,
}: GameResultScreenProps) {
  const getResultConfig = () => {
    switch (result) {
      case 'win':
        return {
          title: '🎉 Victory! 🎉',
          message: 'You won the game!',
          color: 'from-green-600 to-emerald-700',
          icon: <Trophy className="w-20 h-20 text-yellow-300 animate-bounce" />,
        };
      case 'loss':
        return {
          title: '❄️ Defeat ❄️',
          message: 'Better luck next time!',
          color: 'from-red-600 to-rose-700',
          icon: <Star className="w-20 h-20 text-blue-300" />,
        };
      case 'draw':
        return {
          title: '🤝 Draw 🤝',
          message: 'A fair match!',
          color: 'from-gray-600 to-slate-700',
          icon: <Minus className="w-20 h-20 text-white" />,
        };
    }
  };

  const config = getResultConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`max-w-md w-full bg-gradient-to-br ${config.color} border-4 border-yellow-400 shadow-2xl`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{config.icon}</div>
          <CardTitle className="text-4xl font-bold text-white mb-2">{config.title}</CardTitle>
          <p className="text-xl text-white/90">{config.message}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {eloChange !== undefined && newElo !== undefined && (
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">ELO Rating</span>
                <Badge variant="secondary" className="text-2xl px-4 py-2">
                  {newElo}
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2">
                {eloChange > 0 ? (
                  <>
                    <TrendingUp className="w-6 h-6 text-green-300" />
                    <span className="text-2xl font-bold text-green-300">+{eloChange}</span>
                  </>
                ) : eloChange < 0 ? (
                  <>
                    <TrendingDown className="w-6 h-6 text-red-300" />
                    <span className="text-2xl font-bold text-red-300">{eloChange}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-300">0</span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={onBackToHub}
              variant="outline"
              className="w-full bg-white/10 border-white text-white hover:bg-white/20 text-lg py-6"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Hub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
