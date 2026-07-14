/** Server-only integration with WeatherAPI.com. Keep the API key out of browser code. */
import { requireEnv } from '../env';

const BASE_URL = 'https://api.weatherapi.com/v1';

const AUTH_ERROR_CODES = new Set([1002, 2006, 2007, 2008]);

async function request<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({ key: requireEnv('WEATHER_API_KEY', 'https://www.weatherapi.com/my/'), ...params }).toString();
  const response = await fetch(url, { next: { revalidate: 600 } });
  const body = await response.json();
  if (!response.ok || body.error) {
    if (AUTH_ERROR_CODES.has(body.error?.code)) {
      throw new Error(`Weather service configuration issue (${body.error.message}). Check WEATHER_API_KEY in .env.local against your key at https://www.weatherapi.com/my/.`);
    }
    throw new Error(body.error?.message || 'Unable to retrieve weather right now.');
  }
  return body as T;
}

export interface WeatherData {
  location: { name: string; region: string; country: string; localtime: string };
  current: { temp_c: number; temp_f: number; feelslike_c: number; feelslike_f: number; humidity: number; wind_kph: number; wind_mph: number; wind_dir: string; uv: number; is_day: number; condition: { text: string; code: number } };
  forecast: { forecastday: Array<{ date: string; day: { maxtemp_c: number; maxtemp_f: number; mintemp_c: number; mintemp_f: number; daily_chance_of_rain: number; condition: { text: string; code: number } } }> };
}

export function getWeather(query: string) {
  return request<WeatherData>('/forecast.json', { q: query, days: '5', aqi: 'no', alerts: 'no' });
}

export function searchLocations(query: string) {
  return request<Array<{ id: number; name: string; region: string; country: string }>>('/search.json', { q: query });
}
