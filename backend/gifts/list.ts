import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export interface Gift {
  id: number;
  recipient: string;
  giftIdea: string;
  budget: number | null;
  purchased: boolean;
}

export interface ListGiftsResponse {
  gifts: Gift[];
}

export const list = api<void, ListGiftsResponse>(
  { auth: true, expose: true, method: "GET", path: "/gifts" },
  async () => {
    const auth = getAuthData()!;
    
    const rows = await db.queryAll<{
      id: number;
      recipient: string;
      gift_idea: string;
      budget: number | null;
      purchased: boolean;
    }>`
      SELECT id, recipient, gift_idea, budget, purchased
      FROM gifts
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;

    return {
      gifts: rows.map(row => ({
        id: Number(row.id),
        recipient: row.recipient,
        giftIdea: row.gift_idea,
        budget: row.budget,
        purchased: row.purchased,
      })),
    };
  }
);
