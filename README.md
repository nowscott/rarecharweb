# 复制符 - 特殊符号查询工具

一个现代化的特殊符号查询和复制工具，帮助用户快速查找、浏览和复制各种特殊字符和符号。

## ✨ 功能特性

- 🔍 **智能搜索** - 支持符号名称和描述的模糊搜索
- 📂 **分类浏览** - 按符号类型分类展示，便于查找
- 📋 **一键复制** - 点击符号卡片或复制按钮快速复制到剪贴板
- 🎨 **现代UI** - 响应式设计，支持深色/浅色主题
- 💫 **毛玻璃效果** - 精美的视觉效果和交互体验
- 📱 **移动友好** - 完美适配各种屏幕尺寸
- ⚡ **快速加载** - 基于Next.js的高性能应用

## 🛠️ 技术栈

- **框架**: Next.js 15.3.4
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.0
- **UI库**: React 19
- **构建工具**: Next.js内置构建系统
- **代码规范**: ESLint

## 📦 安装与运行

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun 包管理器

### 克隆项目

```bash
git clone https://github.com/your-username/rarecharweb.git
cd rarecharweb
```

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
```

## 🎯 使用方法

1. **浏览符号**: 在主页面浏览各种特殊符号
2. **分类筛选**: 点击顶部分类标签筛选特定类型的符号
3. **搜索符号**: 使用搜索框输入关键词查找符号
4. **复制符号**: 
   - 点击符号卡片查看详情并复制
   - 悬停卡片时点击右上角复制图标快速复制
5. **查看详情**: 点击符号卡片查看详细信息，包括Unicode编码

## 📁 项目结构

```
src/
├── app/                 # Next.js App Router页面
│   ├── about/          # 关于页面
│   ├── layout.tsx      # 根布局组件
│   └── page.tsx        # 主页面
├── components/         # React组件
│   ├── CategoryNav.tsx # 分类导航组件
│   ├── SearchBar.tsx   # 搜索栏组件
│   ├── SymbolCard.tsx  # 符号卡片组件
│   ├── SymbolDetail.tsx# 符号详情弹窗
│   └── SymbolList.tsx  # 符号列表组件
├── hooks/              # 自定义React Hooks
│   └── useSymbolData.ts# 符号数据管理Hook
└── lib/                # 工具库和数据
    ├── constants.ts    # 常量定义
    └── symbolData.ts   # 符号数据
```

## 🎨 主要功能

### 符号分类

- 数学符号
- 货币符号
- 箭头符号
- 标点符号
- 几何图形
- 表情符号
- 其他特殊符号

### 搜索功能

- 支持符号名称搜索
- 支持符号描述搜索
- 实时搜索结果更新
- 搜索结果按Unicode顺序排列

### 复制功能

- 一键复制到剪贴板
- 复制成功视觉反馈
- 支持快捷复制按钮

## 🌙 主题支持

应用支持自动检测系统主题，提供深色和浅色两种模式，确保在不同环境下都有良好的视觉体验。

## 📱 响应式设计

- 桌面端：多列网格布局
- 平板端：自适应列数
- 移动端：单列布局，优化触摸体验

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Heroicons](https://heroicons.com/) - 图标库

---

如果这个项目对你有帮助，请给它一个 ⭐️！
