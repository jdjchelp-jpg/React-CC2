import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface PlayerProfile {
  id: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  overall_elo: number;
  total_games: number;
  total_wins: number;
  total_losses: number;
  total_draws: number;
  hero_rank: string;
  calibration_games: number;
  multiplayer_unlocked: boolean;
}

export const initializePlayer = api<void, PlayerProfile>(
  { expose: true, method: "POST", path: "/game/initialize", auth: true },
  async () => {
    const auth = getAuthData()!;

    let player = await db.queryRow<PlayerProfile>`
      SELECT * FROM players WHERE user_id = ${auth.userID}
    `;

    if (!player) {
      await db.exec`
        INSERT INTO players (user_id, username, avatar_url)
        VALUES (${auth.userID}, ${auth.username || 'Player'}, ${auth.imageUrl})
      `;

      player = await db.queryRow<PlayerProfile>`
        SELECT * FROM players WHERE user_id = ${auth.userID}
      `;

      if (!player) {
        throw APIError.internal("Failed to create player profile");
      }
    }

    return player;
  }
);
