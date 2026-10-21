# Agentic Payment 运维环境配置手册

本文档面向部署与运维同学，说明 Agentic Payment 演示应用的运行形态、环境变量、
模型与 MCP 配置、部署步骤、健康检查和故障排查。

> 所有银行、MCP、PayFi 与 RWA 结算行为仍为演示用途；默认使用内置 mock
> （Pages 在浏览器内运行，Node 在 BFF 进程内运行），不会产生真实资金流动。

## 1. 部署形态

| 形态         | 适用场景             | Agent BFF          | MCP                     | 构建产物              |
| ------------ | -------------------- | ------------------ | ----------------------- | --------------------- |
| 本地开发     | 前端联调、演示调试   | 启用               | 默认 mock，可接真实 MCP | `.next-dev/`          |
| Node 部署    | 内网演示、预发、生产 | 启用               | mock 或真实 MCP         | `.next/` + standalone |
| GitHub Pages | 公网静态演示         | 不可用（自动降级） | 浏览器 mock             | `out/`                |

运行链路：

```text
Browser
  ├─ /api/agent/intake      → BFF：LLM 分析购买需求 + 确定性兜底
  ├─ 确定性策略（默认）/ 可选 LLM planner
  ├─ /api/agent/plan        → BFF：LLM 生成计划 + 确定性校验
  └─ /api/mcp/tool          → BFF：MCP facade
                                 ├─ CRB MCP：funding / payment / verification
                                 └─ RWA MCP：order / on-chain / delivery
```

两个后端 MCP 可独立配置：某个 server 的 URL 为空时，该 server 自动使用进程内 mock。
静态 Pages 构建会通过 `pageExtensions` 自动剔除所有 `route.server.ts`，
浏览器回退到内置 mock MCP 与确定性计划，因此 Pages 上不需要任何密钥。

## 2. 运行时要求

| 项目     | 要求                                              |
| -------- | ------------------------------------------------- |
| Node.js  | 22.x                                              |
| pnpm     | 10.12.1（与 CI 一致）                             |
| 应用端口 | 固定 `3005`（`dev` / `start` / Docker 均使用）    |
| 容器镜像 | `Dockerfile` 基于 `node:22-alpine` 多阶段构建     |
| 反向代理 | 建议 Nginx/网关终止 TLS 并转发到 `127.0.0.1:3005` |
| 出网要求 | 仅在启用 LLM 或真实 MCP 时需要                    |

## 3. 环境变量总表

### 3.1 公共变量（会进入浏览器包）

| 变量                      | 必填     | 默认值                     | 说明                                                       |
| ------------------------- | -------- | -------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | 否       | `https://www.ex.io`        | canonical / sitemap / Open Graph 使用的站点地址            |
| `NEXT_PUBLIC_BFF_ENABLED` | 构建注入 | Node=`true`，Pages=`false` | 由 `next.config.ts` 根据 `GITHUB_PAGES` 注入，不要手工覆盖 |

> `NEXT_PUBLIC_*` 会被内联到前端 JS，**禁止**把任何密钥放入该前缀。

### 3.2 Agent / LLM 变量（仅服务端）

| 变量                   | 必填 | 默认值      | 说明                                             |
| ---------------------- | ---- | ----------- | ------------------------------------------------ |
| `AGENT_LLM_PROVIDER`   | 否   | `deepseek`  | `deepseek` / `kimi` / `codex` / `openai` / `glm` |
| `AGENT_LLM_API_KEY`    | 否   | 空          | 通用密钥，优先级高于 provider 专属密钥           |
| `AGENT_LLM_BASE_URL`   | 否   | 按 provider | 覆盖预设 Base URL                                |
| `AGENT_LLM_MODEL`      | 否   | 按 provider | 覆盖预设模型                                     |
| `AGENT_LLM_PROTOCOL`   | 否   | 按 provider | `chat-completions` 或 `responses`                |
| `AGENT_LLM_TIMEOUT_MS` | 否   | `4000`      | 单次规划请求超时                                 |
| `DEEPSEEK_API_KEY`     | 否   | 空          | DeepSeek 专属密钥                                |
| `MOONSHOT_API_KEY`     | 否   | 空          | Kimi / Moonshot 专属密钥                         |
| `OPENAI_API_KEY`       | 否   | 空          | OpenAI / Codex 专属密钥                          |
| `ZHIPU_API_KEY`        | 否   | 空          | 智谱 GLM 专属密钥                                |

