import React from 'react';
import { SymbolData } from '@/lib/symbolData';
import { CATEGORY_MAP } from '@/lib/constants';

interface SymbolDetailProps {
  symbol: SymbolData | null;
  onClose: () => void;
}

const SymbolDetail: React.FC<SymbolDetailProps> = ({ symbol, onClose }) => {
  if (!symbol) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol.symbol);
    alert('符号已复制到剪贴板');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100">
        {/* 关闭按钮 */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6 pt-10">
          {/* 符号展示区域 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-4">
              <div className="text-5xl symbol-display">{symbol.symbol}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{symbol.name}</h2>
            {symbol.pronunciation && (
              <p className="text-gray-600 dark:text-gray-400">
                发音: {symbol.pronunciation}
              </p>
            )}
          </div>

          {/* 信息卡片区域 */}
          <div className="space-y-2">
            {/* 分类信息 */}
            <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">分类:</span>
                <div className="flex flex-wrap gap-2">
                  {symbol.category.map((cat, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {CATEGORY_MAP[cat] || cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Unicode 信息 */}
            {symbol.symbol.codePointAt(0) && (
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unicode:</span>
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    U+{symbol.symbol.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}
                  </span>
                </div>
              </div>
            )}

            {/* 说明信息 */}
            {symbol.notes && (
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">说明:</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{symbol.notes}</p>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCopy}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              复制符号
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetail;