'use client';

import { useCachedSymbolData } from '@/hooks/useCachedSymbolData';
import NavigationButtons from '@/components/NavigationButtons';
import { aboutConfig } from '@/lib/aboutConfig';
import { 
  useBackdoorClick, 
  clearCacheAndReload, 
  generateStats, 
  generateVersions 
} from '@/lib/aboutUtils';
import {
  HeroSection,
  FeaturesSection,
  InstructionsSection,
  VersionSection,
  ContactSection,
  ProjectsSection,
  FooterSection,
  LoadingState
} from '@/components/AboutComponents';

export default function About() {
  const { symbols: symbolData, categoryStats: symbolCategoryStats, version: symbolVersion, loading: symbolLoading } = useCachedSymbolData({ dataType: 'symbol' });
  const { symbols: emojiData, categoryStats: emojiCategoryStats, version: emojiVersion, loading: emojiLoading } = useCachedSymbolData({ dataType: 'emoji' });
  
  const loading = symbolLoading || emojiLoading;
  
  // 使用后门功能Hook
  const handleVersionClick = useBackdoorClick(clearCacheAndReload);
  
  // 生成统计数据和版本信息
  const stats = generateStats(symbolData, emojiData, symbolCategoryStats, emojiCategoryStats);
  const versions = generateVersions(symbolVersion, emojiVersion);
  
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航栏 */}
        <nav className="mb-6 sm:mb-8 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{aboutConfig.pageTitle}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{aboutConfig.pageDescription}</p>
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <NavigationButtons />
          </div>
        </nav>

        {/* Hero 区域 */}
        <HeroSection stats={stats} />

        {/* 第一排：产品特色和使用说明 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <FeaturesSection />
          <InstructionsSection />
        </div>

        {/* 第二排：版本信息和联系方式 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <VersionSection versions={versions} stats={stats} />
          <ContactSection />
        </div>

        {/* 第三排：我的其他作品 */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <ProjectsSection />
        </div>
        
        {/* 底部版权信息 */}
        <FooterSection onVersionClick={handleVersionClick} />
      </div>
    </div>
  );
}