全库优化体检: $ARGUMENTS

对**现有代码**做定期优化审计（不是 diff 审查、不是安全审查）。全程只研究不改码，先出发现清单再等用户点单。

若 $ARGUMENTS 指定方向（duplication / perf / data / hygiene），只跑对应方向；否则四个方向全跑。

## 预检（避免误报和重复报）

1. `git status` + 代码规模（文件数、总行数、Top 20 最大文件）
2. 先读 `CLAUDE.md` 和 `docs/operations-environment.md`；以下都是已知设计决策，不算问题：
   - 所有银行 / MCP / PayFi / RWA 接口本来就是浏览器 mock，缺失真实对接不是缺陷
   - Pages 静态导出会剔除 `route.server.ts`，浏览器回退 mock MCP + 确定性计划，这是预期行为
   - 保留 EX.IO favicon（`public/icon.png`）；不使用 WebGL 背景（Aurora/Orb）
   - `src/components/react-bits/**` 是 vendored 第三方组件，只报未使用，不评审其内部实现或风格
   - 演示固定数据：large = 16 × Treasury 30D = $16,000 → approval；small = 10 × New Energy #07 = $6,000 → auto
   - 目标是大屏 roadshow（1440 / 1920），不要按移动优先提重构建议
3. 基础信号扫描：`any` / `@ts-ignore` / `eslint-disable` / `console.*` / `TODO|FIXME` 数量与位置；`NEXT_PUBLIC_*` 是否误放密钥
4. 先跑 `pnpm lint` / `pnpm type-check` / `pnpm test` 记录基线，有失败先报

## 四个方向（单条消息并行发起 4 个 general-purpose agent）

每个 agent 都要求：research-only 不写码；先盘点已有共享物，避免建议已存在的东西；跳过 `src/components/react-bits/**` 的内部实现；每条发现给 file:line + 影响 + 修法方向；编号列表、每项 ≤6 行；总量 ≤700 词；结尾 3 行总结最高价值项。

1. **重复代码/抽象漂移**：BFF 路由（`src/app/api/**/route.server.ts`）与 `src/lib/mcp/*`（mock / bff / http transport）的职责重叠；`src/lib/launch-analysis.ts` 与 `/api/agent/intake` 的 fallback 逻辑；`src/lib/intent-parser.ts` 与 `src/lib/agent/policy.ts` 的校验边界；`terminal/` 各 step（launch / intent / settlement / receipt）的布局与按钮重复；`ui.tsx`、`vara-panel.tsx` 是否已有可复用面；重点找**已发生漂移**的重复（一处修了另一处没修）
2. **React 性能与状态/定时器**：`src/components/terminal/terminal.tsx` 单点持有 stage/intentPhase/order/overlay/settled/receipt/logs 的级联重渲染；Agent Monitor 日志增长与 `aria-live` 更新频率；`schedule()` 的 run token + `timers` ref 是否所有分支都清理；`AbortController` 在 reset/unmount 下的竞态；Theme/Locale context value 抖动；`motion` / GSAP 动画的常驻监听与 reduced-motion 回退；RWA 资产列表和 monitor 日志是否有无谓的重建/重排
3. **Agent / MCP / 数据层**：`src/lib/agent/settlement-runner.ts` 的工具调用顺序与 abort 传播；`mcpToolServer` 的 CRB/RWA 分流与各自独立 fallback；mock transport 的状态是否会在 reset 后残留；LLM planner（`src/lib/agent/llm.ts`）的 provider preset、超时、JSON 解析与 policy guard 拒绝路径；`launch-history.ts` 的 localStorage 上限与异常输入；receipt 与 reset 的状态一致性；PRD 中的客户身份、CI/BR、路由/账户 mock 数据是否与 `src/constants/terminal.ts` 一致
4. **工程卫生 / i18n**：孤儿文件与死导出（components / lib / constants）；JSX 中硬编码用户可见文案；`src/i18n/messages.ts` 的 en/zh key 对齐与未使用 key（单测已强制结构 parity，重点找语义漂移）；关键纯逻辑测试缺口（policy 拒绝、timer/abort、MCP 分流、LLM config、launch history）；`docs/` 与代码是否漂移；repo 根目录杂项文件

## 汇总前必须核验

对要汇报的高优先级发现（尤其是 bug 类），亲自打开文件确认 ≥3 处，输出时标注「已核验」；未核验的标注来源为 agent 报告。宁可少报，不可误报。

## 输出格式（按优先级分层，只列值得动手的）

1. **Bug（先修）**——正确性、状态机、定时器/竞态、数据错乱
2. **一致性/可靠性**——abort/超时、mock 与 BFF 行为不一致、i18n 语义漂移、localStorage 边界
3. **重复与抽象**——按修复价值排序，注明漂移风险与建议抽离目标
4. **清理项**——死代码/死导出/硬编码，一句话一条

每条带 file:line。结尾给一句：如果只做一件事，做哪个。经用户确认后才开始改码。
