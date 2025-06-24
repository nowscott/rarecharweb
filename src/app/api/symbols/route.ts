import { NextResponse } from 'next/server';
import { getSymbolData } from '@/lib/globalCache';

export async function GET() {
  try {
    const data = await getSymbolData();
    if (!data) {
      return NextResponse.json({ error: 'No symbols data available' }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Symbols API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch symbols data' }, { status: 500 });
  }
}