import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface JoinGameParams {
  session_id: string;
}

interface GameSession {
  id: string;
  game_type: string;
  player_white: string;
  player_black: string;
  status: string;
  current_turn: string;
  game_state: any;
}

export const join = api<JoinGameParams, GameSession>(
  { auth: true, expose: true, method: "POST", path: "/game/join" },
  async ({ session_id }) => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    const session = await db.queryRow<GameSession>`
      SELECT * FROM game_sessions WHERE id = ${session_id}
    `;

    if (!session) {
      throw APIError.notFound("game session not found");
    }

    if (session.status !== "waiting") {
      throw APIError.invalidArgument("game already started");
    }

    if (session.player_white === user_id) {
      throw APIError.invalidArgument("cannot join your own game");
    }

    const updated = await db.queryRow<GameSession>`
      UPDATE game_sessions
      SET player_black = ${user_id}, status = 'playing', updated_at = NOW()
      WHERE id = ${session_id}
      RETURNING *
    `;

    return updated!;
  }
);
