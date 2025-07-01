import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { SymbolData } from '@/lib/types';
import { getSymbolClassName, applySymbolFont } from '@/lib/fontUtils';

interface SymbolCardProps {
  symbol: SymbolData | {
    symbol: string;
    name: string;
  };
  onClick?: () => void;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, onClick }) => {
  const symbolRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preventClickRef = useRef(false);
  
  useEffect(() => {
    setIsClient(true);
    if (symbolRef.current) {
      applySymbolFont(symbolRef.current);
    }
  }, [symbol.symbol]);

  const handleCopy = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(symbol.symbol);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  }, [symbol.symbol]);

  // 使用 @use-gesture 的 useGesture hook
  const bind = useGesture(
    {
      onDragStart: ({ event }) => {
        const startTime = Date.now();
        const duration = 600; // 600ms 长按阈值
        const delayBeforeProgress = 200; // 200ms 后才开始显示进度条
        let cancelled = false;
        let progressStarted = false;
        
        const updateProgress = () => {
          if (cancelled) return;
          
          const elapsed = Date.now() - startTime;
          
          // 只有超过延迟时间才开始显示进度条
          if (elapsed >= delayBeforeProgress && !progressStarted) {
            setIsLongPressing(true);
            setLongPressProgress(0);
            progressStarted = true;
          }
          
          if (progressStarted) {
            const progressElapsed = elapsed - delayBeforeProgress;
            const adjustedDuration = duration - delayBeforeProgress;
            const progress = Math.min((progressElapsed / adjustedDuration) * 100, 100);
            setLongPressProgress(progress);
            
            if (progress >= 100) {
              // 长按完成，执行复制
              handleCopy();
              setIsLongPressing(false);
              setLongPressProgress(0);
              
              // 设置阻止点击标志
              preventClickRef.current = true;
              setTimeout(() => {
                preventClickRef.current = false;
              }, 100);
              return;
            }
          }
          
          if (elapsed < duration) {
            requestAnimationFrame(updateProgress);
          }
        };
        
        requestAnimationFrame(updateProgress);
        
        // 监听取消事件
        const cancelLongPress = () => {
          cancelled = true;
          if (progressStarted) {
            setIsLongPressing(false);
            setLongPressProgress(0);
          }
        };
        
        // 添加事件监听器
        const handlePointerUp = () => {
          if (Date.now() - startTime < duration) {
            cancelLongPress();
            // 如果是短按，触发点击事件
            if (!preventClickRef.current) {
              onClick?.();
            }
          }
          document.removeEventListener('pointerup', handlePointerUp);
          document.removeEventListener('pointercancel', cancelLongPress);
        };
        
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', cancelLongPress);
      }
    }
  );

  // 清理定时器
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (preventClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // 点击事件现在由 useLongPress 处理
  }, []);

  return (
    <div 
      {...bind()}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md active:shadow-lg transition-all duration-200 p-3 sm:p-4 flex flex-col items-center justify-center cursor-pointer border border-gray-100 dark:border-gray-700 h-28 sm:h-32 relative group touch-manipulation ${
         copySuccess ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''
       }`}
      style={{ touchAction: 'none' }}
    >
      {/* 圆形进度条 */}
      {isLongPressing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* 背景圆环 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-200 dark:text-gray-600"
            />
            {/* 进度圆环 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - longPressProgress / 100)}`}
              className="transition-all duration-75 ease-linear"
            />
          </svg>
        </div>
      )}



      <button
        onClick={handleCopy}
        className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 sm:opacity-0 touch-manipulation ${
          copySuccess 
            ? 'bg-green-500 hover:bg-green-600 scale-110' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
        }`}
        title="点击复制 / 长按快速复制"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
          copySuccess ? 'text-white' : 'text-gray-500 dark:text-gray-400'
        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {copySuccess ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          )}
        </svg>
      </button>
      <div 
        ref={symbolRef}
        className={`text-3xl sm:text-4xl mb-1 sm:mb-2 ${isClient ? getSymbolClassName('symbol-large symbol-center symbol-no-select') : 'symbol-display symbol-large symbol-center symbol-no-select'}`}
      >
        {symbol.symbol}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center leading-tight">{symbol.name}</div>
    </div>
  );
};

export default SymbolCard;