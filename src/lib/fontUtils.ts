/**
 * 字体工具类 - 用于处理符号字体的显示和兼容性
 */

// 检测设备类型 - 避免 SSR 水合错误
export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isSafari = () => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// 获取适合当前设备的字体栈 - 避免 SSR 水合错误
export const getSymbolFontStack = (): string => {
  // 在服务端渲染期间返回通用字体栈
  if (typeof window === 'undefined') {
    return `
      'Noto Sans Symbols 2',
      'Noto Sans Symbols',
      'Noto Color Emoji',
      'Segoe UI Emoji',
      'Apple Color Emoji',
      system-ui,
      sans-serif
    `;
  }
  
  // 客户端渲染时根据设备返回优化的字体栈
  if (isIOS()) {
    return `
      'Apple Color Emoji',
      'Noto Sans Symbols 2',
      'Noto Sans Symbols',
      'Apple Symbols',
      system-ui,
      -apple-system,
      sans-serif
    `;
  }
  
  if (isAndroid()) {
    return `
      'Noto Color Emoji',
      'Noto Sans Symbols 2',
      'Noto Sans Symbols',
      'Roboto',
      sans-serif
    `;
  }
  
  // 默认桌面端字体栈
  return `
    'Noto Sans Symbols 2',
    'Noto Sans Symbols',
    'Noto Color Emoji',
    'Segoe UI Emoji',
    'Apple Color Emoji',
    'Symbola',
    'DejaVu Sans',
    'Arial Unicode MS',
    sans-serif
  `;
};

// 检测字体是否可用
export const isFontAvailable = (fontName: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return false;
  
  // 使用一个特殊字符进行测试
  const testChar = '⚡';
  const fallbackFont = 'monospace';
  
  context.font = `16px ${fallbackFont}`;
  const fallbackWidth = context.measureText(testChar).width;
  
  context.font = `16px ${fontName}, ${fallbackFont}`;
  const testWidth = context.measureText(testChar).width;
  
  return testWidth !== fallbackWidth;
};

// 动态应用字体样式
export const applySymbolFont = (element: HTMLElement): void => {
  if (!element) return;
  
  const fontStack = getSymbolFontStack();
  element.style.fontFamily = fontStack;
  element.style.fontWeight = 'normal';
  element.style.fontVariantNumeric = 'normal';
  element.style.textRendering = 'optimizeLegibility';
  
  // 使用类型断言来处理webkit属性
  const style = element.style as CSSStyleDeclaration & {
    webkitFontSmoothing?: string;
    webkitTextSizeAdjust?: string;
  };
  style.webkitFontSmoothing = 'antialiased';
  
  // iOS 特殊处理
  if (isIOS()) {
    style.webkitTextSizeAdjust = '100%';
    element.style.fontFeatureSettings = 'normal';
  }
};

// 字体加载状态检测
export const waitForFontsLoad = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }
  
  try {
    await document.fonts.ready;
    
    // 额外等待一小段时间确保字体完全加载
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    });
  } catch (error) {
    console.warn('Font loading detection failed:', error);
    return Promise.resolve();
  }
};

// 获取符号字体CSS类名 - 避免 SSR 水合错误
export const getSymbolClassName = (additionalClasses?: string): string => {
  const baseClass = 'symbol-display';
  
  // 在服务端渲染期间只返回基础类名
  if (typeof window === 'undefined') {
    return `${baseClass} ${additionalClasses || ''}`.trim();
  }
  
  // 客户端渲染时添加设备特定类名
  if (isIOS()) {
    return `${baseClass} ios-symbol ${additionalClasses || ''}`.trim();
  }
  
  if (isAndroid()) {
    return `${baseClass} android-symbol ${additionalClasses || ''}`.trim();
  }
  
  return `${baseClass} ${additionalClasses || ''}`.trim();
};

// 符号渲染优化
export const optimizeSymbolRendering = (): void => {
  if (typeof window === 'undefined') return;
  
  // 添加设备特定的CSS类
  const body = document.body;
  
  if (isIOS()) {
    body.classList.add('ios-device');
  } else if (isAndroid()) {
    body.classList.add('android-device');
  } else {
    body.classList.add('desktop-device');
  }
  
  // 添加Safari特定优化
  if (isSafari()) {
    body.classList.add('safari-browser');
  }
};