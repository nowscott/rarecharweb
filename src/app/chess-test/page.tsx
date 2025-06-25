'use client';

import { useState, useEffect } from 'react';

const ChessTestPage = () => {
  const [fontInfo, setFontInfo] = useState<string>('');
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  // 象棋符号 Unicode 范围 U+1FA60 到 U+1FA6D
  const chessSymbols = [
    { code: 0x1FA60, name: 'Chess Pawn', char: '🩠' },
    { code: 0x1FA61, name: 'Chess Knight', char: '🩡' },
    { code: 0x1FA62, name: 'Chess Bishop', char: '🩢' },
    { code: 0x1FA63, name: 'Chess Rook', char: '🩣' },
    { code: 0x1FA64, name: 'Chess Queen', char: '🩤' },
    { code: 0x1FA65, name: 'Chess King', char: '🩥' },
    { code: 0x1FA66, name: 'Chess Pawn (Black)', char: '🩦' },
    { code: 0x1FA67, name: 'Chess Knight (Black)', char: '🩧' },
    { code: 0x1FA68, name: 'Chess Bishop (Black)', char: '🩨' },
    { code: 0x1FA69, name: 'Chess Rook (Black)', char: '🩩' },
    { code: 0x1FA6A, name: 'Chess Queen (Black)', char: '🩪' },
    { code: 0x1FA6B, name: 'Chess King (Black)', char: '🩫' },
    { code: 0x1FA6C, name: 'Chess Board', char: '🩬' },
    { code: 0x1FA6D, name: 'Chess Clock', char: '🩭' }
  ];

  useEffect(() => {
    // 检查字体加载状态
    const checkFontLoad = async () => {
      if ('fonts' in document) {
        try {
          await document.fonts.load('16px "Noto Sans Symbols 2"');
          setFontLoaded(true);
        } catch (error) {
          console.warn('Noto Sans Symbols 2 font failed to load:', error);
          setFontLoaded(false);
        }
      }
    };

    checkFontLoad();

    // 获取字体信息
    const testElement = document.querySelector('.chess-symbol');
    if (testElement) {
      const computedStyle = window.getComputedStyle(testElement);
      setFontInfo(computedStyle.fontFamily);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">象棋符号字体测试</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">字体加载状态:</h2>
        <p className={`text-sm mb-2 ${fontLoaded ? 'text-green-600' : 'text-red-600'}`}>
          Noto Sans Symbols 2: {fontLoaded ? '✅ 已加载' : '❌ 未加载'}
        </p>
        <h3 className="text-sm font-semibold mb-1">当前字体配置:</h3>
        <p className="text-xs text-gray-600 break-all">{fontInfo}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {chessSymbols.map((symbol) => {
          const unicodeStr = `U+${symbol.code.toString(16).toUpperCase().padStart(4, '0')}`;
          
          return (
            <div key={symbol.code} className="border rounded-lg p-4 text-center">
              <div className="chess-symbol text-6xl mb-2" style={{fontFamily: '"Noto Sans Symbols 2", "Apple Symbols", "Segoe UI Symbol", "Symbola", monospace'}}>
                {symbol.char}
              </div>
              <div className="text-sm font-mono text-gray-600">{unicodeStr}</div>
              <div className="text-xs text-gray-500 mt-1">{symbol.name}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">测试说明</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 如果看到正确的象棋符号，说明字体配置成功</li>
          <li>• 如果看到方框或问号，说明字体不支持这些字符</li>
          <li>• Unicode 范围: U+1FA60 到 U+1FA6D (Symbols and Pictographs Extended-A)</li>
          <li>• 支持字体: Noto Sans Symbols 2 (本地字体文件 + 外部CDN)</li>
          <li>• 备用字体: Apple Symbols, Segoe UI Symbol, Symbola</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">备用测试 (传统象棋符号)</h3>
        <div className="text-4xl space-x-4">
          <span title="白王 U+2654">♔</span>
          <span title="白后 U+2655">♕</span>
          <span title="白车 U+2656">♖</span>
          <span title="白象 U+2657">♗</span>
          <span title="白马 U+2658">♘</span>
          <span title="白兵 U+2659">♙</span>
          <span title="黑王 U+265A">♚</span>
          <span title="黑后 U+265B">♛</span>
          <span title="黑车 U+265C">♜</span>
          <span title="黑象 U+265D">♝</span>
          <span title="黑马 U+265E">♞</span>
          <span title="黑兵 U+265F">♟</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">这些是传统的象棋符号 (U+2654-U+265F)，应该在大多数系统上正常显示</p>
      </div>
    </div>
  );
};

export default ChessTestPage;