import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { useBackend } from '../../lib/useBackend';
import AIDifficultySelector from '../shared/AIDifficultySelector';
import GameResultScreen from '../shared/GameResultScreen';
import MatchmakingModal from '../shared/MatchmakingModal';
import { toast } from '@/components/ui/use-toast';

interface ChessProps {
  onBack: () => void;
}

type GameMode = 'menu' | 'playing';
type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'P' | 'R' | 'N' | 'B' | 'Q' | 'K' | '.';

interface Position {
  row: number;
  col: number;
}

export default function ChristmasChess({ onBack }: ChessProps) {
  const backend = useBackend();
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [aiDifficulty, setAiDifficulty] = useState(1200);
  const [matchmaking, setMatchmaking] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [eloChange, setEloChange] = useState<number>(0);
  const [newElo, setNewElo] = useState<number>(1200);
  const [board, setBoard] = useState<PieceType[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [gameId, setGameId] = useState<number | null>(null);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [qualified, setQualified] = useState(false);

  const initializeChessBoard = (): PieceType[][] => {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ] as PieceType[][];
  };

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    try {
      const stats = await backend.user.getStats({});
      const chessStat = stats.stats.find((s: any) => s.game_type === 'chess');
      if (chessStat) {
        setQualified(chessStat.qualified || false);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const startAIGame = async () => {
    try {
      const response = await backend.game.startAIGame({
        game_type: 'chess',
        ai_difficulty: aiDifficulty,
      });

      setGameId(response.game_id);
      setPlayerColor(response.player_color as 'white' | 'black');
      setBoard(response.initial_state.board);
      setCurrentTurn(response.initial_state.currentTurn);
      setMoveHistory([]);
      setGameMode('playing');

      if (response.player_color === 'black') {
        setTimeout(() => makeAIMove(response.game_id), 500);
      }
    } catch (err: any) {
      console.error('Failed to start chess game:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to start game',
        variant: 'destructive',
      });
    }
  };

  const makeAIMove = async (gId: number) => {
    try {
      const aiMoveResp = await backend.game.getAIMove({ game_id: gId });
      if (aiMoveResp.move) {
        setTimeout(() => {
          handlePieceMove(aiMoveResp.move.from, aiMoveResp.move.to, true);
        }, 300);
      }
    } catch (err) {
      console.error('AI move failed:', err);
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== playerColor) return;

    if (selectedPiece) {
      handlePieceMove(selectedPiece, { row, col }, false);
      setSelectedPiece(null);
    } else {
      const piece = board[row][col];
      if (piece !== '.' && isPieceOwnedByPlayer(piece)) {
        setSelectedPiece({ row, col });
      }
    }
  };

  const isPieceOwnedByPlayer = (piece: PieceType): boolean => {
    if (playerColor === 'white') {
      return piece === piece.toUpperCase() && piece !== '.';
    } else {
      return piece === piece.toLowerCase() && piece !== '.';
    }
  };

  const handlePieceMove = async (from: Position, to: Position, isAI: boolean) => {
    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = '.';
    setBoard(newBoard);
    setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');

    if (!isAI && gameId) {
      try {
        const result = await backend.game.makeAIMove({
          game_id: gameId,
          move: { from, to },
        });

        if (result.game_over) {
          setGameResult(result.result || 'draw');
          setEloChange(25);
          setNewElo(1225);
        } else {
          setTimeout(() => makeAIMove(gameId), 500);
        }
      } catch (err) {
        console.error('Move failed:', err);
      }
    }
  };

  const startMultiplayerGame = () => {
    setMatchmaking(true);
  };

  const getPieceIcon = (piece: PieceType) => {
    const icons: Record<string, string> = {
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    };
    return icons[piece] || '';
  };

  const getPieceColor = (piece: PieceType) => {
    if (piece === piece.toLowerCase() && piece !== '.') return 'text-red-600';
    if (piece === piece.toUpperCase() && piece !== '.') return 'text-blue-600';
    return '';
  };

  const getBoardTheme = () => {
    const themes = [
      { light: 'bg-blue-50', dark: 'bg-blue-800', name: 'Frozen Ice' },
      { light: 'bg-amber-50', dark: 'bg-amber-700', name: "Santa's Workshop" },
      { light: 'bg-red-50', dark: 'bg-green-700', name: 'Candy Cane' },
    ];
    return themes[0];
  };

  const theme = getBoardTheme();

  if (gameResult) {
    return (
      <GameResultScreen
        result={gameResult}
        eloChange={eloChange}
        newElo={newElo}
        onPlayAgain={() => {
          setGameResult(null);
          setGameMode('menu');
          loadPlayerStats();
        }}
        onBackToHub={onBack}
      />
    );
  }

  if (matchmaking) {
    return (
      <MatchmakingModal
        gameType="chess"
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
          <CardHeader className="bg-gradient-to-r from-red-600 to-green-600 border-b-4 border-yellow-400">
            <CardTitle className="text-center text-3xl flex items-center justify-center gap-2 text-white">
              <Crown className="w-8 h-8 text-yellow-300" />
              Christmas Chess - {theme.name} Board
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </CardTitle>
            <div className="text-center text-white text-sm mt-2">
              You are playing as: <span className="font-bold">{playerColor === 'white' ? 'White (Blue)' : 'Black (Red)'}</span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-2xl">
                <div className="grid grid-cols-8 gap-0 border-8 border-amber-900 shadow-xl">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0;
                      const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`w-20 h-20 flex items-center justify-center text-5xl cursor-pointer hover:opacity-80 transition-all ${
                            isLight ? theme.light : theme.dark
                          } ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                        >
                          <span className={`${getPieceColor(piece)} drop-shadow-lg`}>
                            {getPieceIcon(piece)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold mb-2">
                  {currentTurn === playerColor ? (
                    <span className="text-green-600">Your Turn</span>
                  ) : (
                    <span className="text-red-600">Opponent's Turn...</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setGameMode('menu');
                    setBoard(initializeChessBoard());
                  }}
                  variant="outline"
                  className="bg-white/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Resign
                </Button>
              </div>
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
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-2">
            <Crown className="w-10 h-10 text-yellow-300" />
            Christmas Chess
            <Sparkles className="w-10 h-10 text-yellow-300" />
          </CardTitle>
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
                Play vs AI ({aiDifficulty} ELO)
              </Button>
            </div>

            <Card className="bg-white/10 border-2 border-white/30">
              <CardHeader>
                <CardTitle className="text-center text-white">Multiplayer</CardTitle>
              </CardHeader>
              <CardContent>
                {!qualified ? (
                  <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-300 text-center">
                      Complete 5 AI games to unlock multiplayer!
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-400/20 border border-green-400 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-300 text-center">
                      Multiplayer Unlocked!
                    </p>
                  </div>
                )}
                <Button 
                  onClick={startMultiplayerGame}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6" 
                  disabled={!qualified}
                >
                  <Users className="w-6 h-6 mr-2" />
                  {qualified ? 'Find Opponent' : 'Find Opponent (Locked)'}
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
