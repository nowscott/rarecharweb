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
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">符号详情</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="text-6xl mb-2">{symbol.symbol}</div>
            <div className="text-lg font-medium">{symbol.name}</div>
            {symbol.pronunciation && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                发音: {symbol.pronunciation}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">分类:</div>
            <div className="flex flex-wrap gap-2">
              {symbol.category.map((cat, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                >
                  {CATEGORY_MAP[cat] || cat}
                </span>
              ))}
            </div>
          </div>
          
          {symbol.notes && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">说明:</div>
              <div className="text-sm whitespace-pre-wrap">{symbol.notes}</div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              复制符号
            </button>
          </div>
          
          {symbol.symbol.codePointAt(0) && (
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              Unicode: U+{symbol.symbol.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolDetail;