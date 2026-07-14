import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/backend/services/weatherService';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  if (!query) return NextResponse.json({ message: 'A location is required.' }, { status: 400 });
  try { return NextResponse.json(await getWeather(query)); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to retrieve weather.' }, { status: 502 }); }
}
