import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface CreateGiftRequest {
  recipient: string;
  giftIdea: string;
  budget?: number;
}

export interface CreateGiftResponse {
  id: number;
}

export const create = api<CreateGiftRequest, CreateGiftResponse>(
  { auth: true, expose: true, method: "POST", path: "/gifts" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await db.queryRow<{ id: number }>`
      INSERT INTO gifts (user_id, recipient, gift_idea, budget)
      VALUES (${auth.userID}, ${req.recipient}, ${req.giftIdea}, ${req.budget ?? null})
      RETURNING id
    `;

    return { id: Number(row!.id) };
  }
);
