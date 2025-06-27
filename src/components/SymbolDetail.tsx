import React, { useState, useEffect, useRef } from 'react';
import { SymbolData } from '@/lib/types';
import { getSymbolClassName, applySymbolFont } from '@/lib/fontUtils';

interface SymbolDetailProps {
  symbol: SymbolData | null;
  onClose: () => void;
}

const SymbolDetail: React.FC<SymbolDetailProps> = ({ symbol, onClose }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const symbolRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
    if (symbolRef.current && symbol) {
      applySymbolFont(symbolRef.current);
    }
  }, [symbol]);

  // 禁用页面滚动
  useEffect(() => {
    if (symbol) {
      // 保存当前的overflow样式
      const originalOverflow = document.body.style.overflow;
      // 禁用滚动
      document.body.style.overflow = 'hidden';
      
      // 清理函数：恢复滚动
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [symbol]);
  
  if (!symbol) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol.symbol);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
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
        <div className="p-6 pt-16">
          {/* 符号展示区域 */}
          <div className="text-center mb-6">
            <div 
              ref={symbolRef}
              className={`text-6xl mb-4 ${isClient ? getSymbolClassName('symbol-large symbol-center symbol-no-select') : 'symbol-display symbol-large symbol-center symbol-no-select'}`}
            >
              {symbol.symbol}
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
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Unicode 信息 */}
            {symbol.symbol && (
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unicode:</span>
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    {Array.from(symbol.symbol).map((char) => {
                      const codePoint = char.codePointAt(0);
                      return codePoint ? `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}` : '';
                    }).filter(Boolean).join(' ')}
                  </span>
                </div>
              </div>
            )}

            {/* 说明信息 */}
            {symbol.notes && (
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">说明:</h3>
                <div className="relative">
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-h-32 overflow-y-auto scrollbar-thin pr-2">
                    {symbol.notes.split('\n').map((line, index) => (
                      <p key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                  {/* 滚动提示渐变 */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50/80 to-transparent dark:from-gray-700/50 pointer-events-none rounded-b-xl" />
                  {/* 滚动指示器 */}
                  <div className="absolute top-1 right-1 text-gray-400 dark:text-gray-500 text-xs opacity-60">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex justify-center relative">
            <button
              onClick={handleCopy}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              复制符号
            </button>
            
            {/* 复制成功提示 */}
            {showCopySuccess && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-pulse">
                复制成功！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetail;