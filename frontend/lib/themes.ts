export type ColorTheme = 'classic' | 'winter' | 'royal' | 'candy' | 'golden' | 'icy' | 'forest' | 'sunset' | 'aurora';

export interface Theme {
  gradient: string;
  card: string;
  text: string;
  sparkle: string;
  progressStart: string;
  progressEnd: string;
}

export const themes: Record<ColorTheme, Theme> = {
  classic: {
    gradient: 'bg-gradient-to-br from-red-900 via-green-900 to-red-900',
    card: 'bg-red-500/20',
    text: 'text-red-100',
    sparkle: 'bg-yellow-300',
    progressStart: '#ef4444',
    progressEnd: '#22c55e',
  },
  winter: {
    gradient: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900',
    card: 'bg-blue-500/20',
    text: 'text-blue-100',
    sparkle: 'bg-cyan-300',
    progressStart: '#3b82f6',
    progressEnd: '#06b6d4',
  },
  royal: {
    gradient: 'bg-gradient-to-br from-purple-900 via-yellow-900 to-purple-900',
    card: 'bg-purple-500/20',
    text: 'text-purple-100',
    sparkle: 'bg-amber-300',
    progressStart: '#a855f7',
    progressEnd: '#fbbf24',
  },
  candy: {
    gradient: 'bg-gradient-to-br from-pink-900 via-red-800 to-pink-900',
    card: 'bg-pink-500/20',
    text: 'text-pink-100',
    sparkle: 'bg-pink-300',
    progressStart: '#ec4899',
    progressEnd: '#f43f5e',
  },
  golden: {
    gradient: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900',
    card: 'bg-amber-500/20',
    text: 'text-amber-100',
    sparkle: 'bg-yellow-200',
    progressStart: '#f59e0b',
    progressEnd: '#fbbf24',
  },
  icy: {
    gradient: 'bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900',
    card: 'bg-sky-500/20',
    text: 'text-sky-100',
    sparkle: 'bg-sky-200',
    progressStart: '#0ea5e9',
    progressEnd: '#38bdf8',
  },
  forest: {
    gradient: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900',
    card: 'bg-emerald-500/20',
    text: 'text-emerald-100',
    sparkle: 'bg-lime-300',
    progressStart: '#10b981',
    progressEnd: '#14b8a6',
  },
  sunset: {
    gradient: 'bg-gradient-to-br from-orange-900 via-rose-800 to-purple-900',
    card: 'bg-orange-500/20',
    text: 'text-orange-100',
    sparkle: 'bg-rose-300',
    progressStart: '#f97316',
    progressEnd: '#e11d48',
  },
  aurora: {
    gradient: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900',
    card: 'bg-indigo-500/20',
    text: 'text-indigo-100',
    sparkle: 'bg-fuchsia-300',
    progressStart: '#6366f1',
    progressEnd: '#ec4899',
  },
};
