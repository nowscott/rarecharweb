'use client';

import { useState } from 'react';
import { SymbolData } from '@/lib/core/types';
import SymbolCard from '@/components/SymbolCard';
import SymbolDetail from '@/components/SymbolDetail';

interface SymbolListProps {
  displayedSymbols: SymbolData[];
  searchQuery: string;
}

const SymbolList: React.FC<SymbolListProps> = ({
  displayedSymbols,
  searchQuery
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);

  return (
    <>
      {displayedSymbols.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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