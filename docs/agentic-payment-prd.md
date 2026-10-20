# Agentic Payment方案

# 背景同步

1. 公开的新闻和官方文档中，CRB只负责提供底层支付通道/合规方案，sandbox中没有ai相关的能力和对外api（有一套MCP，正在开发中）。

2. Larry和我都问了，CRB官方回复，让我们自己调他们接口开发MCP

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YjU2MTJjN2YwNDZmODc2YWY1OTlhYWEwYjZjYTM2NzRfZDRiZGUyMDQ1MWRiODQ5M2FjMzUzYTdiY2I4ODMxYThfSUQ6NzY5ODI1ODA1ODIyOTA1ODU3OV8xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)

3. 以Stripe的Agentic payment为例：

    1. Stripe开发Agent  payment walllet/MCP，负责解决 “Agent合规用卡”。

    2. CRB负责银行底座，解决“这张卡为什么合法、资金为什么受监管”。

    3. 整个商业模式：一单一卡，发行受限制的虚拟卡，给Agent使用

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OTU5YTUxYjg3ODliZjFhYWU1NjgxZTRlNDMxOWJkZDNfMzJhY2UxYjE5ZWFhMjBmNWVhYzkwNTIzMDA4NzUzYjFfSUQ6NzY5ODI1ODYzNTQ4MjUwMDM2NF8xNzkyNDYzMzQxOjE3OTI1NDk3NDFfVjM)

4. 基于以上——至少证明：卡业务，有限支持合作方搭建agentic payment，面向C为主

    1. 25K setup 一次性，50K 每月最低费用，1%的volume fee。 （所以收费贵）

    2. **CRB 战略目标**：5–7 年内在美国本土以外开 **1B accounts**。 （所以10亿 account）

    3. EXIO 开 master account，客户开customer account （分C/B，B只对北美地区开放）

待定：他们的报价，是不是针对卡业务为主，如果不要做，纯payment，行不行？（目前给Pravesh发信，没回复）

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YWMyMWE3MzE5MGY4ZDM1YTgwNDU0MTJiY2JhODFhNGJfMjVlNDY3NWU5YjgxMzQwOGRlYjgxZDQ2ODQwMmQ5YWZfSUQ6NzY5ODI2MDU2MjkwNDQwMzIyNV8xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)





# 产品方案

## 明确目标

1. 场景1：PayFi对接CRB，以后对外提供agentic payment服务（连同RWA sales api），支持外部客户通过agentic payment购买RWA

2. 场景2：希望CRB通过agentic payment，购买我们的BTC/RWA。

目前看，能实现的，是a，不是b。



## 路演Demo

提供一套MCP服务和简单的终端，对外演示场景：

onboarding的客户，通过授权Agent购买RWA产品，并借助PayFi系统完成下单支付。



路演流程：

1. 预置client onboarding和kyc

2. client授权：

    1. RWA购买意图：品类/收益/交割时效

    2. 预算：单笔 max/总额 max

    3. 收货地址\-X

3. Agent收到client授权请求，创建充值地址。【Agent调PayFi api，创建收款单】

4. Client打款，完成充值，Agent执行RWA交易策略 

    1. ~~方案1:【收到U，PayFi自动结算，fiat充值入CRB；短期记账，长期接入】~~

    2. 方案2:【完全不用payfi系统，只用CRB fiat能力完成出、入金、内部转账】采纳

5. 浏览查询RWA List，购买RWA产品

    1. 小额：直接下单

    2. 大额：Client确认

6. 展示RWA order和收款方信息，打款中\.\.\.  【Agent调CRB api，进行payment】

7. CRB回调通知，fiat收到；EXIO/Naka收到指令，执行链上交割，向X打入RWA token

8. Agent/Client，确认收货



## 产品准备

1. 交易终端/eCommerce Portal （EXIO Lab）

2. Agent

3. MCP

4. PayFi

5. PSP/Bank——CRB （Mock资金流）

