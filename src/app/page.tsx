import { getSymbolData } from '@/lib/symbolData';
import HomeClient from '@/components/HomeClient';

// 启用 ISR，每10小时重新验证一次
export const revalidate = 36000;

export default async function Home() {
  const { symbols, stats } = await getSymbolData();

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={stats?.categoryStats || []} 
    />
  );
}
