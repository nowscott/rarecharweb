import { getEmojiData } from '@/lib/globalCache';

export async function GET() {
  try {
    const data = await getEmojiData();
    if (!data) {
      return Response.json({ error: 'No emoji data available' }, { status: 503 });
    }
    return Response.json(data);
  } catch (error) {
    console.error('Emoji API route error:', error);
    return Response.json({ error: 'Failed to fetch emoji data' }, { status: 500 });
  }
}