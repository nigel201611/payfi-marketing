import { site } from '@/constants/site';

export type Locale = 'en' | 'zh';

const en = {
  common: {
    skipToContent: 'Skip to content',
    home: 'Home',
    close: 'Close',
    agentWallet: 'Agent Wallet',
    beta: 'Beta',
    explore: 'Explore',
    exio: 'EX.IO',
    opensInNewTab: 'opens in a new tab',
    theme: {
      label: 'Theme',
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
      light: 'Light',
      dark: 'Dark',
    },
    language: {
      label: 'Language',
      switch: 'Switch to Chinese',
      display: '中文',
    },
  },
  nav: {
    items: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Approvals', href: '#control' },
      { label: 'Get started', href: '#developers' },
      { label: 'Coming soon', href: '#waitlist' },
    ],
    forBusinesses: 'For businesses',
    signIn: 'Sign in',
    joinWaitlist: 'Join waitlist',
    joinTheWaitlist: 'Join the waitlist',
    openMenu: 'Open menu',
  },
  hero: {
    badge: 'Private beta · UAE',
    title: [
      { text: 'Give your', gradient: false },
      { text: 'agent a wallet', gradient: false },
      { text: 'you control.', gradient: true },
    ],
    description:
      'AI agents can book, buy, and settle on your behalf — never without your say. Set the rules, approve in real time, and keep every purchase on the record.',
    primaryCta: 'Join the waitlist',
    secondaryCta: 'See how it works',
    betaNote: 'Private beta in the UAE · Expanding globally',
    trust: {
      approvals: 'Passkey approvals',
      credentials: 'One-time credentials',
      audit: 'Full audit trail',
    },
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'A wallet with guardrails, not a blank check.',
    description:
      'Every agent gets its own scoped wallet. You decide what it can spend, where, and when — with a record of everything it tries.',
    cards: [
      {
        label: 'Agent payments',
        title: 'Real-time spend approvals',
        description:
          'Agents ask before they buy. Approve with Face ID or a passkey, and a one-time credential is issued for exactly that purchase.',
      },
      {
        label: 'History',
        title: 'Full purchase history',
        description:
          'Track every purchase your agent makes. One-time credentials keep things secure, and every attempt — approved or not — is logged.',
      },
      {
        label: 'Insights',
        title: 'Personal spending insights',
        description:
          'Connect accounts and cards to see spending trends, track budgets, and understand where your agent is saving you money.',
      },
      {
        label: 'Recommendations',
        title: 'Better recommendations',
        description:
          'Share purchase context with your agent so it can surface brands tailored to you — while you control exactly what is shared.',
      },
    ],
    seeControl: 'See the control layer',
    visuals: {
      approvals: {
        inbox: 'Approvals inbox',
        live: 'Live',
        request: 'Hermes wants to spend $180.00',
        meta: 'Triplo · The Eliza Hotel · 3 nights',
        decline: 'Decline',
        approve: 'Approve',
        passkey: 'Passkey',
        settledTitle: 'Cartsy · $17.99',
        settledMeta: 'One-time card ·· 1842',
        settledStatus: 'Approved',
      },
      history: {
        title: 'Payment history',
        month: 'Oct 2026',
        columns: ['Merchant', 'Amount', 'Status'],
        oneTime: 'one-time',
        statuses: { approved: 'Approved', settled: 'Settled' },
      },
      insights: {
        title: 'October spend',
        change: '−12%',
        categories: ['Travel', 'Dining', 'Software', 'Retail'],
        shared: 'Shared insight',
        messageBefore: 'Travel is ',
        messageHighlight: '18% below',
        messageAfter: ' your October average. Want me to hold the rest of the budget?',
        chips: ['Travel budget only', 'No card data'],
      },
      recommendations: {
        agent: 'Mira · shopping agent',
        agentMeta: 'Using shared purchase history',
        pill: 'Personalized',
        message:
          'For the black-tie wedding, here are three picks based on your recent orders at Cartsy.',
        products: [
          { name: 'Mira Studio', price: '$84' },
          { name: 'Cartsy Atelier', price: '$96' },
          { name: 'Lumen Edit', price: '$72' },
        ],
        chips: ['Purchase history', 'Cartsy', 'No card data'],
      },
    },
  },
  control: {
    eyebrow: 'The control layer',
    title: 'You set the rules. The agent does the work.',
    description:
      'Policies run before a payment ever reaches the network. If a request breaks a rule, it waits for you — and every decision is recorded.',
    features: [
      {
        title: 'Policy checks in milliseconds',
        description:
          'Merchant, amount, category, velocity, and budget limits are evaluated in real time, before any credential is issued.',
      },
      {
        title: 'One-time, single-merchant credentials',
        description:
          'Approved spend resolves to a single-use card or wallet address. Nothing reusable is ever exposed to the agent.',
      },
      {
        title: 'Revoke in one tap',
        description:
          'Freeze an agent, pause a budget, or lock the wallet instantly. Your agent is notified and the action is audited.',
      },
    ],
    footerNote: 'Every decision is logged. Every credential expires.',
    interactiveDemo: 'Interactive demo',
    demoHint: 'Approve or decline below',
    demoDisclaimer:
      'Illustrative approval flow. No payment is initiated and no data leaves your browser.',
    approval: {
      policyEngine: 'Policy engine',
      screened: 'Request screened in 184ms',
      wantsToSpend: 'wants to spend',
      role: 'Travel agent · verified identity',
      agent: 'Agent',
      awaitingYou: 'Awaiting you',
      approved: 'Approved',
      declined: 'Declined',
      policyChecks: 'Policy checks',
      checks: [
        { label: 'Merchant verified', detail: 'On your allowlist' },
        { label: 'Within per-transaction limit', detail: '$180 of $250' },
        { label: 'Monthly budget remaining', detail: '$620 of $800' },
        { label: 'Agent identity confirmed', detail: 'Passkey · 2 min ago' },
      ],
      decline: 'Decline',
      approve: 'Approve with passkey',
      approvedByYou: 'Approved by you',
      credentialIssued: 'A one-time credential was issued to {agent}. It expires in 15 minutes.',
      requestDeclined: 'Request declined',
      declinedNotice: '{agent} was notified. No credential was issued.',
      audit: 'Written to audit log · just now',
      reset: 'Reset demo',
      passkeys: 'Passkeys stored on device',
      item: 'The Eliza Hotel · 3 nights · Travel',
      srPending: 'Spend request pending your approval.',
      srApproved:
        'Approved. A one-time credential was issued to {agent} and the decision was written to your audit log.',
      srDeclined:
        'Declined. {agent} was notified and the request was recorded without issuing a credential.',
    },
  },
  developer: {
    eyebrow: 'How to get started',
    title: 'From prompt to payment in minutes.',
    description:
      'Drop the EX.IO wallet into any agent with our MCP server, CLI, or REST API. No custom checkout flow, no card data in your prompt.',
    steps: [
      {
        step: '01',
        title: 'Install the wallet',
        description: 'One command adds the EX.IO agent wallet to your runtime.',
      },
      {
        step: '02',
        title: 'Connect an agent',
        description: 'Pair an agent, attach a spending policy, choose an approval channel.',
      },
      {
        step: '03',
        title: 'Request and settle',
        description: 'We handle approval, credentials, settlement, and webhooks.',
      },
    ],
    waitlistCta: 'Join the waitlist',
    viewFeatures: 'View supported features',
    badgeFirstPayment: 'Sandbox to first approved payment in under 10 minutes',
    badgeMcp: 'Works with any MCP-compatible agent runtime',
    matrix: {
      title: 'Supported features',
      subtitle: 'Availability by surface',
      caption: 'Availability by surface. Interfaces are illustrative.',
      featureLabel: 'Feature',
      columns: ['MCP', 'CLI', 'REST API', 'Partner apps'],
      rows: [
        { feature: 'Agent payments', values: [true, true, true, true] },
        { feature: 'Spend approvals', values: [true, true, true, true] },
        { feature: 'Audit trail', values: [true, true, true, true] },
        { feature: 'Spending insights', values: [true, true, true, false] },
      ],
      supportedOn: 'Supported on {column}',
      notSupportedOn: 'Not supported on {column}',
    },
    code: {
      sandbox: 'Sandbox mode · no card data in prompts',
      version: 'v0.1 preview',
      copySnippet: 'Copy {label} snippet',
      copied: 'Snippet copied to clipboard.',
    },
  },
  comingSoon: {
    eyebrow: 'What’s next',
    title: 'The agent economy needs a wallet built for trust.',
    description: 'We’re working with design partners on the next generation of agentic payments.',
    cards: [
      {
        tag: 'In design',
        title: 'Granular agent controls',
        description:
          'Auto-approve rules, standing instructions, and per-merchant limits — so low-risk purchases just work.',
      },
      {
        tag: 'Coming soon',
        title: 'More payment methods',
        description:
          'Let agents pay with next-generation payment protocols and digital currencies — while you settle in the currency you need.',
      },
    ],
    cardFootnote: 'In design with our first partners',
    cta: {
      eyebrow: 'Private beta in the UAE · Expanding globally',
      title: 'Let your agent buy. Keep the last word.',
      description: 'Join the private beta and help shape the wallet layer for agentic commerce.',
      primary: 'Join the waitlist',
      secondary: 'Use EX.IO for your business',
      note: 'No card data shared with agents · Cancel anytime · Demo experience',
    },
  },
  waitlist: {
    title: 'Join the agent wallet waitlist',
    description: 'Private beta access is opening in the UAE first. Tell us where to reach you.',
    badge: 'Private beta',
    emailLabel: 'Work email',
    emailPlaceholder: 'you@company.com',
    companyLabel: 'Company',
    companyOptional: '(optional)',
    companyPlaceholder: 'Your team',
    submit: 'Join the private beta',
    joining: 'Joining…',
    invalidEmail: 'Enter a valid work email address.',
    successTitle: 'You’re on the list.',
    successDescription:
      'We’ll reach out when agent wallets open in your region. Keep an eye on your inbox.',
    done: 'Done',
    disclaimer: 'Demo experience — this form does not send or store your data.',
  },
  footer: {
    heading: 'Footer',
    tagline:
      'Digital-asset financial infrastructure, built for what’s next. Give your agent a wallet you control.',
    licensing: 'Licensing underway · Committed to compliance',
    copyright: 'All rights reserved.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Agent wallet', href: '#top', external: false },
          { label: 'Spend approvals', href: '#control', external: false },
          { label: 'Audit trail', href: '#how-it-works', external: false },
          { label: 'Insights', href: '#how-it-works', external: false },
        ],
      },
      {
        title: 'Developers',
        links: [
          { label: 'Quickstart', href: '#developers', external: false },
          { label: 'MCP server', href: '#developers', external: false },
          { label: 'API reference', href: '#developers', external: false },
          { label: 'Supported features', href: '#supported', external: false },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About EX.IO', href: site.external.exio, external: true },
          { label: 'Trade on EX.IO', href: site.external.trade, external: true },
          { label: 'Contact', href: site.external.exio, external: true },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms of use', href: site.external.exio, external: true },
          { label: 'Privacy policy', href: site.external.exio, external: true },
          { label: 'Risk disclosure', href: site.external.exio, external: true },
          { label: 'VA standard disclosure', href: site.external.exio, external: true },
        ],
      },
    ],
    disclaimer:
      'Concept experience for the EX.IO Agent Wallet. Product UI, metrics, customers, and integrations shown are illustrative, and no data leaves your browser. Private beta · UAE.',
  },
  walletMock: {
    figureLabel:
      'EX.IO agent wallet dashboard showing a total balance of $128,420, a pending $180 travel spend request from an AI agent, and a list of recent one-time card payments.',
    agentMode: 'Agent mode',
    totalBalance: 'Total balance',
    spendingThisMonth: 'Spending this month',
    budgetUsed: '68% of monthly budget',
    budgetLeft: '$516 left',
    spendRequests: 'Spend requests',
    pendingCount: '1 pending',
    wantsToSpend: 'Hermes wants to spend',
    requestMeta: 'Triplo · The Eliza Hotel',
    decline: 'Decline',
    approve: 'Approve',
    activities: [
      { name: 'Cartsy', meta: 'One-time card ·· 1842' },
      { name: 'Figma', meta: 'One-time card ·· 7741' },
      { name: 'Triplo', meta: 'Awaiting your approval' },
    ],
    agentInsight: 'Agent insight',
    live: 'Live',
    insightBefore: 'Travel spend is ',
    insightHighlight: '18% below',
    insightAfter: ' your October average. 2 approvals remaining this week.',
    shared: 'Shared with Hermes: travel budget only',
    passkeySession: 'Passkey session active',
    card: '•••• 4821 · USD',
    spendApproved: 'Spend approved',
    oneTimeCard: 'One-time card ·· 9081',
    neverSees: 'Agent never sees your card number',
    dates: ['Sep 20', 'Sep 28', 'Oct 06', 'Oct 14', 'Oct 19'],
  },
  notFound: {
    eyebrow: '404 · Off the ledger',
    title: 'This page isn’t part of the wallet.',
    description:
      'The link may have moved, or the agent wandered somewhere it shouldn’t. Let’s get you back to safety.',
    back: 'Back to home',
  },
};

