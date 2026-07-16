import { NextRequest, NextResponse } from 'next/server';
import { getBackgroundImage, WeatherTheme } from '@/backend/services/backgroundService';

const THEMES = new Set<WeatherTheme>(['clear-day', 'clear-night', 'cloudy-day', 'cloudy-night', 'rain-day', 'rain-night', 'snow', 'storm']);

export async function GET(request: NextRequest) {
  const condition = request.nextUrl.searchParams.get('condition');
  if (!condition || !THEMES.has(condition as WeatherTheme)) return NextResponse.json({ url: null });
  const url = await getBackgroundImage(condition as WeatherTheme);
  return NextResponse.json({ url });
}
