## [1.0.1](https://github.com/nowscott/rarecharweb/compare/v1.0.0...v1.0.1) (2025-06-25)


### Bug Fixes

* **about:** 使用package.json中的版本号替换硬编码版本 ([ebd649a](https://github.com/nowscott/rarecharweb/commit/ebd649ad76a3223dc6d88834426c21eeea9e2b05))

# 1.0.0 (2025-06-25)


### Bug Fixes

* **组件:** 修复SymbolDetail组件点击事件冒泡和样式问题 ([2ec6375](https://github.com/nowscott/rarecharweb/commit/2ec6375b96d558715c88c0dcaa9e3bed5b6ed1e7))
* **symbolUtils:** 修复客户端和服务端排序不一致问题 ([3387709](https://github.com/nowscott/rarecharweb/commit/3387709567641713ec72fbfd37bad7da2f3cf1e8))
* **useSymbolData:** 修复搜索时分类过滤的触发问题 ([c74974b](https://github.com/nowscott/rarecharweb/commit/c74974be7afcf0f4201cbabd2c461b820bcb4c18))
* **assets:** 将favicon.ico移动到public目录并更新引用 ([2e6114e](https://github.com/nowscott/rarecharweb/commit/2e6114e612e9164820f2b8767c36bb96a0b2da15))
* 延长符号数据缓存时间至10小时并更新关于页面的时间显示 ([eb22a16](https://github.com/nowscott/rarecharweb/commit/eb22a167d8828497a717b00c0813e19a7d732a08))
* **HomeClient:** 添加客户端状态检查避免hydration不匹配 ([a4f8740](https://github.com/nowscott/rarecharweb/commit/a4f8740fde721a0ddd4c34d9987892a486abd762))


### Features

* 为页面添加 ISR 并优化数据获取逻辑 ([7cce28b](https://github.com/nowscott/rarecharweb/commit/7cce28bc19e61aa1da2c42cabe8830af5ab7988d))
* **about:** 从API获取并显示数据版本号 ([cbcaadb](https://github.com/nowscott/rarecharweb/commit/cbcaadbf35702fadf92934eb57be0b80dc4099ed))
* **ui:** 优化移动端响应式布局和交互体验 ([f3b791c](https://github.com/nowscott/rarecharweb/commit/f3b791c4ffea85ab11442368550efd848cbc23b7))
* **字体:** 优化符号显示并添加跨域支持 ([ca97f7e](https://github.com/nowscott/rarecharweb/commit/ca97f7eb97c6e68ba2600e028bb6188021041f10))
* **组件:** 优化符号详情弹窗的UI设计和交互体验 ([4547397](https://github.com/nowscott/rarecharweb/commit/4547397f7aaf02485ab14eddc25d38408908aaa6))
* **缓存:** 实现全局缓存系统并优化数据加载 ([ba382b2](https://github.com/nowscott/rarecharweb/commit/ba382b2f15be6bc22b2dc342a96b6463fd5550c4))
* 实现客户端数据获取并添加加载状态 ([31aadf3](https://github.com/nowscott/rarecharweb/commit/31aadf3171a4ecce8686b1efdee1d3792f5ae479))
* **符号展示:** 实现客户端符号随机排序功能并优化数据缓存 ([bd2e189](https://github.com/nowscott/rarecharweb/commit/bd2e1892d1cccb760acd42bdf67672b7a3dd6426))
* **缓存:** 实现智能缓存策略和后台数据更新 ([d7fff0c](https://github.com/nowscott/rarecharweb/commit/d7fff0ca0f307d81cc6a31b5d53cf09f6ebca38c))
* 实现智能缓存系统并优化导航组件 ([0bc967a](https://github.com/nowscott/rarecharweb/commit/0bc967a2434dedc9bee047fc4eeb87c0e9621c1c))
* 实现特殊符号查询工具的核心功能 ([12cd966](https://github.com/nowscott/rarecharweb/commit/12cd966e907348eb1e80169212b11461801721b9))
* **ui:** 更新社交媒体图标为图片并优化符号显示样式 ([f82b3d5](https://github.com/nowscott/rarecharweb/commit/f82b3d5fa96f63178f0793a30b2475a16f3dc489))
* **about:** 更新联系我们页面的社交媒体链接 ([017efff](https://github.com/nowscott/rarecharweb/commit/017efffb1a2c6ab52b3f9940712890ed3d821a5d))
* **types:** 添加 EmojiData 和 EmojiDataResponse 类型定义 ([89e0538](https://github.com/nowscott/rarecharweb/commit/89e0538475ca5bcac7c910913608d2d8c3cf6b3e))
* **emoji:** 添加emoji表情符号页面和API接口 ([cade1bb](https://github.com/nowscott/rarecharweb/commit/cade1bb0aa8685e8fff20ffd7fc1d7766f30c402))
* **字体:** 添加Noto符号字体并优化加载方式 ([7c3502d](https://github.com/nowscott/rarecharweb/commit/7c3502d79938247d3310dd43fd83b4d62f872ada))
* **SymbolDetail:** 添加复制成功提示并改进说明文本显示 ([feb5f31](https://github.com/nowscott/rarecharweb/commit/feb5f3108311ddbb85ed704114b906bee3827d82))
* **字体:** 添加字体健康检查工具并优化字体栈 ([78eebc3](https://github.com/nowscott/rarecharweb/commit/78eebc3c1f168edbfd2b6003e3c5c8093c9b993d))
* **搜索:** 添加拼音搜索功能并实现实时搜索 ([3162743](https://github.com/nowscott/rarecharweb/commit/3162743b50d60e41cb208db60459162c0918d610))
* **SearchBar:** 添加清除按钮功能 ([2cc1aec](https://github.com/nowscott/rarecharweb/commit/2cc1aecda99ff7140af5fce2bb0224e25e5f82e5))
* **about:** 添加表情数据版本显示并合并分类统计 ([cc4e62c](https://github.com/nowscott/rarecharweb/commit/cc4e62c6b0fc6a3b3123f7d6e3b3be221a3b0751))
* **ci:** 添加语义化发布和工作流配置 ([235688e](https://github.com/nowscott/rarecharweb/commit/235688ef6ae2da38ea0b77c38cabd89b5363422c))
* **组件:** 添加通用组件和钩子实现数据加载状态管理 ([8ab5276](https://github.com/nowscott/rarecharweb/commit/8ab5276d3467857b3b84d7f66dd45d33e02fde30))
