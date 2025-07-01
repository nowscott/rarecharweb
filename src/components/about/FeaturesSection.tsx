import { aboutConfig, iconPaths } from '@/lib/aboutConfig';
import { Icon } from './Icon';

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