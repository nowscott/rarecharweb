import { NextResponse } from 'next/server';
import { getEmojiData } from '@/lib/globalCache';

export async function GET() {
  try {
    const data = await getEmojiData();
    if (!data) {
      return NextResponse.json({ error: 'No emoji data available' }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Emoji API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch emoji data' }, { status: 500 });
  }
}