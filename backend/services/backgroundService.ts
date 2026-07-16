/** Server-only integration with the Unsplash API. Keep the access key out of browser code. */
import { requireEnv } from '../env';
import type { WeatherTheme } from '@/shared/weatherTheme';

export type { WeatherTheme };

const SEARCH_QUERIES: Record<WeatherTheme, string> = {
  'clear-day': 'sunny blue sky landscape',
  'clear-night': 'starry night sky moon',
  'cloudy-day': 'cloudy overcast sky',
  'cloudy-night': 'cloudy night sky city',
  'rain-day': 'rain wet street umbrella',
  'rain-night': 'rain night city lights',
  snow: 'snow mountains winter',
  storm: 'lightning storm dramatic sky'
};

interface UnsplashSearchResponse { results: Array<{ urls: { regular: string; full: string; small: string } }> }
interface CacheEntry { url: string | null; expiresAt: number }

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<WeatherTheme, CacheEntry>();

export async function getBackgroundImage(theme: WeatherTheme): Promise<string | null> {
  const cached = cache.get(theme);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  // Not configured yet: no network call was made, so don't cache — the key may be added any moment.
  if (!process.env.UNSPLASH_ACCESS_KEY) return null;

  try {
    const accessKey = requireEnv('UNSPLASH_ACCESS_KEY', 'https://unsplash.com/developers');
    const url = new URL('https://api.unsplash.com/search/photos');
    url.search = new URLSearchParams({ query: SEARCH_QUERIES[theme], per_page: '1', orientation: 'landscape' }).toString();
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: CACHE_TTL_MS / 1000 }
    });
    if (!response.ok) throw new Error(`Unsplash request failed (${response.status})`);
    const body: UnsplashSearchResponse = await response.json();
    const imageUrl: string | null = body.results?.[0]?.urls?.regular ?? null;
    cache.set(theme, { url: imageUrl, expiresAt: Date.now() + CACHE_TTL_MS });
    return imageUrl;
  } catch {
    // No key configured, rate-limited, or network failure — caller falls back to the CSS gradient.
    cache.set(theme, { url: null, expiresAt: Date.now() + CACHE_TTL_MS });
    return null;
  }
}