export type Messages = typeof en;

const zh: Messages = {
  common: {
    skipToContent: '跳到主要内容',
    home: '首页',
    close: '关闭',
    agentWallet: 'Agent 钱包',
    beta: '内测',
    explore: '浏览',
    exio: 'EX.IO',
    opensInNewTab: '在新标签页打开',
    theme: {
      label: '主题',
      switchToLight: '切换到浅色主题',
      switchToDark: '切换到深色主题',
      light: '浅色',
      dark: '深色',
    },
    language: {
      label: '语言',
      switch: '切换到英文',
      display: 'EN',
    },
  },
  nav: {
    items: [
      { label: '如何运作', href: '#how-it-works' },
      { label: '审批', href: '#control' },
      { label: '快速接入', href: '#developers' },
      { label: '即将推出', href: '#waitlist' },
    ],
    forBusinesses: '企业服务',
    signIn: '登录',
    joinWaitlist: '加入等待名单',
    joinTheWaitlist: '加入等待名单',
    openMenu: '打开菜单',
  },
  hero: {
    badge: '内测 · 阿联酋',
    title: [
      { text: '给你的 Agent', gradient: false },
      { text: '一个由你掌控的钱包。', gradient: true },
    ],
    description:
      '让 AI Agent 代你预订、购买和结算——但每一次都要经过你的允许。设定规则、实时审批，并保留完整记录。',
    primaryCta: '加入等待名单',
    secondaryCta: '了解如何运作',
    betaNote: '阿联酋内测 · 即将全球开放',
    trust: {
      approvals: 'Passkey 审批',
      credentials: '一次性凭证',
      audit: '完整审计记录',
    },
  },
  howItWorks: {
    eyebrow: '如何运作',
    title: '给钱包加上护栏，而不是一张空白支票。',
    description:
      '每个 Agent 都拥有独立的受限钱包。你决定它能花多少、在哪里花、什么时候花——并记录它尝试做的一切。',
    cards: [
      {
        label: 'Agent 支付',
        title: '实时消费审批',
        description:
          'Agent 在购买前会先询问。你用 Face ID 或 Passkey 批准后，系统才会为该笔交易签发一次性凭证。',
      },
      {
        label: '记录',
        title: '完整购买历史',
        description:
          '追踪 Agent 的每一笔购买。一次性凭证保障安全，每一次尝试——无论是否获批——都会被记录。',
      },
      {
        label: '洞察',
        title: '个人消费洞察',
        description: '连接账户与银行卡，查看消费趋势、跟踪预算，并了解 Agent 在哪些地方帮你省钱。',
      },
      {
        label: '推荐',
        title: '更懂你的推荐',
        description:
          '将购买上下文安全地分享给 Agent，让它为你推荐更合适的品牌——而你始终掌控哪些信息被分享。',
      },
    ],
    seeControl: '查看控制层',
    visuals: {
      approvals: {
        inbox: '审批收件箱',
        live: '实时',
        request: 'Hermes 希望支付 $180.00',
        meta: 'Triplo · The Eliza Hotel · 3 晚',
        decline: '拒绝',
        approve: '批准',
        passkey: 'Passkey',
        settledTitle: 'Cartsy · $17.99',
        settledMeta: '一次性卡 ·· 1842',
        settledStatus: '已批准',
      },
      history: {
        title: '支付历史',
        month: '2026 年 10 月',
        columns: ['商户', '金额', '状态'],
        oneTime: '一次性',
        statuses: { approved: '已批准', settled: '已结算' },
      },
      insights: {
        title: '10 月支出',
        change: '−12%',
        categories: ['旅行', '餐饮', '软件', '零售'],
        shared: '共享洞察',
        messageBefore: '旅行支出比 10 月平均',
        messageHighlight: '低 18%',
        messageAfter: '。需要我把剩余预算预留出来吗？',
        chips: ['仅共享旅行预算', '不共享卡号'],
      },
      recommendations: {
        agent: 'Mira · 购物 Agent',
        agentMeta: '使用共享的购买历史',
        pill: '个性化',
        message: '为了这场黑领结婚礼，我根据你最近在 Cartsy 的订单挑了三件。',
        products: [
          { name: 'Mira Studio', price: '$84' },
          { name: 'Cartsy Atelier', price: '$96' },
          { name: 'Lumen Edit', price: '$72' },
        ],
        chips: ['购买历史', 'Cartsy', '不共享卡号'],
      },
    },
  },
  control: {
    eyebrow: '控制层',
    title: '规则由你设定，执行交给 Agent。',
    description:
      '每笔支付在到达网络之前都会先经过策略检查。如果请求违反规则，它会等待你的决定——所有决策都有记录。',
    features: [
      {
        title: '毫秒级策略检查',
        description: '商户、金额、类别、频率和预算限制都会实时评估，然后才签发凭证。',
      },
      {
        title: '一次性、限定商户的凭证',
        description: '获批的消费会生成一次性卡号或钱包地址，Agent 永远接触不到可复用凭证。',
      },
      {
        title: '一键撤销',
        description: '立即冻结 Agent、暂停预算或锁定钱包。系统会通知 Agent，并记录该操作。',
      },
    ],
    footerNote: '每个决策都有记录，每个凭证都会过期。',
    interactiveDemo: '交互演示',
    demoHint: '在下方批准或拒绝',
    demoDisclaimer: '审批流程仅为示意。不会发起真实支付，数据也不会离开你的浏览器。',
    approval: {
      policyEngine: '策略引擎',
      screened: '请求已筛查 · 184ms',
      wantsToSpend: '希望支付',
      role: '旅行 Agent · 身份已验证',
      agent: 'Agent',
      awaitingYou: '等待你审批',
      approved: '已批准',
      declined: '已拒绝',
      policyChecks: '策略检查',
      checks: [
        { label: '商户已验证', detail: '在你的允许名单中' },
        { label: '在单笔限额内', detail: '$180 / $250' },
        { label: '月度预算余额', detail: '$620 / $800' },
        { label: 'Agent 身份已确认', detail: 'Passkey · 2 分钟前' },
      ],
      decline: '拒绝',
      approve: '使用 Passkey 批准',
      approvedByYou: '已由你批准',
      credentialIssued: '已向 {agent} 签发一次性凭证，15 分钟后失效。',
      requestDeclined: '请求已拒绝',
      declinedNotice: '已通知 {agent}，未签发凭证。',
      audit: '已写入审计日志 · 刚刚',
      reset: '重置演示',
      passkeys: 'Passkeys 存储于设备',
      item: 'The Eliza Hotel · 3 晚 · 旅行',
      srPending: '消费请求正在等待你的审批。',
      srApproved: '已批准。系统已向 {agent} 签发一次性凭证，并写入审计日志。',
      srDeclined: '已拒绝。已通知 {agent}，请求已记录且未签发凭证。',
    },
  },
  developer: {
    eyebrow: '快速接入',
    title: '从对话到支付，只需几分钟。',
    description:
      '通过 MCP Server、CLI 或 REST API，将 EX.IO 钱包接入任意 Agent。无需自定义结账流程，prompt 中也不会出现卡号。',
    steps: [
      {
        step: '01',
        title: '安装钱包',
        description: '一条命令，将 EX.IO Agent 钱包加入你的运行时。',
      },
      {
        step: '02',
        title: '连接 Agent',
        description: '绑定 Agent、设置消费策略并选择审批渠道。',
      },
      {
        step: '03',
        title: '发起请求并结算',
        description: '审批、凭证、结算和 Webhook 都交给我们。',
      },
    ],
    waitlistCta: '加入等待名单',
    viewFeatures: '查看支持的功能',
    badgeFirstPayment: '从沙盒到首笔获批支付，不到 10 分钟',
    badgeMcp: '适配任何兼容 MCP 的 Agent 运行时',
    matrix: {
      title: '支持的功能',
      subtitle: '按接入方式',
      caption: '按接入方式列出可用性，界面仅为示意。',
      featureLabel: '功能',
      columns: ['MCP', 'CLI', 'REST API', '合作方应用'],
      rows: [
        { feature: 'Agent 支付', values: [true, true, true, true] },
        { feature: '消费审批', values: [true, true, true, true] },
        { feature: '审计记录', values: [true, true, true, true] },
        { feature: '消费洞察', values: [true, true, true, false] },
      ],
      supportedOn: '支持：{column}',
      notSupportedOn: '不支持：{column}',
    },
    code: {
      sandbox: '沙盒模式 · prompt 中不含卡号',
      version: 'v0.1 preview',
      copySnippet: '复制 {label} 代码片段',
      copied: '代码片段已复制。',
    },
  },
  comingSoon: {
    eyebrow: '即将推出',
    title: 'Agent 经济需要一个值得信任的钱包。',
    description: '我们正与设计合作伙伴一起打造下一代 Agentic 支付。',
    cards: [
      {
        tag: '设计中',
        title: '细粒度的 Agent 控制',
        description: '自动批准规则、长期指令和单商户限额——让低风险消费自动完成。',
      },
      {
        tag: '即将推出',
        title: '更多支付方式',
        description: '让 Agent 使用下一代支付协议和数字货币付款，同时以你需要的货币结算。',
      },
    ],
    cardFootnote: '正与首批合作伙伴共同设计',
    cta: {
      eyebrow: '阿联酋内测 · 即将全球开放',
      title: '让你的 Agent 放心买，最终决定权仍在你。',
      description: '加入内测，参与塑造 Agentic 商业时代的钱包层。',
      primary: '加入等待名单',
      secondary: '企业合作',
      note: 'Agent 不会看到你的卡号 · 随时取消 · 演示体验',
    },
  },
  waitlist: {
    title: '加入 Agent 钱包等待名单',
    description: '内测将率先在阿联酋开放。留下联系方式，我们会与你联系。',
    badge: '内测',
    emailLabel: '工作邮箱',
    emailPlaceholder: 'you@company.com',
    companyLabel: '公司',
    companyOptional: '（选填）',
    companyPlaceholder: '你的团队',
    submit: '加入内测',
    joining: '加入中…',
    invalidEmail: '请输入有效的工作邮箱。',
    successTitle: '已加入名单。',
    successDescription: '当 Agent 钱包在你所在地区开放时，我们会通过邮件联系你。',
    done: '完成',
    disclaimer: '演示体验——此表单不会发送或存储你的数据。',
  },
  footer: {
    heading: '页脚',
    tagline: '面向未来的数字资产金融基础设施。让你的 Agent 拥有一个由你掌控的钱包。',
    licensing: '牌照申请中 · 坚持合规',
    copyright: '保留所有权利。',
    columns: [
      {
        title: '产品',
        links: [
          { label: 'Agent 钱包', href: '#top', external: false },
          { label: '消费审批', href: '#control', external: false },
          { label: '审计记录', href: '#how-it-works', external: false },
          { label: '洞察', href: '#how-it-works', external: false },
        ],
      },
      {
        title: '开发者',
        links: [
          { label: '快速开始', href: '#developers', external: false },
          { label: 'MCP Server', href: '#developers', external: false },
          { label: 'API 文档', href: '#developers', external: false },
          { label: '支持的功能', href: '#supported', external: false },
        ],
      },
      {
        title: '公司',
        links: [
          { label: '关于 EX.IO', href: site.external.exio, external: true },
          { label: '在 EX.IO 交易', href: site.external.trade, external: true },
          { label: '联系我们', href: site.external.exio, external: true },
        ],
      },
      {
        title: '法律',
        links: [
          { label: '使用条款', href: site.external.exio, external: true },
          { label: '隐私政策', href: site.external.exio, external: true },
          { label: '风险披露', href: site.external.exio, external: true },
          { label: '虚拟资产标准披露', href: site.external.exio, external: true },
        ],
      },
    ],
    disclaimer:
      'EX.IO Agent Wallet 概念体验。展示的产品界面、指标、客户与集成都仅为示意，数据不会离开你的浏览器。内测 · 阿联酋。',
  },
  walletMock: {
    figureLabel:
      'EX.IO Agent 钱包仪表盘，展示总余额 $128,420、一笔等待审批的 $180 旅行消费请求，以及最近的卡支付记录。',
    agentMode: 'Agent 模式',
    totalBalance: '总余额',
    spendingThisMonth: '本月支出',
    budgetUsed: '月度预算已用 68%',
    budgetLeft: '剩余 $516',
    spendRequests: '消费请求',
    pendingCount: '1 条待处理',
    wantsToSpend: 'Hermes 希望支付',
    requestMeta: 'Triplo · The Eliza Hotel',
    decline: '拒绝',
    approve: '批准',
    activities: [
      { name: 'Cartsy', meta: '一次性卡 ·· 1842' },
      { name: 'Figma', meta: '一次性卡 ·· 7741' },
      { name: 'Triplo', meta: '等待你的批准' },
    ],
    agentInsight: 'Agent 洞察',
    live: '实时',
    insightBefore: '旅行支出比 10 月平均',
    insightHighlight: '低 18%',
    insightAfter: '，本周还剩 2 次审批。',
    shared: '已与 Hermes 共享：仅旅行预算',
    passkeySession: 'Passkey 会话已激活',
    card: '•••• 4821 · USD',
    spendApproved: '消费已批准',
    oneTimeCard: '一次性卡 ·· 9081',
    neverSees: 'Agent 永远看不到你的卡号',
    dates: ['9 月 20 日', '9 月 28 日', '10 月 06 日', '10 月 14 日', '10 月 19 日'],
  },
  notFound: {
    eyebrow: '404 · 账本之外',
    title: '这个页面不属于钱包。',
    description: '链接可能已移动，或者你的 Agent 走错了地方。我们带你回到安全区域。',
    back: '返回首页',
  },
};

export const messages: Record<Locale, Messages> = { en, zh };

export function formatMessage(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
