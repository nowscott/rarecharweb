import { getSymbolData } from '@/lib/cache/globalCache';

export async function GET() {
  try {
    const data = await getSymbolData();
    if (!data) {
      return Response.json({ error: 'No symbols data available' }, { status: 503 });
    }
    return Response.json(data);
  } catch (error) {
    console.error('Symbols API route error:', error);
    return Response.json({ error: 'Failed to fetch symbols data' }, { status: 500 });
  }
}