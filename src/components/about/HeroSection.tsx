import { aboutConfig } from '@/lib/aboutConfig';
import { AboutStats } from '@/lib/aboutUtils';

// Hero区域组件
interface HeroSectionProps {
  stats: AboutStats;
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white text-center">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{aboutConfig.hero.title}</h2>
        <p className="text-base sm:text-lg opacity-90">{aboutConfig.hero.subtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 sm:flex sm:justify-center gap-6 sm:gap-8">
        {stats.categoryStats.slice(0, aboutConfig.hero.displayCount).map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{stat.count}</div>
            <div className="text-sm sm:text-base opacity-90 font-medium">{stat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}