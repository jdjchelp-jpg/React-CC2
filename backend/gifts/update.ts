import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface UpdateGiftRequest {
  id: number;
  recipient?: string;
  giftIdea?: string;
  budget?: number;
  purchased?: boolean;
}

export interface UpdateGiftResponse {
  success: boolean;
}

export const update = api<UpdateGiftRequest, UpdateGiftResponse>(
  { auth: true, expose: true, method: "PUT", path: "/gifts/:id" },
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

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.recipient !== undefined) {
      updates.push(`recipient = $${paramIndex++}`);
      params.push(req.recipient);
    }
    if (req.giftIdea !== undefined) {
      updates.push(`gift_idea = $${paramIndex++}`);
      params.push(req.giftIdea);
    }
    if (req.budget !== undefined) {
      updates.push(`budget = $${paramIndex++}`);
      params.push(req.budget);
    }
    if (req.purchased !== undefined) {
      updates.push(`purchased = $${paramIndex++}`);
      params.push(req.purchased);
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.id);

    if (updates.length > 1) {
      await db.rawExec(
        `UPDATE gifts SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
        ...params
      );
    }

    return { success: true };
  }
);
