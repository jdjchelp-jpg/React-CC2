import { api } from "encore.dev/api";

interface GetSettingsResponse {
  year: number;
  theme: string;
  snowIntensity: number;
  musicVolume: number;
}

export const get = api<void, GetSettingsResponse>(
  { method: "GET", path: "/settings", expose: true },
  async (): Promise<GetSettingsResponse> => {
    return {
      year: new Date().getFullYear(),
      theme: "classic",
      snowIntensity: 50,
      musicVolume: 50,
    };
  }
);
