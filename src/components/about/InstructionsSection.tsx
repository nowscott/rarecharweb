import { aboutConfig } from '@/lib/aboutConfig';

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