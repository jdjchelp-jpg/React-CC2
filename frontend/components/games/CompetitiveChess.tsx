import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, ArrowLeft } from 'lucide-react';
import { useBackend } from '../../lib/useBackend';
import AIDifficultySelector from '../shared/AIDifficultySelector';
import GameResultScreen from '../shared/GameResultScreen';
import MatchmakingModal from '../shared/MatchmakingModal';

interface ChessProps {
  onBack: () => void;
}

type GameMode = 'menu' | 'ai' | 'multiplayer' | 'playing';

export default function CompetitiveChess({ onBack }: ChessProps) {
  const backend = useBackend();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [aiDifficulty, setAiDifficulty] = useState(1200);
  const [matchmaking, setMatchmaking] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [eloChange, setEloChange] = useState<number>(0);
  const [newElo, setNewElo] = useState<number>(1200);
  const [board, setBoard] = useState<string[][]>([]);

  const initializeChessBoard = () => {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
  };

  const startAIGame = async () => {
    try {
      setBoard(initializeChessBoard());
      setGameMode('playing');
    } catch (err) {
      console.error('Failed to start chess game:', err);
    }
  };

  const startMultiplayerGame = () => {
    setMatchmaking(true);
  };

  const getPieceIcon = (piece: string) => {
    const icons: Record<string, string> = {
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    };
    return icons[piece] || '';
  };

  const getPieceColor = (piece: string) => {
    if (piece === piece.toLowerCase() && piece !== '.') return 'text-red-600';
    if (piece === piece.toUpperCase() && piece !== '.') return 'text-blue-600';
    return '';
  };

  if (gameResult) {
    return (
      <GameResultScreen
        result={gameResult}
        eloChange={eloChange}
        newElo={newElo}
        onPlayAgain={() => {
          setGameResult(null);
          setGameMode('menu');
        }}
        onBackToHub={onBack}
      />
    );
  }

  if (matchmaking) {
    return (
      <MatchmakingModal
        gameType="Christmas Chess"
        onCancel={() => setMatchmaking(false)}
        onMatchFound={(matchId) => {
          setMatchmaking(false);
          setGameMode('playing');
        }}
      />
    );
  }

  if (gameMode === 'playing') {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card className="bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-red-500 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2">
              ♟️ Christmas Chess ♟️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="grid grid-cols-8 gap-0 border-4 border-amber-900">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0;
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`w-16 h-16 flex items-center justify-center text-4xl cursor-pointer hover:opacity-80 transition-opacity ${
                            isLight ? 'bg-amber-50' : 'bg-amber-700'
                          }`}
                        >
                          <span className={getPieceColor(piece)}>{getPieceIcon(piece)}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setGameMode('menu')}
                  variant="outline"
                  className="bg-white/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Resign
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-red-600">
                  Your Turn
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Full chess implementation coming soon! This is a preview of the board.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border-4 border-yellow-400 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center">♟️ Christmas Chess ♟️</CardTitle>
          <p className="text-center text-gray-300 mt-2">
            Strategic snowman battles on a festive board
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <AIDifficultySelector difficulty={aiDifficulty} onChange={setAiDifficulty} />
              <Button onClick={startAIGame} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                <Bot className="w-6 h-6 mr-2" />
                Play vs AI
              </Button>
            </div>

            <Card className="bg-white/10 border-2 border-white/30">
              <CardHeader>
                <CardTitle className="text-center text-white">Multiplayer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-300 text-center">
                    Complete 5 AI games to unlock multiplayer!
                  </p>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6" disabled>
                  <Users className="w-6 h-6 mr-2" />
                  Find Opponent (Locked)
                </Button>
              </CardContent>
            </Card>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full bg-white/10 border-white text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
