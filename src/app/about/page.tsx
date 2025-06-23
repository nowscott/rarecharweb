'use client';
import { useRouter } from 'next/navigation';
import useSymbolData from '@/hooks/useSymbolData';

export default function About() {
  const router = useRouter();
  const { symbols, dynamicCategories, loading } = useSymbolData();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航栏 */}
        <nav className="mb-8 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">关于</h1>
            <p className="text-gray-600 dark:text-gray-400">了解复制符应用详情</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>检索</span>
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>关于</span>
            </button>
          </div>
        </nav>

        {/* Hero 区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 mb-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">复制符</h2>
          <p className="text-xl mb-6 opacity-90">专为快速查找特殊符号而设计的便捷工具</p>
          <div className="flex justify-center space-x-8 text-sm">
            {loading ? (
              <div className="text-lg opacity-80">加载中...</div>
            ) : (
              dynamicCategories.slice(0, 4).map((category) => (
                <div key={category.id}>
                  <div className="text-2xl font-bold">{category.count}</div>
                  <div className="opacity-80">{category.name}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 第一排：产品特色和使用说明 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 产品特色 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">产品特色</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">智能搜索</h4>
                  <p className="text-gray-600 dark:text-gray-400">支持拼音检索，快速找到所需符号</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">分类管理</h4>
                  <p className="text-gray-600 dark:text-gray-400">多种类型符号，井然有序</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">一键复制</h4>
                  <p className="text-gray-600 dark:text-gray-400">点击即可复制到剪贴板</p>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">使用说明</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-gray-700 dark:text-gray-300">在搜索框输入关键词或拼音</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-gray-700 dark:text-gray-300">浏览分类或搜索结果</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-gray-700 dark:text-gray-300">点击符号卡片查看详情</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="text-gray-700 dark:text-gray-300">点击复制按钮获取符号</span>
              </div>
            </div>
          </div>
        </div>

        {/* 第二排：版本信息和联系方式 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 版本信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">版本信息</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">当前版本</span>
                <span className="font-semibold text-blue-600">v1.5.8-beta</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">更新时间</span>
                <span className="font-semibold">{new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">开发状态</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">开发中</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">符号总数</span>
                <span className="font-semibold">{loading ? '加载中...' : `${symbols.length}+`}</span>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">联系我们</h3>
            <div className="grid grid-cols-1 gap-4">
              <a href="#" className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">小红书</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">关注我们的最新动态</p>
                </div>
              </a>
              <a href="#" className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">GitHub</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">查看开源代码</p>
                </div>
              </a>
              <a href="#" className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">邮箱反馈</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">意见建议与问题反馈</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* 底部版权信息 */}
        <footer className="text-center py-8 mt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">© 2025 NowScott</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">辽ICP备2024046252号-2X</p>
            <div className="pt-2">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">⚠️ 部分内容由AI生成，如有错误请联系我们</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}