CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_url TEXT,
  hero_class TEXT NOT NULL DEFAULT 'Snow Recruit',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE game_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  elo_rating INTEGER NOT NULL DEFAULT 1200,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  total_games INTEGER NOT NULL DEFAULT 0,
  qualification_games INTEGER NOT NULL DEFAULT 0,
  qualified BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

CREATE TABLE game_sessions (
  id TEXT PRIMARY KEY,
  game_type TEXT NOT NULL,
  player_white TEXT NOT NULL,
  player_black TEXT,
  is_ai BOOLEAN NOT NULL DEFAULT FALSE,
  ai_difficulty INTEGER,
  status TEXT NOT NULL DEFAULT 'waiting',
  current_turn TEXT NOT NULL,
  game_state JSONB NOT NULL,
  winner TEXT,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE game_history (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  player_white TEXT NOT NULL,
  player_black TEXT NOT NULL,
  winner TEXT,
  result TEXT NOT NULL,
  white_elo_change INTEGER,
  black_elo_change INTEGER,
  moves JSONB,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_game_stats_user_id ON game_stats(user_id);
CREATE INDEX idx_game_stats_game_type ON game_stats(game_type);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_sessions_player_white ON game_sessions(player_white);
CREATE INDEX idx_game_sessions_player_black ON game_sessions(player_black);
CREATE INDEX idx_game_history_player ON game_history(player_white, player_black);
