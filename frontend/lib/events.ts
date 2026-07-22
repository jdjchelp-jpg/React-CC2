export type HolidayEvent =
  | 'christmas'
  | 'diwali'
  | 'easter'
  | 'eid_al_fitr'
  | 'fourth_of_july'
  | 'halloween'
  | 'hanukkah'
  | 'new_year'
  | 'st_patricks_day'
  | 'thanksgiving'
  | 'valentines_day';

export interface EventData {
  id: HolidayEvent;
  name: string;
  emoji: string;
  date: { month: number; day: number };
  colors: string[];
  gradient: string;
  description: string;
  keywords: string[];
}

export const events: Record<HolidayEvent, EventData> = {
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    date: { month: 11, day: 25 },
    colors: ['#ef4444', '#22c55e', '#eab308'],
    gradient: 'bg-gradient-to-br from-red-900 via-green-900 to-red-900',
    description: 'Celebrate the birth of Jesus with family, gifts, and festive cheer',
    keywords: ['santa', 'reindeer', 'snow', 'gifts', 'tree', 'carols']
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    date: { month: 10, day: 12 },
    colors: ['#f97316', '#eab308', '#ef4444'],
    gradient: 'bg-gradient-to-br from-orange-900 via-yellow-800 to-red-900',
    description: 'The Festival of Lights, celebrating light over darkness',
    keywords: ['lights', 'rangoli', 'fireworks', 'sweets', 'lamps']
  },
  easter: {
    id: 'easter',
    name: 'Easter',
    emoji: '🐣',
    date: { month: 3, day: 31 },
    colors: ['#ec4899', '#fde047', '#a855f7'],
    gradient: 'bg-gradient-to-br from-pink-700 via-yellow-600 to-purple-800',
    description: 'Celebrate the resurrection of Jesus with egg hunts and spring joy',
    keywords: ['eggs', 'bunny', 'spring', 'chocolate', 'flowers']
  },
  eid_al_fitr: {
    id: 'eid_al_fitr',
    name: 'Eid al-Fitr',
    emoji: '☪️',
    date: { month: 4, day: 10 },
    colors: ['#10b981', '#22c55e', '#fbbf24'],
    gradient: 'bg-gradient-to-br from-emerald-900 via-green-800 to-amber-900',
    description: 'The festival of breaking the fast, marking the end of Ramadan',
    keywords: ['ramadan', 'fasting', 'prayer', 'family', 'feast']
  },
  fourth_of_july: {
    id: 'fourth_of_july',
    name: 'Fourth of July',
    emoji: '🇺🇸',
    date: { month: 6, day: 4 },
    colors: ['#ef4444', '#3b82f6', '#ffffff'],
    gradient: 'bg-gradient-to-br from-blue-900 via-red-800 to-blue-900',
    description: 'Independence Day - celebrating freedom with fireworks and BBQ',
    keywords: ['fireworks', 'bbq', 'patriotic', 'parade', 'freedom']
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    date: { month: 9, day: 31 },
    colors: ['#f97316', '#a855f7', '#1a1a2e'],
    gradient: 'bg-gradient-to-br from-orange-900 via-purple-900 to-slate-900',
    description: 'A spooky celebration with costumes, candy, and decorations',
    keywords: ['pumpkin', 'ghost', 'candy', 'costume', 'spooky', 'trickortreat']
  },
  hanukkah: {
    id: 'hanukkah',
    name: 'Hanukkah',
    emoji: '🕎',
    date: { month: 11, day: 25 },
    colors: ['#2563eb', '#fbbf24', '#ffffff'],
    gradient: 'bg-gradient-to-br from-blue-900 via-amber-800 to-blue-900',
    description: 'The Jewish Festival of Lights, celebrating the miracle of the oil',
    keywords: ['menorah', 'dreidel', 'latkes', 'gelt', 'lights']
  },
  new_year: {
    id: 'new_year',
    name: "New Year",
    emoji: '🎉',
    date: { month: 0, day: 1 },
    colors: ['#eab308', '#ef4444', '#a855f7'],
    gradient: 'bg-gradient-to-br from-yellow-900 via-red-800 to-purple-900',
    description: 'Ring in the new year with celebrations, resolutions, and fireworks',
    keywords: ['fireworks', 'resolution', 'midnight', 'party', 'countdown']
  },
  st_patricks_day: {
    id: 'st_patricks_day',
    name: "St. Patrick's Day",
    emoji: '🍀',
    date: { month: 2, day: 17 },
    colors: ['#22c55e', '#16a34a', '#fbbf24'],
    gradient: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-900',
    description: 'Celebrate Irish culture with parades, green attire, and luck',
    keywords: ['irish', 'shamrock', 'leprechaun', 'green', 'lucky']
  },
  thanksgiving: {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    emoji: '🦃',
    date: { month: 10, day: 23 },
    colors: ['#92400e', '#f59e0b', '#78716c'],
    gradient: 'bg-gradient-to-br from-amber-900 via-orange-800 to-stone-900',
    description: 'A day of gratitude, family gatherings, and festive feasts',
    keywords: ['turkey', 'pumpkin', 'family', 'gratitude', 'feast']
  },
  valentines_day: {
    id: 'valentines_day',
    name: "Valentine's Day",
    emoji: '💕',
    date: { month: 1, day: 14 },
    colors: ['#ec4899', '#ef4444', '#f43f5e'],
    gradient: 'bg-gradient-to-br from-pink-900 via-rose-800 to-red-900',
    description: 'Celebrate love and romance with cards, chocolates, and flowers',
    keywords: ['love', 'romance', 'hearts', 'chocolate', 'flowers']
  }
};

export const getEventByDate = (): HolidayEvent | null => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  for (const [key, event] of Object.entries(events)) {
    if (event.date.month === month && event.date.day === day) {
      return key as HolidayEvent;
    }
  }
  return null;
};

export const getDaysUntilEvent = (eventId: HolidayEvent, year: number): number => {
  const event = events[eventId];
  const eventDate = new Date(year, event.date.month, event.date.day);
  const now = new Date();
  const difference = eventDate.getTime() - now.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

export const getNextEvent = (year: number): { event: EventData; daysUntil: number } => {
  let closest: EventData | null = null;
  let closestDays = Infinity;

  for (const event of Object.values(events)) {
    const days = getDaysUntilEvent(event.id, year);
    if (days >= 0 && days < closestDays) {
      closest = event;
      closestDays = days;
    }
  }

  return {
    event: closest || events.christmas,
    daysUntil: closest !== null ? closestDays : 365
  };
};