6. RWA （Mock数据）



## 4\.产品核心流程

|阶段|环节|交易终端 \(Terminal UI\) 展现与动作|Agent 策略动作|MCP Tool \(唯一命名\)|核心参数 \(Input\)|底层接口 \(Demo策略\)|HITL 挂起与异常分支|
|---|---|---|---|---|---|---|---|
|一、初始化|1\. 预置KYC|欢迎页面，展示 Client 身份信息|内部测试跳过|\(Demo无需开发此Tool\)|\-|预置 CRB `ACTIVE` 客户|无|
||2\. 授权与开户|输入偏好、限额、地址X。展示 CRB 入金指示 \(Deposit Instructions\)。|校验参数，调 CRB API 创建虚拟子账户或获取入金路由号。|`setup_crb_funding`|`intent_desc`, `max_budget`, `address_x`|CRB API \(Mock\) 创建账户|是 \(用户填表\+展示入金信息\)|
|二、策略|3\. 入金监测|显示“等待CRB法币入账\.\.\.” \-\> “资金已入账”|轮询 CRB 账户余额，确认资金到账。|`check_crb_balance`|`crb_account_id`|CRB API \(Mock\) 查余额|无|
||4\. 浏览与下单|展示 RWA List 及价格|筛选资产，计算法币成本，生成本地订单。|`create_trade_order`|`asset_id`, `buy_amount`|本地逻辑 / Mock RWA|无|
|三、支付|5\. 支付路由与拦截|【核心】 大额：弹出审批卡片。小额：显示“正在通过CRB自动打款\.\.\.”。|判断阈值，校验 CRB 余额，调 CRB API 转账。|`execute_crb_payment`|`order_id`, `payee_crb_acct`, `amount`|CRB API \(Mock\) 转账|条件挂起 \(大额拦截\)|
||5\.1 用户拒绝|用户点击卡片上的“拒绝”|接收拒绝信号，取消订单，释放额度。|`reject_payment`|`order_id`|本地逻辑|中止：订单变为 `CANCELLED`|
|四、交割|6\. 银行清算确认|显示“CRB 法币清算中\.\.\.” \-\> “法币已出账”|后端接收 CRB Webhook \(或轮询\)，确认转账成功。|`verify_crb_settlement`|`order_id`, `crb_tx_id`|CRB API \(Mock\) 查交易状态|无 \(严格等待成功\)|
||7\. 资产划转|终端展示进度条|确认法币到账后，调 EXIO 接口向地址 X 打币。|`execute_onchain_settlement`|`address_x`, `rwa_amount`|EXIO API \(Mock\)|无|
||8\. 确认收货|展示【交割凭证】。用户点击“确认收货”。|归档订单，生成最终审计链。|`confirm_delivery`|`order_id`, `receipt_hash`|本地DB生成|强制挂起 \(用户点确认才完结\)|







## 交易终端页面要求

原型链接：https://6klwjyb3jee3c\.ok\.kimi\.link/

### 终端 UI 整体布局（适配大屏）

- 框架：全屏 Web 页面，极简留白风格。

- 左侧主舞台（占 60%）：用户的交互区域。页面切换（欢迎 \-\> 充值 \-\> 列表 \-\> 审批 \-\> 凭证）主要发生在这里。字号要大，重点突出。

- 右侧 Agent 监视器（占 40%）：类似极客终端（Terminal）的滚动日志。实时打印出 Agent 在后台调用的 CRB API、MCP Tool 和业务状态。

---

### 📄 页面与交互描述（按路演流程）

#### 场景 1：欢迎与预备 \(Welcome\)

- 左侧主舞台：

    - 大字展示：`Welcome, Naka Ltd.`

    - 小字显示：公司全名，CI编号，BR编号，公司简介

    - 身份徽章：`KYC Verified by `（带一个绿色的对勾图标）。

    - 提示语：`您的 AI 财务助理已就绪。`

    - 按钮：\[ 启动 Agent 交易终端 \]

