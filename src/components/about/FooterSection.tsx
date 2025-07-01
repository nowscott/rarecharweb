import { aboutConfig } from '@/lib/aboutConfig';
import packageJson from '../../../package.json';

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