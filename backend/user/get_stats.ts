import { api, Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface GetStatsParams {
  game_type?: Query<"game_type">;
}

interface GameStats {
  game_type: string;
  elo_rating: number;
  wins: number;
  losses: number;
  draws: number;
  total_games: number;
  qualification_games: number;
  qualified: boolean;
}

interface StatsResponse {
  stats: GameStats[];
}

export const getStats = api<GetStatsParams, StatsResponse>(
  { auth: true, expose: true, method: "GET", path: "/user/stats" },
  async ({ game_type }) => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    let stats: GameStats[];

    if (game_type) {
      const stat = await db.queryRow<GameStats>`
        SELECT game_type, elo_rating, wins, losses, draws, total_games, qualification_games, qualified
        FROM game_stats
        WHERE user_id = ${user_id} AND game_type = ${game_type}
      `;
      stats = stat ? [stat] : [];
    } else {
      stats = await db.queryAll<GameStats>`
        SELECT game_type, elo_rating, wins, losses, draws, total_games, qualification_games, qualified
        FROM game_stats
        WHERE user_id = ${user_id}
      `;
    }

    return { stats };
  }
);