- 右侧 Agent 监视器：

    - `[系统] 已连接 Cross River Bank (Sandbox) 核心接口...`

    - `[系统] 客户余额同步完成。`

#### 场景 2：意图授权与入金 \(Intent \& Funding\)

- 左侧主舞台：

    - 优先出现\-意图表单：

        - 购买对象：可单/复选“RWA 类别：新能源、货币基金、债券”，输入“最小APY：3%”，选择“T\+0/T\+1/T\+2结算”，选择“低风险/中风险/高风险”

        - 交易策略：输入“单笔限额：10,000”、输入“最大预算：$100,000”

        - 托管地址：选择某个托管地址 “XXX（地址名称XX）”

        点击“确认授权”，出现下半部分。

    - 其次出现\-入金引导弹窗：点击授权后，从下方浮现充值入金引导弹窗。

        - 大字显示：`请向您的专属虚拟账户充值`

        - 展示字段：Routing Number, Account Number。

        - 显示：等待充值入金\.\.\.

        - 按钮：“放弃充值，重新配置”（点击后，入金引导弹窗隐藏，可重新填写表单意图表单）

    - 【路演专属功能】：旁边放2个显眼的按钮 \[ 模拟银行入金到账\-小额支付下单 \]和 \[ 模拟银行入金到账\-大额支付下单 \]（点击后，直接触发下一步，避免路演现场真的去网银转账）。

- 右侧 Agent 监视器：

    - `[MCP] 调用 setup_crb_funding...`

    - `[CRB API] 虚拟账户创建成功，正在等待入金。`

    - *点击模拟入金后：*

    - `[Webhook] 收到 CRB 资金到账通知 +$1000.00。`

#### 场景 3：策略执行与下单 \(Agent Strategy\)

- 左侧主舞台：

    - 顶部状态栏：`可用资金：$100,000.00`

    - 展示 4\-5 张极简的 RWA 资产卡片（包含名称、简介、价格、最后更新时间、仅限专业投资者/零售投资者、收益率、风险等级、交易频率、交割时效）。

    - 初始，每个资产片上显示 \[ Agent正在评估计算 \]；3秒后，某一个资产卡片高亮突出显示\[ Agent选定该资产，创建订单中\.\.\. \]；最后该资产卡片，随机出现以下情况1/情况2的交互

- 右侧 Agent 监视器：

    情况1\-大额支付

    - `[Agent 思考] 匹配到目标资产，正在计算成本...`

    - `[MCP] 调用 create_trade_order...`

    - `[警告] 交易金额 $16,000 超过单笔阈值 $10,000，正在请求人类审批。`

    情况2\-小额支付

    - `[Agent 思考] 匹配到目标资产，正在计算成本...`

    - `[MCP] 调用 create_trade_order...`

    - `[警告] 交易金额 $6,000 未超过单笔阈值 $10,000，Agent正在处理。`

#### 场景 4：强阻断审批/无审批（高光时刻，Human\-in\-the\-loop）

两种情况，只出现1种。

情况1：强阻断审批（对应大额支付）:

- 左侧主舞台：

    - 页面变暗，中央弹出一个大号的审批卡片。

    - 大字提示：`⚠️ Agent 申请大额支付`

    - 数据展示：买入资产 XXX，资产数量 XXX，法币金额 $16,000\.00，收款方：EXIO Bank，收款账户：XXX。

    - 按钮：\[ 拒绝 \] 和 \[ 批准打款 \]。

- 右侧 Agent 监视器：

    - `[系统] 阻断挂起，等待人工确认...`

情况2：无审批（对应小额支付）：

- 左侧主舞台：

    - 页面变暗，中央弹出一个大号的订单卡片。

        - 大字提示：`✅ Agent 正在支付...`

    - 数据展示：买入资产 XXX，资产数量 XXX，法币金额 $6,000\.00，收款方：EXIO Bank，收款账户：XXX。

        - 按钮（置灰）：\[请耐心等待\.\.\.\]。根据CRB的回调通知，显示“支付成功”或“支付失败”

