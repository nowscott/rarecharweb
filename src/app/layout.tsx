import type { Metadata } from 'next';
import "./globals.css";
import AppInitializer from '@/components/AppInitializer';
import FontHealthChecker from '@/components/FontHealthChecker';

export const metadata: Metadata = {
  title: "复制符 - 特殊符号查询工具",
  description: "快速查找和复制特殊符号，提供多种分类和搜索功能",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 外部字体CDN */}
        <link rel="stylesheet" href="https://f.0211120.xyz/font/Noto%20Sans%20Symbols%202/result.css" crossOrigin="anonymous" />
        {/* 移动端优化 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <AppInitializer>
          {children}
        </AppInitializer>
        <FontHealthChecker />
      </body>
    </html>
  );
}