未配置任何可用密钥时，应用自动使用确定性结算计划，不影响演示。

### 3.3 MCP 变量（仅服务端）

| 变量                   | 必填 | 默认值 | 说明                                             |
| ---------------------- | ---- | ------ | ------------------------------------------------ |
| `MCP_CRB_SERVER_URL`   | 否   | 空     | CRB MCP JSON-RPC 地址；为空时该 server 使用 mock |
| `MCP_CRB_SERVER_TOKEN` | 否   | 空     | CRB MCP Bearer Token                             |
| `MCP_RWA_SERVER_URL`   | 否   | 空     | RWA MCP JSON-RPC 地址；为空时该 server 使用 mock |
| `MCP_RWA_SERVER_TOKEN` | 否   | 空     | RWA MCP Bearer Token                             |

### 3.4 构建 / 测试变量

| 变量            | 必填 | 默认值  | 说明                                                           |
| --------------- | ---- | ------- | -------------------------------------------------------------- |
| `GITHUB_PAGES`  | 否   | 空      | `true` 时启用静态导出、`/payfi-marketing` basePath，并剔除 BFF |
| `NEXT_DIST_DIR` | 否   | `.next` | dev 脚本注入 `.next-dev`；构建/生产保持默认                    |
| `E2E_BASE_URL`  | 否   | 空      | Playwright 外部目标地址；为空时自动启动本地 dev                |
| `CI`            | 否   | 空      | CI 下 Playwright 不复用已有 server                             |

## 4. 模型配置

### 4.1 Provider 预设

| Provider   | 默认模型            | 默认 Base URL                          | 协议             | 密钥变量           |
| ---------- | ------------------- | -------------------------------------- | ---------------- | ------------------ |
| `deepseek` | `deepseek-flash`    | `https://api.deepseek.com/v1`          | Chat Completions | `DEEPSEEK_API_KEY` |
| `kimi`     | `kimi-k3`           | `https://api.moonshot.ai/v1`           | Chat Completions | `MOONSHOT_API_KEY` |
| `codex`    | `gpt-5.1-codex-max` | `https://api.openai.com/v1`            | Responses API    | `OPENAI_API_KEY`   |
| `openai`   | `gpt-5.1`           | `https://api.openai.com/v1`            | Chat Completions | `OPENAI_API_KEY`   |
| `glm`      | `glm-5.3`           | `https://open.bigmodel.cn/api/paas/v4` | Chat Completions | `ZHIPU_API_KEY`    |

Kimi 说明：

- 国际区 Key 使用 `https://api.moonshot.ai/v1`
- 中国大陆 Key 使用 `https://api.moonshot.cn/v1`，需通过 `AGENT_LLM_BASE_URL` 覆盖
- Key 与区域绑定，混用会返回 401

Codex 说明：

- 仅支持 OpenAI Responses API（`/v1/responses`）
- 预设已自动使用 `AGENT_LLM_PROTOCOL=responses`
- 若网关只提供 Chat Completions，请改用 `openai`，并通过 `AGENT_LLM_BASE_URL` /
  `AGENT_LLM_MODEL` 指向兼容网关

GLM 说明：

