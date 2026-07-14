import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/backend/services/weatherService';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  if (!query || query.length < 2) return NextResponse.json([]);
  try { return NextResponse.json(await searchLocations(query)); }
  catch { return NextResponse.json([]); }
}
