import type { WeatherData } from '@/backend/services/weatherService';

export type WeatherTheme =
  | 'clear-day' | 'clear-night'
  | 'cloudy-day' | 'cloudy-night'
  | 'rain-day' | 'rain-night'
  | 'snow' | 'storm';

/** Fallback used while weather data is loading or the theme is otherwise unknown. */
export const DEFAULT_THEME: WeatherTheme = 'clear-day';

export const backgroundGradients: Record<WeatherTheme, string> = {
  'clear-day': 'from-sky-400 via-blue-500 to-cyan-400',
  'clear-night': 'from-indigo-950 via-purple-950 to-slate-950',
  'cloudy-day': 'from-slate-300 via-slate-400 to-slate-500',
  'cloudy-night': 'from-slate-800 via-slate-900 to-slate-950',
  'rain-day': 'from-slate-400 via-slate-500 to-gray-600',
  'rain-night': 'from-slate-800 via-blue-950 to-slate-950',
  snow: 'from-sky-200 via-slate-300 to-slate-500',
  storm: 'from-slate-800 via-purple-950 to-slate-950'
};

/** Overlay strength keeps glass cards and text readable — brighter gradients need a darker scrim. */
export const overlayOpacity: Record<WeatherTheme, string> = {
  'clear-day': 'bg-black/30',
  'clear-night': 'bg-black/15',
  'cloudy-day': 'bg-black/25',
  'cloudy-night': 'bg-black/15',
  'rain-day': 'bg-black/25',
  'rain-night': 'bg-black/15',
  snow: 'bg-black/30',
  storm: 'bg-black/20'
};

const STORM_CODES = [1087, 1273, 1276, 1279, 1282];
const RAIN_CODES = [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246];
const SNOW_CODES = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225];

export function deriveWeatherTheme(data?: WeatherData): WeatherTheme {
  if (!data) return DEFAULT_THEME;
  const { code } = data.current.condition;
  const isDay = Boolean(data.current.is_day);
  if (STORM_CODES.includes(code)) return 'storm';
  if (SNOW_CODES.includes(code)) return 'snow';
  if (RAIN_CODES.includes(code)) return isDay ? 'rain-day' : 'rain-night';
  if (code !== 1000) return isDay ? 'cloudy-day' : 'cloudy-night';
  return isDay ? 'clear-day' : 'clear-night';
}
