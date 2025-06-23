// 符号分类
export const SYMBOL_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'entertainment', name: '娱乐' },
  { id: 'japanese', name: '日语' },
  { id: 'angle', name: '角标' },
  { id: 'korean', name: '韩语' },
  { id: 'number', name: '数字' },
  { id: 'currency', name: '货币' },
  { id: 'music', name: '音乐' },
  { id: 'math', name: '数学' },
  { id: 'other', name: '其他' },
];

// 映射英文分类到中文分类
export const CATEGORY_MAP: Record<string, string> = {
  'entertainment': '娱乐',
  'japanese': '日语',
  'angle': '角标',
  'korean': '韩语',
  'number': '数字',
  'currency': '货币',
  'music': '音乐',
  'math': '数学',
  'other': '其他',
};

// 常用符号示例
export const FEATURED_SYMBOLS = [
  { symbol: '⚀', name: '点数5' },
  { symbol: '‰', name: '万分号' },
  { symbol: 'ぽ', name: '平假名Po' },
  { symbol: '♫', name: '双连线八分音符' },
  { symbol: 'w', name: '上标w' },
  { symbol: 'H', name: 'Eta' },
  { symbol: 'ゼ', name: '片假名Ze' },
  { symbol: '📋', name: '梅花骑士' },
  { symbol: 'Ⅵ', name: '罗马数字六' },
  { symbol: '⚂', name: '点数3' },
];