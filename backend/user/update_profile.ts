import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UpdateProfileParams {
  username?: string;
  avatar_url?: string;
}

interface UserProfile {
  user_id: string;
  username: string;
  avatar_url?: string;
  hero_class: string;
}

export const updateProfile = api<UpdateProfileParams, UserProfile>(
  { auth: true, expose: true, method: "POST", path: "/user/profile" },
  async ({ username, avatar_url }) => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    const updates: string[] = [];
    const values: any[] = [];

    if (username) {
      updates.push(`username = $${values.length + 1}`);
      values.push(username);
    }
    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${values.length + 1}`);
      values.push(avatar_url);
    }

    updates.push(`updated_at = NOW()`);
    values.push(user_id);

    const profile = await db.rawQueryRow<UserProfile>(
      `UPDATE user_profiles SET ${updates.join(", ")} WHERE user_id = $${values.length} RETURNING *`,
      ...values
    );

    return profile!;
  }
);