- 预设使用智谱 BigModel 国内站 `https://open.bigmodel.cn/api/paas/v4`
- Z.ai 国际站需通过 `AGENT_LLM_BASE_URL=https://api.z.ai/api/paas/v4` 覆盖
- GLM-5.3 始终开启思考且不支持关闭；预设固定 `reasoning_effort=low` 以兼顾 4 秒超时，
  需要更强推理时可调整 `src/lib/agent/llm.ts` 中的预设或增大 `AGENT_LLM_TIMEOUT_MS`
- GLM Coding Plan 使用独立端点 `https://open.bigmodel.cn/api/coding/paas/v4`，不要与标准
  API 混用

### 4.2 配置示例

```bash
# DeepSeek（默认）
AGENT_LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-***

# Kimi 国际区
AGENT_LLM_PROVIDER=kimi
MOONSHOT_API_KEY=sk-***

# Kimi 中国大陆
AGENT_LLM_PROVIDER=kimi
MOONSHOT_API_KEY=sk-***
AGENT_LLM_BASE_URL=https://api.moonshot.cn/v1

# Codex
AGENT_LLM_PROVIDER=codex
OPENAI_API_KEY=sk-***

# OpenAI
AGENT_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-***

# 智谱 GLM（BigModel 国内站）
AGENT_LLM_PROVIDER=glm
ZHIPU_API_KEY=sk-***

# 智谱 GLM（Z.ai 国际站）
AGENT_LLM_PROVIDER=glm
ZHIPU_API_KEY=sk-***
AGENT_LLM_BASE_URL=https://api.z.ai/api/paas/v4

# 兼容网关（沿用 openai 预设，覆盖 Base URL / 模型）
AGENT_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-***
AGENT_LLM_BASE_URL=https://gateway.example.com/v1
AGENT_LLM_MODEL=my-model
AGENT_LLM_PROTOCOL=chat-completions
```

### 4.3 安全边界

- LLM 只负责生成结算计划；服务端会校验订单号、收款方、金额、钱包地址和 RWA 数量。
- 任何字段与用户授权不一致时，整份计划被拒绝并回退到确定性计划。
- 模型超时、断网、限流都会自动回退，不阻断演示。
- 密钥只从服务端环境读取，不会出现在浏览器包或日志中。

## 5. MCP 配置

系统对接两个独立的后端 MCP：

| MCP     | 负责工具                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| CRB MCP | `setup_crb_funding`、`check_crb_balance`、`execute_crb_payment`、`reject_payment`、`verify_crb_settlement` |
| RWA MCP | `create_trade_order`、`execute_onchain_settlement`、`confirm_delivery`                                     |

路由表定义在 `src/lib/mcp/types.ts` 的 `mcpToolServer`。

### 5.1 Mock 模式（默认）

某个 server 未配置 URL 时，BFF 对该 server 使用进程内 mock transport：

- 无需网络
- 结算工具按固定节奏返回确定结果
- 浏览器静态构建使用同一套 mock（运行在浏览器内）
- CRB 与 RWA 可独立接入：例如只接 CRB，RWA 继续走 mock

### 5.2 连接真实后端 MCP

```bash
# CRB MCP
MCP_CRB_SERVER_URL=https://mcp-crb.internal.example.com/mcp
MCP_CRB_SERVER_TOKEN=***

# RWA MCP
MCP_RWA_SERVER_URL=https://mcp-rwa.internal.example.com/mcp
MCP_RWA_SERVER_TOKEN=***
```

两个地址可以分别配置，互不影响。

