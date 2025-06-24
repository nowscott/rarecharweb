import { getSymbolData } from '@/lib/symbolData';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const { symbols, stats } = await getSymbolData();

  return (
    <HomeClient 
      symbols={symbols} 
      categoryStats={stats?.categoryStats || []} 
    />
  );
}
