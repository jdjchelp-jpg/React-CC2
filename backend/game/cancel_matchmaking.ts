import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface CancelMatchmakingRequest {
  game_type: string;
}

interface CancelMatchmakingResponse {
  success: boolean;
}

export const cancelMatchmaking = api<CancelMatchmakingRequest, CancelMatchmakingResponse>(
  { expose: true, method: "POST", path: "/game/matchmaking/cancel", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const player = await db.queryRow<{ id: number }>`
      SELECT id FROM players WHERE user_id = ${auth.userID}
    `;

    if (!player) {
      throw APIError.notFound("Player not found");
    }

    await db.exec`
      DELETE FROM matchmaking_queue
      WHERE player_id = ${player.id} AND game_type = ${req.game_type}
    `;

    return { success: true };
  }
);
