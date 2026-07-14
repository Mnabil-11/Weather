const FAVORITES_KEY = 'atmos:favorites';
const HISTORY_KEY = 'atmos:history';
const MAX_ENTRIES = 6;

function read(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, values: string[]) {
  localStorage.setItem(key, JSON.stringify(values));
}

export function getFavorites(): string[] {
  return read(FAVORITES_KEY);
}

export function isFavorite(city: string): boolean {
  return getFavorites().includes(city);
}

export function toggleFavorite(city: string): string[] {
  const current = getFavorites();
  const next = current.includes(city) ? current.filter((c) => c !== city) : [city, ...current].slice(0, MAX_ENTRIES);
  write(FAVORITES_KEY, next);
  return next;
}

export function getHistory(): string[] {
  return read(HISTORY_KEY);
}

export function addHistory(city: string): string[] {
  const current = getHistory().filter((c) => c !== city);
  const next = [city, ...current].slice(0, MAX_ENTRIES);
  write(HISTORY_KEY, next);
  return next;
}
