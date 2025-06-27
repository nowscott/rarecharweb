import Image from 'next/image';
import { aboutConfig, iconPaths } from '@/lib/aboutConfig';
import { AboutStats, AboutVersions, formatUpdateTime } from '@/lib/aboutUtils';
import packageJson from '../../package.json';

// 图标组件
interface IconProps {
  name: keyof typeof iconPaths;
  className?: string;
}

function Icon({ name, className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[name]} />
    </svg>
  );
}

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
            <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{stat.count}</div>
            <div className="text-sm sm:text-base opacity-90 font-medium">{stat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 产品特色组件
export function FeaturesSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">产品特色</h3>
      <div className="space-y-3 sm:space-y-4">
        {aboutConfig.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 sm:space-x-4">
            <div className={`${feature.bgColor} p-2 rounded-lg flex-shrink-0`}>
              <Icon name={feature.icon as keyof typeof iconPaths} className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor}`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 使用说明组件
export function InstructionsSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">使用说明</h3>
      <div className="space-y-3 sm:space-y-4">
        {aboutConfig.instructions.map((instruction, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{instruction}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 版本信息组件
interface VersionSectionProps {
  versions: AboutVersions;
  stats: AboutStats;
}

export function VersionSection({ versions, stats }: VersionSectionProps) {
  const labels = aboutConfig.versionLabels;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">版本信息</h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{labels.dataVersion}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{labels.symbolData}</span>
              <span className="font-semibold text-xs sm:text-sm text-blue-600">{versions.symbol}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{labels.emojiData}</span>
              <span className="font-semibold text-xs sm:text-sm text-purple-600">{versions.emoji}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{labels.updateTime}</span>
          <span className="font-semibold text-sm sm:text-base">{formatUpdateTime()}</span>
        </div>
        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{labels.devStatus}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">{labels.devStatusValue}</span>
        </div>
        <div className="flex justify-between items-center py-2 sm:py-3">
          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{labels.totalSymbols}</span>
          <span className="font-semibold text-sm sm:text-base">{stats.totalSymbols}+</span>
        </div>
      </div>
    </div>
  );
}

// 联系方式组件
export function ContactSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">联系我们</h3>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {aboutConfig.contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.url}
            target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={contact.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation active:scale-95"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center ${contact.bgColor} flex-shrink-0`}>
              {contact.icon === 'github' ? (
                <Image 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/github.svg" 
                  alt="GitHub" 
                  width={24}
                  height={24}
                  className="filter invert dark:invert-0 sm:w-8 sm:h-8"
                />
              ) : contact.icon === 'xiaohongshu' ? (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d={iconPaths.xiaohongshu} />
                </svg>
              ) : (
                <Icon name="email" className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{contact.name}</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// 底部版权信息组件
interface FooterSectionProps {
  onVersionClick: () => void;
}

export function FooterSection({ onVersionClick }: FooterSectionProps) {
  return (
    <footer className="text-center py-6 sm:py-8 mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-2">
        <div 
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium cursor-pointer select-none transition-colors duration-200 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onVersionClick}
        >
          复制符 v{packageJson.version}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{aboutConfig.footer.copyright}</p>
        <div className="pt-2">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">{aboutConfig.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

// 加载状态组件
export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-lg text-gray-600 dark:text-gray-400">加载中...</div>
        </div>
      </div>
    </div>
  );
}