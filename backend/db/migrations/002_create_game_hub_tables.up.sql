-- Drop old tables from previous schema if they exist
DROP TABLE IF EXISTS game_history CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS game_stats CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create new schema
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  overall_elo INT NOT NULL DEFAULT 1200,
  total_games INT NOT NULL DEFAULT 0,
  total_wins INT NOT NULL DEFAULT 0,
  total_losses INT NOT NULL DEFAULT 0,
  total_draws INT NOT NULL DEFAULT 0,
  hero_rank TEXT NOT NULL DEFAULT 'Snow Recruit',
  calibration_games INT NOT NULL DEFAULT 0,
  multiplayer_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_elo ON players(overall_elo DESC);

CREATE TABLE game_stats (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  elo INT NOT NULL DEFAULT 1200,
  games_played INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  draws INT NOT NULL DEFAULT 0,
  ai_games INT NOT NULL DEFAULT 0,
  multiplayer_games INT NOT NULL DEFAULT 0,
  highest_elo INT NOT NULL DEFAULT 1200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(player_id, game_type)
);

CREATE INDEX idx_game_stats_player_id ON game_stats(player_id);
CREATE INDEX idx_game_stats_game_type ON game_stats(game_type);
CREATE INDEX idx_game_stats_elo ON game_stats(elo DESC);

CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  game_type TEXT NOT NULL,
  player1_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player2_id BIGINT REFERENCES players(id) ON DELETE CASCADE,
  player1_color TEXT,
  player2_color TEXT,
  is_ai_match BOOLEAN NOT NULL DEFAULT FALSE,
  ai_difficulty INT,
  winner_id BIGINT REFERENCES players(id) ON DELETE SET NULL,
  result TEXT NOT NULL,
  game_state JSONB,
  move_history JSONB,
  elo_change_p1 INT,
  elo_change_p2 INT,
  duration_seconds INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_player1 ON matches(player1_id);
CREATE INDEX idx_matches_player2 ON matches(player2_id);
CREATE INDEX idx_matches_game_type ON matches(game_type);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

CREATE TABLE active_games (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  player1_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player2_id BIGINT REFERENCES players(id) ON DELETE CASCADE,
  current_turn TEXT,
  game_state JSONB NOT NULL,
  move_history JSONB NOT NULL DEFAULT '[]',
  is_ai_match BOOLEAN NOT NULL DEFAULT FALSE,
  ai_difficulty INT,
  last_move_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_active_games_player1 ON active_games(player1_id);
CREATE INDEX idx_active_games_player2 ON active_games(player2_id);
CREATE INDEX idx_active_games_match_id ON active_games(match_id);

CREATE TABLE matchmaking_queue (
  id BIGSERIAL PRIMARY KEY,
  player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  elo INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matchmaking_game_type ON matchmaking_queue(game_type);
CREATE INDEX idx_matchmaking_player_id ON matchmaking_queue(player_id);
CREATE INDEX idx_matchmaking_created_at ON matchmaking_queue(created_at);
