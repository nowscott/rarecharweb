import { useState } from 'react';
import { SymbolData } from '@/lib/symbolData';
import { FEATURED_SYMBOLS } from '@/lib/constants';
import SymbolCard from '@/components/SymbolCard';
import SymbolDetail from '@/components/SymbolDetail';

interface SymbolListProps {
  displayedSymbols: SymbolData[];
  searchQuery: string;
  activeCategory: string;
  showFeatured?: boolean;
}

const SymbolList: React.FC<SymbolListProps> = ({
  displayedSymbols,
  searchQuery,
  activeCategory,
  showFeatured = true
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);

  return (
    <>
      {displayedSymbols.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedSymbols.map((symbol, index) => (
              <SymbolCard 
                key={`${symbol.symbol}-${index}`} 
                symbol={symbol} 
                onClick={() => setSelectedSymbol(symbol)} 
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? '没有找到匹配的符号' : '没有符号可显示'}
          </p>
        </div>
      )}

      {/* 如果没有搜索且在全部分类，显示推荐符号 */}
      {!searchQuery && activeCategory === 'all' && displayedSymbols.length === 0 && showFeatured && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">常用符号</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {FEATURED_SYMBOLS.map((symbol, index) => (
              <SymbolCard key={index} symbol={symbol} />
            ))}
          </div>
        </div>
      )}

      {selectedSymbol && (
        <SymbolDetail 
          symbol={selectedSymbol} 
          onClose={() => setSelectedSymbol(null)} 
        />
      )}
    </>
  );
};

export default SymbolList;