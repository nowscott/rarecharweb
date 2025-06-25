/**
 * 字体工具类 - 用于处理符号字体的显示和兼容性
 * 
 * 功能包括:
 * - 跨平台字体栈优化
 * - 设备类型检测
 * - 字体加载状态管理
 * - 符号渲染优化
 */

// 字体栈配置类型
type FontStack = {
  primary: string[];
  fallback: string[];
};

// 设备类型枚举
export enum DeviceType {
  IOS = 'ios',
  ANDROID = 'android',
  DESKTOP = 'desktop',
  UNKNOWN = 'unknown'
}

// 字体配置常量 - 优化后的系统字体优先策略
const FONT_STACKS: Record<DeviceType, FontStack> = {
  [DeviceType.IOS]: {
    primary: ['Apple Color Emoji', 'Apple Symbols', 'Noto Sans Symbols 2'],
    fallback: ['Noto Color Emoji', 'Segoe UI Emoji', 'Symbola', 'system-ui', '-apple-system', 'sans-serif']
  },
  [DeviceType.ANDROID]: {
    primary: ['Noto Color Emoji', 'Noto Sans Symbols 2', 'Roboto'],
    fallback: ['Apple Color Emoji', 'Segoe UI Emoji', 'Symbola', 'DejaVu Sans', 'sans-serif']
  },
  [DeviceType.DESKTOP]: {
    primary: ['Apple Color Emoji', 'Segoe UI Emoji', 'Noto Sans Symbols 2'],
    fallback: ['Noto Color Emoji', 'Twemoji Mozilla', 'Apple Symbols', 'Segoe UI Symbol', 'Symbola', 'DejaVu Sans', 'Arial Unicode MS', 'sans-serif']
  },
  [DeviceType.UNKNOWN]: {
    primary: ['Apple Color Emoji', 'Segoe UI Emoji', 'Noto Sans Symbols 2'],
    fallback: ['Noto Color Emoji', 'Twemoji Mozilla', 'Symbola', 'system-ui', 'sans-serif']
  }
};

// 检测设备类型 - 避免 SSR 水合错误
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// 获取当前设备类型
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return DeviceType.UNKNOWN;
  
  if (isIOS()) return DeviceType.IOS;
  if (isAndroid()) return DeviceType.ANDROID;
  return DeviceType.DESKTOP;
};

// 构建字体栈字符串
const buildFontStack = (fontStack: FontStack): string => {
  const allFonts = [...fontStack.primary, ...fontStack.fallback];
  return allFonts.map(font => `'${font}'`).join(', ');
};

// 获取适合当前设备的字体栈 - 避免 SSR 水合错误
export const getSymbolFontStack = (): string => {
  const deviceType = getDeviceType();
  const fontStack = FONT_STACKS[deviceType];
  return buildFontStack(fontStack);
};

// 获取特定设备类型的字体栈（用于测试或特殊需求）
export const getSymbolFontStackForDevice = (deviceType: DeviceType): string => {
  const fontStack = FONT_STACKS[deviceType];
  return buildFontStack(fontStack);
};

// 检测字体是否可用 - 改进的检测方法
export const isFontAvailable = (fontName: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // 优先使用Font Loading API
    if ('fonts' in document && document.fonts.check) {
      return document.fonts.check(`16px "${fontName}"`);
    }
    
    // 回退到canvas检测方法
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return false;
    
    // 使用多个测试字符提高准确性
    const testChars = ['⚡', '🎉', '★', '♠'];
    const fallbackFont = 'monospace';
    let hasMatch = false;
    
    for (const testChar of testChars) {
      context.font = `16px ${fallbackFont}`;
      const fallbackWidth = context.measureText(testChar).width;
      
      context.font = `16px "${fontName}", ${fallbackFont}`;
      const testWidth = context.measureText(testChar).width;
      
      if (testWidth !== fallbackWidth) {
        hasMatch = true;
        break;
      }
    }
    
    return hasMatch;
  } catch (error) {
    console.warn(`Font availability check failed for ${fontName}:`, error);
    return false;
  }
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

// 字体加载状态检测和性能监控
let fontLoadStartTime: number | null = null;

