import type { WeatherData } from '@/backend/services/weatherService';

export type WeatherTheme = 'clear' | 'cloudy' | 'rain' | 'snow' | 'night' | 'storm';

export const backgroundGradients: Record<WeatherTheme, string> = {
  clear: 'from-sky-500 via-blue-600 to-indigo-900',
  cloudy: 'from-slate-500 via-slate-700 to-slate-950',
  rain: 'from-slate-700 via-blue-950 to-slate-950',
  snow: 'from-sky-300 via-slate-500 to-slate-800',
  night: 'from-slate-950 via-indigo-950 to-slate-900',
  storm: 'from-slate-800 via-purple-950 to-slate-950'
};

export function deriveWeatherTheme(data?: WeatherData): WeatherTheme {
  if (!data) return 'clear';
  const { code } = data.current.condition;
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'storm';
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'rain';
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) return 'snow';
  if (!data.current.is_day) return 'night';
  if (code !== 1000) return 'cloudy';
  return 'clear';
}
