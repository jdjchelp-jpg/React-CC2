import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface DeleteGiftRequest {
  id: number;
}

export interface DeleteGiftResponse {
  success: boolean;
}

export const remove = api<DeleteGiftRequest, DeleteGiftResponse>(
  { auth: true, expose: true, method: "DELETE", path: "/gifts/:id" },
  async (req) => {
    const auth = getAuthData()!;
    
    const existing = await db.queryRow<{ user_id: string }>`
      SELECT user_id FROM gifts WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("gift not found");
    }

    if (existing.user_id !== auth.userID) {
      throw APIError.permissionDenied("not your gift");
    }

    await db.exec`DELETE FROM gifts WHERE id = ${req.id}`;

    return { success: true };
  }
);
