export const getSystemTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getTimezoneOffset = (timezone: string): number => {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', { timeZone: timezone });
  const tzDate = new Date(tzString);
  const localString = now.toLocaleString('en-US');
  const localDate = new Date(localString);
  return tzDate.getTime() - localDate.getTime();
};

export const convertToTimezone = (date: Date, timezone: string): Date => {
  const offset = getTimezoneOffset(timezone);
  return new Date(date.getTime() + offset);
};

export const popularTimezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CST)', value: 'America/Chicago' },
  { label: 'Denver (MST)', value: 'America/Denver' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEDT)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
  { label: 'Toronto (EST)', value: 'America/Toronto' },
  { label: 'Mexico City (CST)', value: 'America/Mexico_City' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Berlin (CET)', value: 'Europe/Berlin' },
  { label: 'Amsterdam (CET)', value: 'Europe/Amsterdam' },
  { label: 'Auckland (NZDT)', value: 'Pacific/Auckland' },
];
