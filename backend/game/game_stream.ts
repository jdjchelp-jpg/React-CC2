import { api, StreamOut } from "encore.dev/api";
import db from "../db";

interface GameStreamHandshake {
  session_id: string;
  user_id: string;
}

interface GameUpdate {
  type: "move" | "end" | "joined";
  session_id: string;
  game_state: any;
  current_turn: string;
  status: string;
  winner?: string;
  result?: string;
  player_joined?: string;
}

export const gameStream = api.streamOut<GameStreamHandshake, GameUpdate>(
  { expose: true, path: "/game/stream" },
  async (handshake, stream) => {
    const { session_id, user_id } = handshake;

    const pollInterval = setInterval(async () => {
      try {
        const session = await db.queryRow<any>`
          SELECT * FROM game_sessions WHERE id = ${session_id}
        `;

        if (!session) {
          clearInterval(pollInterval);
          await stream.close();
          return;
        }

        if (session.status === "finished") {
          await stream.send({
            type: "end",
            session_id,
            game_state: session.game_state,
            current_turn: session.current_turn,
            status: session.status,
            winner: session.winner,
            result: session.result,
          });
          clearInterval(pollInterval);
          await stream.close();
          return;
        }

        await stream.send({
          type: "move",
          session_id,
          game_state: session.game_state,
          current_turn: session.current_turn,
          status: session.status,
        });
      } catch (err) {
        clearInterval(pollInterval);
        await stream.close();
      }
    }, 1000);
  }
);
