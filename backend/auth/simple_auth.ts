import { Header, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
  username: string | null;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      userID: guestId,
      imageUrl: "",
      email: null,
      username: `Guest${guestId.substr(-4)}`,
    };
  }
);