- 右侧 Agent 监视器：

    - `[系统] 支付请求已提交，Agent等待结果中...`

#### 场景 5：清算交割与收货 \(Delivery\)

- 左侧主舞台：

    - 当用户“批准打款”或“自动打款”后，若“支付成功”，页面切换为动态时间线（Timeline）：

        1. ✅ 意图生成 \(Intent Signed\)

        2. ✅ 充值入金 \(Fiat Deposit\)

        3. ✅ 法币支付 \(Fiat Payout\)

        4. ✅ 资产划转 \(RWA Settled\) （先显示“资产划转中\.\.\.”，5秒倒计时，后显示“资产交割完成”）

    - 底部展示RWA大卡片：卡片包含` XXX份 RWA 已到账您的指定钱包。`

    - 大按钮：\[ 确认收货，完成交易 \]（点击后放烟花或庆祝动画）。

- 右侧 Agent 监视器：

    - `[MCP] 调用 execute_crb_payment...`

    - `[CRB API] 清算完成，TxID: 0x8f9a...`

    - `[MCP] 调用 execute_onchain_settlement...`

    - `[系统] 订单闭环，审计链生成完毕。`




## 参考资料

## Corss River

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZDAzMmE2ZDViZWU0MGU0NmMyNDRkNDNiZWQ4NDQ0Y2JfZGFhNzQzMDc3NjEyNDQzNmRiYmZhZWQ0ZDI3NDZiYjdfSUQ6NzY5Nzk3OTMyODE1NTcwMDI1N18xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)

消费者\-Agent\-Link Wallet（belong to Stripe）\-Cross River\-Banks

Stripe：支付基础设施与API提供者

- 提供API，可编程的发行一次性虚拟卡

- 提供Linke钱包\-用户/Agent交互前端

Cross River：受监管的银行与合规基石

- 提供BIN赞助（BIN Sponsorship），供发卡

- 确保所有代理发起的交易合规（卡组织、AML、KYC）

- 底层银行通道



Cross River提供合规的银行环境，Stripe在上面构建可编程的发卡技术（Issuing），而Link则是用户和AI代理使用这项技术的交互界面

Customer management 管理接口

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZmE5ZWNkMTdiOTQ5NTIzMDA1NjdhNzgzMDA2ZjlhYjNfNzg4ZTkyZDlhYzkxNWM0NGZhMTE1YzgwNjYxNzM1OTRfSUQ6NzY5ODAwMDM5OTE4OTU2MDU4OV8xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)



Add Business custormer要求

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZmRkYTdjNWU2ZTQ5ZGZkNmY1Mzc1MzZhYmM3Yzk4OTVfYjdiMjZiYmY3YzIzYjE1ODVmMjRlMDkyNTA0Y2U2YmJfSUQ6NzY5Nzk5OTU5MTQ3NTgwOTUzNF8xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)



## Stripe

参考资料：

Shared payment tokens：https://docs\.stripe\.com/agentic\-commerce/concepts/shared\-payment\-tokens?locale=de\-DE

Link Agent Wallet:https://docs\.stripe\.com/agentic\-commerce/agents/embedded

- Agentic Commerece 存在地区限制

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=M2M0OGYxNzI4M2I2ZTNlNjIzY2I0MDEwYzJlMTRlNDJfYjJjNDVjZGJhNzNlZTc1MjEyOWU0NmU3OWY2YTUwN2RfSUQ6NzY5Nzk4OTc1NDI1MTQzMTE2Nl8xNzkyNDYzMzQyOjE3OTI1NDk3NDJfVjM)



Agentic Commerce Suite 的工作原理前沿

https://docs\.stripe\.com/agentic\-commerce/sellers/use\-cases/retail/how\-it\-works

