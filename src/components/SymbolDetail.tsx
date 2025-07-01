import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { SymbolData } from '@/lib/types';
import { getSymbolClassName, applySymbolFont } from '@/lib/fontUtils';

interface SymbolDetailProps {
  symbol: SymbolData | null;
  onClose: () => void;
}

const SymbolDetail: React.FC<SymbolDetailProps> = ({ symbol, onClose }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showScrollGradient, setShowScrollGradient] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const preventClickRef = useRef(false);
  const symbolRef = useRef<HTMLDivElement>(null);
  const notesContentRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // 检测说明内容是否需要滚动
  useEffect(() => {
    if (notesContentRef.current && symbol?.notes) {
      const element = notesContentRef.current;
      const hasOverflow = element.scrollHeight > element.clientHeight;
      
      if (hasOverflow) {
        const handleScroll = () => {
          const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
          setShowScrollGradient(!isAtBottom);
        };
        
        // 初始设置
        setShowScrollGradient(true);
        
        // 添加滚动事件监听器
        element.addEventListener('scroll', handleScroll);
        
        // 清理函数
        return () => {
          element.removeEventListener('scroll', handleScroll);
        };
      } else {
        setShowScrollGradient(false);
      }
    } else {
      setShowScrollGradient(false);
    }
  }, [symbol?.notes]);
  
  if (!symbol) return null;

  const handleCopy = useCallback(() => {
    if (!symbol) return;
    navigator.clipboard.writeText(symbol.symbol);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  }, [symbol]);

  // 使用 @use-gesture 的 useGesture hook 实现长按功能
  const bind = useGesture(
    {
      onDragStart: ({ event }) => {
        const startTime = Date.now();
        const duration = 800; // 800ms 长按阈值
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
            <div className="relative inline-block">
              <div 
                ref={symbolRef}
                {...bind()}
                className={`text-6xl mb-4 cursor-pointer select-none transition-transform duration-200 ${
                   isClient ? getSymbolClassName('symbol-large symbol-center symbol-no-select') : 'symbol-display symbol-large symbol-center symbol-no-select'
                 } hover:scale-105`}
                style={{ touchAction: 'none' }}
                title="长按复制符号"
              >
                {symbol.symbol}
              </div>
              
              {/* 圆形进度条 */}
              {isLongPressing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* 背景圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-200 dark:text-gray-600"
                    />
                    {/* 进度圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - longPressProgress / 100)}`}
                      className="transition-all duration-75 ease-linear"
                    />
                  </svg>
                </div>
              )}
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
            <div className="bg-gray-100/90 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/30">
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
              <div className="bg-gray-100/90 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/30">
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
              <div className="bg-gray-100/90 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/30">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">说明:</h3>
                <div className="relative">
                  <div 
                    ref={notesContentRef}
                    className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-h-32 overflow-y-auto scrollbar-thin pl-2 pr-1"
                  >
                    {symbol.notes.split('\n').map((line, index) => (
                      <p key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                  {/* 滚动提示渐变 - 仅在内容溢出时显示 */}
                  {showScrollGradient && (
                    <div className="absolute bottom-0 left-2 right-1 h-6 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent dark:from-gray-700/50 dark:via-gray-700/70 dark:to-transparent pointer-events-none" />
                  )}

                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex justify-center relative">
            <button
              onClick={handleCopy}
              className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                showCopySuccess ? 'bg-gradient-to-r from-green-500 to-green-600' : ''
              }`}
            >
              {showCopySuccess ? (
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>复制成功！</span>
                </div>
              ) : (
                '复制符号'
              )}
            </button>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetail;