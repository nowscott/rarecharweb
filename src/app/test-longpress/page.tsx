'use client';

import React from 'react';
import SymbolCard from '@/components/SymbolCard';
import SymbolDetail from '@/components/SymbolDetail';
import { useState } from 'react';

const testSymbols = [
  { symbol: '★', name: '实心星星' },
  { symbol: '♥', name: '红心' },
  { symbol: '♦', name: '方块' },
  { symbol: '♠', name: '黑桃' },
  { symbol: '♣', name: '梅花' },
  { symbol: '☀', name: '太阳' },
  { symbol: '☂', name: '雨伞' },
  { symbol: '☃', name: '雪人' },
  { symbol: '⚡', name: '闪电' },
  { symbol: '🎉', name: '庆祝' },
  { symbol: '🎊', name: '彩带球' },
  { symbol: '🎈', name: '气球' }
];

const testDetailSymbol = {
  symbol: '★',
  name: '实心星星',
  category: ['符号', '装饰'],
  pronunciation: 'xīng xīng',
  notes: '这是一个实心的五角星符号，常用于表示重要性、评级或装饰。在很多文化中，星星都象征着希望、梦想和指引。'
};

export default function TestLongPressPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            长按复制功能测试
          </h1>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              使用说明
            </h2>
            <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <p>• <strong>移动端：</strong>长按符号卡片或符号本身即可快速复制</p>
              <p>• <strong>桌面端：</strong>按住鼠标左键不放即可触发长按复制</p>
              <p>• <strong>进度条：</strong>长按时会显示绿色进度条，填满后自动复制</p>
              <p>• <strong>快速响应：</strong>400ms 即可触发复制，提升操作效率</p>
              <p>• <strong>传统方式：</strong>点击右上角的复制按钮仍然可用</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            符号卡片测试
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {testSymbols.map((symbol, index) => (
              <SymbolCard
                key={index}
                symbol={symbol}
                onClick={() => setSelectedSymbol(testDetailSymbol)}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            详情页面测试
          </h2>
          <div className="text-center">
            <button
              onClick={() => setSelectedSymbol(testDetailSymbol)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              打开符号详情页面
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            技术特性
          </h3>
          <div className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
            <p>• <strong>响应式设计：</strong>同时支持触摸和鼠标事件</p>
            <p>• <strong>极简视觉：</strong>仅显示绿色进度条，无多余动效</p>
            <p>• <strong>快速触发：</strong>400ms 长按时间，提升操作效率</p>
            <p>• <strong>智能防冲突：</strong>长按复制后短暂阻止详情页弹出</p>
            <p>• <strong>内存优化：</strong>自动清理定时器，避免内存泄漏</p>
          </div>
        </div>
      </div>

      {selectedSymbol && (
        <SymbolDetail
          symbol={selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </div>
  );
}