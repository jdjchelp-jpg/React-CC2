export type GameType = "chess" | "connect4" | "checkers" | "tictactoe" | "othello" | "memory" | "tower" | "reindeer";

export interface GameSession {
  id: string;
  game_type: GameType;
  player_white: string;
  player_black?: string;
  is_ai: boolean;
  ai_difficulty?: number;
  status: "waiting" | "playing" | "finished";
  current_turn: string;
  game_state: any;
  winner?: string;
  result?: string;
}

export interface GameStats {
  game_type: GameType;
  elo_rating: number;
  wins: number;
  losses: number;
  draws: number;
  total_games: number;
  qualification_games: number;
  qualified: boolean;
}

export interface UserProfile {
  user_id: string;
  username: string;
  avatar_url?: string;
  hero_class: string;
  created_at: Date;
  updated_at: Date;
}
