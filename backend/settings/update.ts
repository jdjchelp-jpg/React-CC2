import { api } from "encore.dev/api";

interface UpdateSettingsRequest {
  year?: number;
  theme?: string;
  snowIntensity?: number;
  musicVolume?: number;
}

interface UpdateSettingsResponse {
  success: boolean;
}

export const update = api<UpdateSettingsRequest, UpdateSettingsResponse>(
  { method: "POST", path: "/settings", expose: true },
  async (req): Promise<UpdateSettingsResponse> => {
    return { success: true };
  }
);
