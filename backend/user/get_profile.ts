import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UserProfile {
  user_id: string;
  username: string;
  avatar_url?: string;
  hero_class: string;
  created_at: Date;
  updated_at: Date;
}

export const getProfile = api<void, UserProfile>(
  { auth: true, expose: true, method: "GET", path: "/user/profile" },
  async () => {
    const auth = getAuthData()!;
    const user_id = auth.userID;
    const profile = await db.queryRow<UserProfile>`
      SELECT * FROM user_profiles WHERE user_id = ${user_id}
    `;

    if (!profile) {
      const newProfile = await db.queryRow<UserProfile>`
        INSERT INTO user_profiles (user_id, username)
        VALUES (${user_id}, ${auth.username || `Player_${user_id.slice(0, 8)}`})
        RETURNING *
      `;
      return newProfile!;
    }

    return profile;
  }
);
