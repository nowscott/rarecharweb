'use client';

import { useState, useEffect } from 'react';
import { getFontDebugInfo } from '@/lib/fontUtils';

interface FontHealthData {
  available: string[];
  unavailable: string[];
  recommendations: string[];
}

interface DebugInfo {
  deviceType: string;
  fontStack: string;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  fontsSupported: boolean;
  fontLoadingAPISupported: boolean;
  fontHealth: FontHealthData;
  timestamp: string;
}

export default function FontHealthChecker() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const info = await getFontDebugInfo();
      setDebugInfo(info as DebugInfo);
    } catch (error) {
      console.error('Font health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 自动运行一次健康检查
    runHealthCheck();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg transition-colors"
        title="字体健康检查"
      >
        🔍 字体诊断
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">字体健康检查</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={runHealthCheck}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          {isLoading ? '检查中...' : '重新检查'}
        </button>

        {debugInfo && (
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">设备信息</h4>
              <div className="text-gray-600 dark:text-gray-300 space-y-1">
                <p>设备类型: {debugInfo.deviceType}</p>
                <p>浏览器: {debugInfo.isSafari ? 'Safari' : debugInfo.isIOS ? 'iOS浏览器' : debugInfo.isAndroid ? 'Android浏览器' : '桌面浏览器'}</p>
                <p>字体API支持: {debugInfo.fontLoadingAPISupported ? '✅' : '❌'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">可用字体 ({debugInfo.fontHealth.available.length})</h4>
              <div className="text-gray-600 dark:text-gray-300 max-h-20 overflow-y-auto">
                {debugInfo.fontHealth.available.length > 0 ? (
                  <ul className="text-xs space-y-0.5">
                    {debugInfo.fontHealth.available.map((font, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-1">✅</span>
                        {font}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-500">无可用字体</p>
                )}
              </div>
            </div>

            {debugInfo.fontHealth.unavailable.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">不可用字体 ({debugInfo.fontHealth.unavailable.length})</h4>
                <div className="text-gray-600 dark:text-gray-300 max-h-20 overflow-y-auto">
                  <ul className="text-xs space-y-0.5">
                    {debugInfo.fontHealth.unavailable.map((font, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-red-500 mr-1">❌</span>
                        {font}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {debugInfo.fontHealth.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">建议</h4>
                <div className="text-gray-600 dark:text-gray-300">
                  <ul className="text-xs space-y-1">
                    {debugInfo.fontHealth.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-1 mt-0.5">💡</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                检查时间: {new Date(debugInfo.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}