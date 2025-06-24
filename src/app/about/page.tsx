'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SymbolDataResponse, CategoryStat } from '@/lib/types';

function NavigationButtons() {
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => router.push('/')}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        <span className="hidden sm:inline sm:ml-2">符号</span>
      </button>
      <button 
        onClick={() => router.push('/emoji')}
        className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <span className="text-lg">😀</span>
        <span className="hidden sm:inline sm:ml-2">Emoji</span>
      </button>
      <button 
        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2 text-sm sm:text-base touch-manipulation active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline sm:ml-2">关于</span>
      </button>
    </>
  );
}

export default function About() {
  const [stats, setStats] = useState<{ totalSymbols: number; categoryStats: CategoryStat[] }>({ totalSymbols: 0, categoryStats: [] });
  const [version, setVersion] = useState('v1.0.0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/symbols');
        const data: SymbolDataResponse = await response.json();
        setStats(data.stats || { totalSymbols: 0, categoryStats: [] });
        setVersion(data.version || 'v1.0.0');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航栏 */}
        <nav className="mb-6 sm:mb-8 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">关于</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">了解复制符应用详情</p>
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <NavigationButtons />
          </div>
        </nav>

        {/* Hero 区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 text-white text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">复制符</h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 opacity-90">专为快速查找特殊符号而设计的便捷工具</p>
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-8 text-sm">
            {stats.categoryStats.slice(0, 4).map((stat, index) => (
              <div key={index}>
                <div className="text-xl sm:text-2xl font-bold">{stat.count}</div>
                <div className="opacity-80 text-xs sm:text-sm">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 第一排：产品特色和使用说明 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* 产品特色 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">产品特色</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">智能搜索</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">支持拼音检索，快速找到所需符号</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">分类管理</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">多种类型符号，井然有序</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">一键复制</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">点击即可复制到剪贴板</p>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">使用说明</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">在搜索框输入关键词或拼音</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">浏览分类或搜索结果</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">点击符号卡片查看详情</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">点击复制按钮获取符号</span>
              </div>
            </div>
          </div>
        </div>

        {/* 第二排：版本信息和联系方式 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* 版本信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">版本信息</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">数据版本</span>
                <span className="font-semibold text-sm sm:text-base text-blue-600">{version}</span>
              </div>
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">更新时间</span>
                <span className="font-semibold text-sm sm:text-base">{new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')}</span>
              </div>
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">开发状态</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">开发中</span>
              </div>
              <div className="flex justify-between items-center py-2 sm:py-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">符号总数</span>
                <span className="font-semibold text-sm sm:text-base">{stats.totalSymbols}+</span>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">联系我们</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <a href="https://www.xiaohongshu.com/user/profile/5d40f52f000000001101ba6c?xsec_token=YBExHFaolW_sm5IScluGnf76LQ9Y4yHv13pn_qnh3e0y0=&xsec_source=app_share&xhsshare=CopyLink&appuid=5d40f52f000000001101ba6c&apptime=1750673095&share_id=9e7f80f1b072439b9e9d2a2dc46ef1cc" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-red-500 flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5h2.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-2.25c-.621 0-1.125-.504-1.125-1.125v-.75c0-.621.504-1.125 1.125-1.125zm0 4.5h2.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-2.25c-.621 0-1.125-.504-1.125-1.125v-.75c0-.621.504-1.125 1.125-1.125z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">小红书</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">关注我们的最新动态</p>
                </div>
              </a>
              <a href="https://github.com/nowscott/rarecharweb" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-900 dark:bg-white flex-shrink-0">
                  <Image 
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/github.svg" 
                    alt="GitHub" 
                    width={24}
                    height={24}
                    className="filter invert dark:invert-0 sm:w-8 sm:h-8"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">GitHub</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">查看开源代码</p>
                </div>
              </a>
              <a href="mailto:nowscott@qq.com" className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation active:scale-95">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">邮箱反馈</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">意见建议与问题反馈</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* 底部版权信息 */}
        <footer className="text-center py-6 sm:py-8 mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">© 2025 NowScott</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">辽ICP备2024046252号-2X</p>
            <div className="pt-2">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">⚠️ 部分内容由AI生成，如有错误请联系我们</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}