请求格式（JSON-RPC 2.0）：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "execute_crb_payment",
    "arguments": {
      "order_id": "NKA-ORD-2026-0842",
      "payee_crb_acct": "CRB •••• 3456",
      "amount": 16000
    }
  }
}
```

响应解析优先级：

1. `result.structuredContent`
2. `result.content` 中 `type=text` 的 JSON 文本

BFF 响应会附带实际使用的 server：

```json
{ "ok": true, "output": { "...": "..." }, "server": "crb" }
```

当前 BFF 允许的工具白名单：

- `execute_crb_payment`（CRB）
- `verify_crb_settlement`（CRB）
- `execute_onchain_settlement`（RWA）
- `confirm_delivery`（RWA）

其他工具会被拒绝（HTTP 400）。如需放开，修改 `src/lib/mcp/types.ts` 中的
`bffToolNames`。

超时与错误：

- 每个 MCP 请求超时：15 秒
- 后端失败或超时：HTTP 502，返回 `{ "ok": false, "error": "...", "server": "crb|rwa" }`
- 若某个后端 MCP 需要 session header 或 SSE 分帧，调整 `src/lib/mcp/http-transport.ts`

## 6. 环境配置模板

### 6.1 本地开发

```bash
# .env.local（已 gitignore）
NEXT_PUBLIC_SITE_URL=http://localhost:3005

# 可选：启用真实 planner
AGENT_LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-***

# 可选：连接本地/联调 MCP；对应 URL 不填则使用 mock
MCP_CRB_SERVER_URL=
MCP_CRB_SERVER_TOKEN=
MCP_RWA_SERVER_URL=
MCP_RWA_SERVER_TOKEN=
```

启动：

```bash
pnpm install --frozen-lockfile
pnpm dev          # http://localhost:3005，使用 .next-dev
```

### 6.2 Node 生产环境

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://demo.example.com

AGENT_LLM_PROVIDER=deepseek
AGENT_LLM_API_KEY=***          # 或使用 provider 专属密钥
AGENT_LLM_TIMEOUT_MS=4000

MCP_CRB_SERVER_URL=https://mcp-crb.internal.example.com/mcp
MCP_CRB_SERVER_TOKEN=***
MCP_RWA_SERVER_URL=https://mcp-rwa.internal.example.com/mcp
MCP_RWA_SERVER_TOKEN=***
```

部署：

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start        # 监听 3005
```

建议通过 systemd / PM2 / 容器注入上述环境变量，不要写入镜像层或仓库。

### 6.2.1 Docker 镜像

`Dockerfile` 采用多阶段构建：

- `deps`：`pnpm install --frozen-lockfile`
- `builder`：`next build`（standalone），构建后剔除 sharp 等运行时不需要的产物
- `runner`：`node:22-alpine`，非 root 用户，监听 `3005`，内置 `/` 健康检查

构建：

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://demo.example.com \
  -t registry.example.com/payfi-dev/agentic-payment-fe:local .
```

运行（密钥在运行时注入）：

```bash
docker run --rm -p 3005:3005 \
  --env-file .env.production \
  registry.example.com/payfi-dev/agentic-payment-fe:local
```

注意事项：

- `NEXT_PUBLIC_SITE_URL` 是构建期变量，会被内联进前端包；修改后需重新构建镜像
- `AGENT_LLM_*`、`MCP_CRB_*`、`MCP_RWA_*` 等仅服务端变量在容器启动时注入，不需要重新构建
- 不使用 `GITHUB_PAGES=true` 构建，因此镜像内保留 BFF 路由
- 健康检查请求 `http://localhost:3005/`

