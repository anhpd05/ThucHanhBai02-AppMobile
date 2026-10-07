const weekdays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

export function formatHour(time: string): string {
  const match = /^\d{4}-\d{2}-\d{2}T((?:[01]\d|2[0-3]):[0-5]\d)/.exec(time);
  return match ? match[1] : '—';
}

export function formatWeekday(date: string, today?: string): string {
  const localDate = date.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return '—';
  }
  const year = Number(localDate.slice(0, 4));
  const month = Number(localDate.slice(5, 7));
  const day = Number(localDate.slice(8, 10));
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return '—';
  }
  if (today?.slice(0, 10) === localDate) {
    return 'Hôm nay';
  }
  return weekdays[utcDate.getUTCDay()];
}

export function formatDayMonth(date: string): string {
  if (formatWeekday(date) === '—') {
    return '—';
  }
  return `${Number(date.slice(8, 10))}/${Number(date.slice(5, 7))}`;
}

export function formatTemp(value: number): string {
  return Number.isFinite(value) ? `${Math.round(value)}°` : '—';
}

export function formatVisibility(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) {
    return '—';
  }
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}
