import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, X } from 'lucide-react';
import { useBackend } from '../../lib/useBackend';
import { toast } from '@/components/ui/use-toast';

interface MatchmakingModalProps {
  gameType: string;
  onCancel: () => void;
  onMatchFound: (matchId: number) => void;
}

export default function MatchmakingModal({
  gameType,
  onCancel,
  onMatchFound,
}: MatchmakingModalProps) {
  const backend = useBackend();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    startMatchmaking();
    const pollInterval = setInterval(pollForMatch, 2000);
    
    return () => {
      clearInterval(pollInterval);
      cancelMatchmaking();
    };
  }, []);

  const startMatchmaking = async () => {
    try {
      const result = await backend.game.findMatch({ game_type: gameType });
      if (result.status === 'found' && result.match_id) {
        onMatchFound(result.match_id);
      }
    } catch (err: any) {
      console.error('Matchmaking failed:', err);
      toast({
        title: 'Matchmaking Error',
        description: err.message || 'Failed to join matchmaking',
        variant: 'destructive',
      });
      onCancel();
    }
  };

  const pollForMatch = async () => {
    try {
      const result = await backend.game.findMatch({ game_type: gameType });
      if (result.status === 'found' && result.match_id) {
        onMatchFound(result.match_id);
      }
    } catch (err) {
      console.error('Poll failed:', err);
    }
  };

  const cancelMatchmaking = async () => {
    try {
      await backend.game.cancelMatchmaking({ game_type: gameType });
    } catch (err) {
      console.error('Failed to cancel matchmaking:', err);
    }
  };

  const handleCancel = async () => {
    await cancelMatchmaking();
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-blue-600 to-purple-700 border-4 border-cyan-400 shadow-2xl animate-pulse-slow">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 animate-bounce" />
            Finding Opponent...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-white animate-spin mb-4" />
            <p className="text-white/90 text-lg mb-2">
              Searching for a worthy challenger
            </p>
            <p className="text-white/70 text-sm">
              This may take a few moments...
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Time Elapsed:</span>
              <span className="text-2xl font-bold text-cyan-300">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Connecting to matchmaking server...
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Searching for players with similar ELO...
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Game type: {gameType}
            </div>
          </div>

          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full bg-white/10 border-white text-white hover:bg-white/20 text-lg py-6"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel Search
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