### 6.3 GitHub Pages

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_SITE_URL=https://nigel201611.github.io/payfi-marketing \
pnpm build
# 产物：out/，由 .github/workflows/deploy-pages.yml 上传
```

约束：

- 不部署 BFF，`/api/agent/plan`、`/api/mcp/tool` 不存在，属预期行为
- 浏览器使用 mock MCP + 确定性计划
- 仓库 Pages Source 必须是 **GitHub Actions**
- 站点路径固定 `/payfi-marketing`；改仓库名或自定义域名时需同步修改 `next.config.ts`

### 6.4 GitLab CI

`.gitlab-ci.yml` 复用 `exiogroup/exio-devops/exio-frontend-ci` 的
`templates/frontend.yml`，并补充本项目的镜像构建与 dev 部署。

流水线行为：

- Merge Request / `main` / Tag 触发
- `frontend-validate` 执行模板内的校验（lint、类型检查、单测）
- `build_docker` 在 `main` 和 Tag 上使用 Kaniko 构建并推送镜像
- `deploy_dev` 触发 Helm chart 仓库的下游流水线，部署 dev 环境

镜像标签：

```text
${CI_COMMIT_TAG} 或 ${CI_COMMIT_REF_SLUG}-${CI_COMMIT_SHORT_SHA}
```

需要在 GitLab 项目 CI/CD Variables 中配置：

| 变量                       | 用途                                   |
| -------------------------- | -------------------------------------- |
| `ACR_REGISTRY`             | 镜像仓库地址                           |
| `ACR_USER`                 | 镜像仓库用户名                         |
| `ACR_PASSWORD`             | 镜像仓库密码                           |
| `CHART_REPO_TRIGGER_TOKEN` | 触发 Helm chart 仓库下游流水线的 token |

接入前请确认并修改 `.gitlab-ci.yml` 中的以下项目专属值：

- `ACR_NAMESPACE`（当前 `payfi-dev`）
- `IMAGE_NAME`（当前 `agentic-payment-fe`）
- `CHART_REPO_PROJECT_ID`（当前沿用 PayFi chart 仓库 `83630068`）
- `CHART_REPO_SERVICE_NAME` 与 `DEPLOY_APPS`（当前 `agentic-payment-fe`）

## 7. 健康检查

### 7.1 页面

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3005/
# 期望：200
```

### 7.2 Agent 计划接口

```bash
curl -sS -X POST http://127.0.0.1:3005/api/agent/plan \
  -H 'content-type: application/json' \
  -d '{
    "orderId": "NKA-ORD-2026-0842",
    "assetId": "RWA-BOND-TREAS-30",
    "amount": 16000,
    "rwaAmount": 16,
    "payeeAccount": "CRB •••• 3456",
    "walletAddress": "0x3f5e…9aC2"
  }'
```

预期：

- 未配置 LLM：`plan.source = "deterministic"`，`warning = "LLM planner not configured"`
- 已配置 LLM：`plan.source = "llm"`；若模型输出不合规，回退并返回 warning

### 7.3 Launch 需求分析

```bash
curl -sS -X POST http://127.0.0.1:3005/api/agent/intake \
  -H 'content-type: application/json' \
  -d '{"brief":"Buy $16,000 of 30-day U.S. Treasury bonds, T+0."}'
```

预期：

- 配置 LLM：`source = "llm"`，返回 `categories`、`maxBudget`、`risk`、`settlement`
- 未配置或调用失败：`source = "policy"`，使用确定性解析
- 无论哪种来源，结果都会经过服务端校验；格式异常时回退到确定性结果

### 7.4 MCP 工具接口

CRB MCP：

```bash
curl -sS -X POST http://127.0.0.1:3005/api/mcp/tool \
  -H 'content-type: application/json' \
  -d '{
    "name": "execute_crb_payment",
    "input": {
      "order_id": "NKA-ORD-2026-0842",
      "payee_crb_acct": "CRB •••• 3456",
      "amount": 16000
    }
  }'
```

RWA MCP：

```bash
curl -sS -X POST http://127.0.0.1:3005/api/mcp/tool \
  -H 'content-type: application/json' \
  -d '{
    "name": "confirm_delivery",
    "input": {
      "order_id": "NKA-ORD-2026-0842",
      "receipt_hash": "0x7b21…9d8a"
    }
  }'
```

预期：

- 成功：HTTP 200，`{ "ok": true, "output": { ... }, "server": "crb" | "rwa" }`
- 后端失败：HTTP 502，`{ "ok": false, "error": "...", "server": "crb" | "rwa" }`
- 工具不在白名单：HTTP 400
- 未配置对应 server URL：请求由进程内 mock 处理，`server` 字段仍返回路由结果

## 8. 故障排查