export const waitForFontsLoad = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }
  
  try {
    fontLoadStartTime = performance.now();
    await document.fonts.ready;
    
    // 记录字体加载时间
    if (fontLoadStartTime) {
      const loadTime = performance.now() - fontLoadStartTime;
      console.debug(`Fonts loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // 额外等待一小段时间确保字体完全加载
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    });
  } catch (error) {
    console.warn('Font loading detection failed:', error);
    return Promise.resolve();
  }
};

// 关键字体预加载列表
const CRITICAL_FONTS = [
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Noto Color Emoji',
  'Noto Sans Symbols 2'
];

// 预加载关键字体 - 优化的预加载策略
export const preloadCriticalFonts = (): void => {
  if (typeof window === 'undefined') return;
  
  const deviceType = getDeviceType();
  const fontStack = FONT_STACKS[deviceType];
  
  // 检查系统字体可用性，只预加载不可用的字体
  const systemFonts = ['Apple Color Emoji', 'Segoe UI Emoji', 'Apple Symbols', 'Segoe UI Symbol'];
  
  fontStack.primary.forEach(fontFamily => {
    // 系统字体无需预加载
    if (systemFonts.includes(fontFamily)) {
      console.debug(`System font detected, skipping preload: ${fontFamily}`);
      return;
    }
    
    // 检查字体是否已经可用
    if (isFontAvailable(fontFamily)) {
      console.debug(`Font already available, skipping preload: ${fontFamily}`);
      return;
    }
    
    console.debug(`Font not available, would need external loading: ${fontFamily}`);
  });
};

// 字体健康检查 - 诊断字体加载问题
export const checkFontHealth = (): Promise<{available: string[], unavailable: string[], recommendations: string[]}> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ available: [], unavailable: [], recommendations: ['Running in SSR mode'] });
      return;
    }
    
    const deviceType = getDeviceType();
    const fontStack = FONT_STACKS[deviceType];
    const allFonts = [...fontStack.primary, ...fontStack.fallback];
    
    const available: string[] = [];
    const unavailable: string[] = [];
    const recommendations: string[] = [];
    
    // 检查每个字体的可用性
    allFonts.forEach(fontName => {
      if (fontName === 'sans-serif' || fontName === 'system-ui' || fontName === '-apple-system') {
        available.push(fontName);
        return;
      }
      
      if (isFontAvailable(fontName)) {
        available.push(fontName);
      } else {
        unavailable.push(fontName);
      }
    });
    
    // 生成建议
    if (unavailable.length > 0) {
      recommendations.push(`${unavailable.length} fonts are not available on this system`);
    }
    
    if (available.length === 0) {
      recommendations.push('No emoji fonts detected - symbols may not display correctly');
    }
    
    if (deviceType === DeviceType.DESKTOP && !available.includes('Apple Color Emoji') && !available.includes('Segoe UI Emoji')) {
      recommendations.push('No system emoji fonts detected - consider installing system updates');
    }
    
    resolve({ available, unavailable, recommendations });
  });
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
  
  try {
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
    
    // 预加载关键字体
    preloadCriticalFonts();
    
    console.debug('Symbol rendering optimization applied for:', getDeviceType());
  } catch (error) {
    console.error('Failed to optimize symbol rendering:', error);
  }
};

// 调试工具：获取当前字体配置信息
export const getFontDebugInfo = async () => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'server',
      fontStack: 'SSR mode',
      userAgent: 'N/A',
      fontHealth: { available: [], unavailable: [], recommendations: ['SSR mode'] }
    };
  }
  
  const deviceType = getDeviceType();
  const fontStack = getSymbolFontStack();
  const fontHealth = await checkFontHealth();
  
  return {
    deviceType,
    fontStack,
    userAgent: navigator.userAgent,
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isSafari: isSafari(),
    fontsSupported: 'fonts' in document,
    fontLoadingAPISupported: 'fonts' in document && 'check' in document.fonts,
    fontHealth,
    timestamp: new Date().toISOString()
  };
};

// checkFontHealth函数已在上面直接导出，无需重复导出

// 导出类型定义
export type { FontStack };