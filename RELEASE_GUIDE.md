# 自动发布版本指南

本项目使用 [semantic-release](https://github.com/semantic-release/semantic-release) 和 GitHub Actions 来自动化版本发布流程。<mcreference link="https://github.com/semantic-release/semantic-release" index="2">2</mcreference>

## 工作原理

当代码推送到 `main` 分支时，GitHub Actions 会：
1. 分析提交信息
2. 根据提交类型自动确定版本号
3. 生成 CHANGELOG.md
4. 创建 Git 标签
5. 发布 GitHub Release

## 提交信息规范

本项目遵循 [Angular 提交信息规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)：<mcreference link="https://dev.to/seven/automating-npm-package-releases-with-github-actions-14i9" index="1">1</mcreference>

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

| 类型 | 描述 | 版本影响 |
|------|------|----------|
| `feat` | 新功能 | Minor (0.x.0) |
| `fix` | 修复 Bug | Patch (0.0.x) |
| `docs` | 文档更新 | Patch (0.0.x) |
| `style` | 代码格式调整 | Patch (0.0.x) |
| `refactor` | 代码重构 | Patch (0.0.x) |
| `perf` | 性能优化 | Patch (0.0.x) |
| `test` | 测试相关 | 无版本发布 |
| `chore` | 构建/工具相关 | 无版本发布 |
| `ci` | CI 配置 | 无版本发布 |

### 破坏性变更

如果提交包含破坏性变更，需要在提交信息的 footer 中添加 `BREAKING CHANGE:`，这将触发 Major 版本更新 (x.0.0)。

### 提交示例

```bash
# 新功能 - 触发 Minor 版本更新
git commit -m "feat(search): add fuzzy search functionality"

# Bug 修复 - 触发 Patch 版本更新
git commit -m "fix(ui): resolve button alignment issue"

# 破坏性变更 - 触发 Major 版本更新
git commit -m "feat(api): change response format

BREAKING CHANGE: API response format changed from array to object"

# 文档更新 - 触发 Patch 版本更新
git commit -m "docs(readme): update installation instructions"

# 不触发版本发布的提交
git commit -m "chore: update dependencies"
git commit -m "test: add unit tests for utils"
```

## 环境设置

### GitHub Secrets 配置

需要在 GitHub 仓库设置中配置以下 Secrets：

1. **GITHUB_TOKEN** - 自动提供，无需手动设置
2. **NPM_TOKEN** - 如果需要发布到 npm（当前配置为不发布）

### 权限设置

确保 GitHub Actions 具有以下权限：
- `contents: write` - 用于创建标签和发布
- `issues: write` - 用于关闭相关 issue
- `pull-requests: write` - 用于评论 PR

## 配置文件说明

### `.github/workflows/release.yml`
GitHub Actions 工作流配置文件，定义了自动发布的流程。<mcreference link="https://dev.to/seven/automating-npm-package-releases-with-github-actions-14i9" index="1">1</mcreference>

### `.releaserc.json`
semantic-release 配置文件，定义了：
- 分析提交信息的规则
- 生成发布说明的格式
- 更新的文件列表
- 发布渠道配置

## 使用流程

1. **开发功能**：在功能分支上开发
2. **提交代码**：使用规范的提交信息
3. **创建 PR**：向 `main` 分支创建 Pull Request
4. **合并代码**：PR 审核通过后合并到 `main`
5. **自动发布**：GitHub Actions 自动分析提交并发布新版本

## 查看发布

- **GitHub Releases**：在仓库的 Releases 页面查看
- **CHANGELOG.md**：查看详细的变更日志
- **Git Tags**：查看版本标签

## 注意事项

1. 只有推送到 `main` 分支才会触发自动发布
2. 提交信息必须遵循规范，否则不会触发版本发布
3. 发布过程中会自动跳过 CI 检查（`[skip ci]`）
4. 当前配置不会发布到 npm，只创建 GitHub Release

## 故障排除

如果自动发布失败，请检查：
1. 提交信息格式是否正确
2. GitHub Actions 权限是否充足
3. 工作流日志中的错误信息

更多信息请参考 [semantic-release 官方文档](https://semantic-release.gitbook.io/)。<mcreference link="https://github.com/semantic-release/semantic-release" index="2">2</mcreference>