| 现象                        | 可能原因                                                  | 处理                                                                 |
| --------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| 计划始终显示 `policy`       | 未配置密钥、变量写到了 `NEXT_PUBLIC_*`、provider 名称错误 | 检查服务端环境变量与 `AGENT_LLM_PROVIDER`                            |
| Kimi 返回 401               | Key 与 Base URL 区域不一致                                | 国内 Key 改用 `https://api.moonshot.cn/v1`                           |
| Codex 返回 404 / 不支持     | 走了 Chat Completions                                     | 使用 `AGENT_LLM_PROTOCOL=responses`，或改用 `openai` 并覆盖 Base URL |
| LLM 计划被拒绝              | 模型改动了金额、收款方或钱包                              | 属安全预期；检查 prompt 或模型输出                                   |
| 启动需求始终为 `policy`     | LLM 未配置或 intake 调用失败                              | 检查 `AGENT_LLM_*` 与 `/api/agent/intake` 响应                       |
| `/api/mcp/tool` 返回 400    | 工具不在白名单                                            | 使用四个结算/确认工具，或调整 `bffToolNames`                         |
| `/api/mcp/tool` 返回 502    | 对应 MCP 不可达、超时、鉴权失败                           | 按响应 `server` 检查 `MCP_CRB_*` 或 `MCP_RWA_*` 的 URL、Token、网络  |
| Pages 上接口 404            | 静态构建已剔除 BFF                                        | 预期行为；使用 Node 部署启用 BFF                                     |
| 本地 dev 页面反复刷新/panic | dev 与 build 共用 `.next`                                 | 确认 `pnpm dev` 使用 `.next-dev`；不要覆盖 `NEXT_DIST_DIR`           |
| 静态构建找不到 API 路由     | `GITHUB_PAGES=true` 下 `route.server.ts` 被忽略           | 预期行为                                                             |

查看日志：

```bash
# systemd
journalctl -u agentic-payment -f

# 容器
docker logs -f <container>
```

建议在网关层监控：

- `/api/agent/plan` 的 4xx/5xx 与耗时
- `/api/mcp/tool` 的 5xx、超时与错误码
- LLM provider 的 401/429

## 9. 安全要求

1. 所有密钥只放在服务端环境或密钥管理系统中，禁止提交到仓库。
2. 严禁使用 `NEXT_PUBLIC_` 前缀承载密钥。
3. MCP 服务应部署在内网或受控网络，使用 TLS 与 Bearer Token。
4. 为 LLM 与 MCP 设置独立的最小权限密钥，并定期轮换。
5. 不要记录完整请求头、密钥或用户隐私字段。
6. 演示环境仍需保留 “Mock Data Only / mock runtime” 标识。
7. 对外暴露的 Node 服务必须启用 HTTPS、访问控制与限流。

## 10. 变更与回滚

- Node 部署：回滚到上一镜像或上一 commit，保持环境变量不变后重新构建。
- GitHub Pages：在 Actions 中选择历史成功 run 重新部署，或 revert 后重新 push。
- 配置回滚：删除无效的 LLM/MCP 变量即可恢复确定性计划与 mock MCP，不影响主流程。
- 模型切换：优先通过 `AGENT_LLM_PROVIDER` 或 `AGENT_LLM_MODEL` 灰度；无需改代码。

## 11. 上线检查清单

- [ ] Node 22 / pnpm 10.12.1
- [ ] `.env` / 密钥管理系统已注入服务端变量
- [ ] 未把任何密钥写入 `NEXT_PUBLIC_*`
- [ ] LLM provider、模型、Base URL、区域匹配
- [ ] CRB MCP 与 RWA MCP 的地址、Token、证书与网络连通性已分别验证
- [ ] `/`、`/api/agent/plan`、`/api/mcp/tool` 健康检查通过
- [ ] 大额审批、小额自动支付、落地页/收款凭证流程已人工走查
- [ ] Pages：Source = GitHub Actions，`/payfi-marketing` 访问正常
- [ ] 日志与告警已接入，密钥轮换周期已登记
