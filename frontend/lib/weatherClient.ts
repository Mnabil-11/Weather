import type { WeatherData } from '@/backend/services/weatherService';

async function clientFetch<T>(url: string) {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Something went wrong.');
  return body as T;
}

export const weatherClient = {
  get: (query: string) => clientFetch<WeatherData>(`/api/weather?q=${encodeURIComponent(query)}`),
  search: (query: string) => clientFetch<Array<{ id: number; name: string; region: string; country: string }>>(`/api/locations?q=${encodeURIComponent(query)}`)
};
