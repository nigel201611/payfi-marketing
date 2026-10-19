提交代码: $ARGUMENTS

## 执行步骤

1. 查看当前修改：`git status`
2. 查看具体改动：`git diff`
3. 根据改动内容生成 commit message
4. 暂存并提交

## Commit Message 规范

格式：`<type>: <description>`

规则：
- description 必须是英文
- description 不超过 50 个字符
- 使用动词开头：add, fix, update, remove, refactor
- 全部小写

### Type 类型
- feat: 新功能
- fix: bug 修复
- style: 样式调整
- refactor: 重构
- docs: 文档
- chore: 工具/构建

### 示例
- feat: add hero section
- fix: mobile nav overflow
- style: tune section spacing
- refactor: extract waitlist dialog

## 提交前检查

提交前先跑：

```bash
pnpm type-check
pnpm lint
pnpm test
```

有失败先修复，不要带病提交。

## 执行命令

```bash
git add .
git commit -m "<生成的message>"
```

完成后显示 commit hash。
