export interface AppSettings {
  selectedYear: number;
  selectedTheme: string;
  snowIntensity: number;
  musicVolume: number;
  customMusicUrl: string;
  language: string;
  notificationsEnabled: boolean;
  customNotificationMessages: {
    oneWeek: string;
    threeDays: string;
    oneDay: string;
  };
  timezone?: string;
  targetDate?: string;
  targetEventName?: string;
  miniMode?: boolean;
  reducedMotion?: boolean;
  colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  accessibilityMode?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  fontWeight?: number;
  lineSpacing?: number;
  dyslexiaFont?: boolean;
  magnifierMode?: boolean;
  textToSpeech?: boolean;
  ttsVoice?: string;
  hapticFeedback?: boolean;
  shapesOnlyMode?: boolean;
  uiScale?: number;
  audioAlerts?: boolean;
  audioAlertFrequency?: number;
}

export interface GameScore {
  memoryGif: number;
  catchSnowflakes: number;
  decorateTree: number;
  santaSleigh: number;
  candyCaneStack: number;
}

const SETTINGS_KEY = 'christmas-countdown-settings';
const SCORES_KEY = 'christmas-countdown-scores';

export const loadSettings = (): Partial<AppSettings> => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadScores = (): GameScore => {
  try {
    const stored = localStorage.getItem(SCORES_KEY);
    return stored ? JSON.parse(stored) : {
      memoryGif: 0,
      catchSnowflakes: 0,
      decorateTree: 0,
      santaSleigh: 0,
      candyCaneStack: 0
    };
  } catch {
    return {
      memoryGif: 0,
      catchSnowflakes: 0,
      decorateTree: 0,
      santaSleigh: 0,
      candyCaneStack: 0
    };
  }
};

export const saveScore = (game: keyof GameScore, score: number): void => {
  try {
    const scores = loadScores();
    if (score > scores[game]) {
      scores[game] = score;
      localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    }
  } catch (error) {
    console.error('Failed to save score:', error);
  }
};
