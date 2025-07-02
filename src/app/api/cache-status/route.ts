import { getCacheStatus } from '@/lib/cache/globalCache';

export async function GET() {
  try {
    const status = getCacheStatus();
    return Response.json({
      // 使用 Date.now() 获取当前时间戳
      currentTime: Date.now(),
      ...status
    });
  } catch (error) {
    console.error('Cache status API error:', error);
    return Response.json({ error: 'Failed to get cache status' }, { status: 500 });
  }
}