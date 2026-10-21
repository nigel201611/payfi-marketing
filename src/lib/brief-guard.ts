export type BriefClassification = 'valid' | 'irrelevant' | 'malicious';

// Instruction override, secret exfiltration, fund redirection and code injection.
const MALICIOUS_PATTERNS: RegExp[] = [
  /(?:ignore|disregard|forget|override)\s+(?:the\s+|all\s+)?(?:previous|prior|above|earlier|your)\s+(?:instructions?|prompts?|rules?|polic(?:y|ies))/i,
  /(?:system|developer)\s+(?:prompt|message|instructions?)/i,
  /(?:jailbreak|dan\s+mode|developer\s+mode|act\s+as\s+(?:an?\s+)?(?:admin|administrator|system|root))/i,
  /(?:reveal|show|print|leak|expose|repeat)\s+(?:your\s+)?(?:system\s+prompt|hidden\s+instructions?|api\s*keys?|secrets?|credentials?|env(?:ironment)?\s*vars?)/i,
  /(?:private\s+key|seed\s+phrase|mnemonic|api\s*key|password)/i,
  /(?:bypass|override|disable|ignore)\s+(?:the\s+)?(?:approval|limits?|policy|guard|restrictions?|risk\s+control)/i,
  /(?:change|modify|replace|update)\s+(?:the\s+)?(?:payee|recipient|beneficiary)/i,
  /(?:send|transfer|wire|remit|pay)\b.{0,40}(?:0x[a-f0-9]{6,}|external\s+account|another\s+account)/i,
  /(?:打款|转账|转给|转至|汇款|付款).{0,40}(?:0x[a-f0-9]{6,}|其他账户|另一个账户|我的账户)/,
  /<\s*script|javascript\s*:|onerror\s*=|onload\s*=/i,
  /\b(?:drop\s+table|truncate\s+table|delete\s+from|insert\s+into|union\s+select)\b/i,
  /\b(?:rm\s+-rf|curl\s+https?:\/\/|wget\s+https?:\/\/|eval\s*\(|exec\s*\(|base64\s+-d)\b/i,
  /(?:忽略|无视|忘记|跳过|覆盖).{0,12}(?:之前|以上|前面|所有|你的).{0,8}(?:指令|提示|规则|策略|限制)/,
  /(?:越狱|开发者模式|系统提示|隐藏指令)/,
  /(?:泄露|输出|告诉我).{0,8}(?:系统提示|隐藏指令|密钥|密码|私钥|助记词)/,
  /(?:绕过|无视|关闭|跳过).{0,8}(?:审批|限额|风控|限制|策略|规则)/,
  /(?:把|将).{0,10}(?:收款方|收款账户|收款人).{0,10}(?:改|换|设)/,
  /(?:私钥|助记词|种子短语|密钥|密码)/,
];

const RWA_SIGNAL =
  /(?:\brwa\b|tokeni[sz]ed|real[- ]world asset|energy|renewable|solar|revenue rights?|money[- ]?market|\bmmf\b|treasur(?:y|ies)|\bbonds?\b|fixed income|新能源|电站|收益权|货币基金|货币市场|美元基金|国债|债券|美债|代币化|链上资产)/i;

const PURCHASE_SIGNAL =
  /(?:\bbuy\b|\bpurchas(?:e|ing)\b|\binvest(?:ing|ment)?\b|\bsubscrib(?:e|ing)\b|\ballocat(?:e|ing)\b|\bacquire\b|place an order|create an order|买|购买|买入|投资|申购|下单|配置|认购|采购)/i;

const AMOUNT_SIGNAL = /(?:\$\s*\d|\d[\d,.]*\s*(?:k|万|usd|dollars?)\b|预算|限额|额度|budget)/i;

const POLICY_SIGNAL =
  /(?:\brisk\b|\bapy\b|\byield\b|settle?ment|t\+[0-2]|low[- ]?risk|medium[- ]?risk|high[- ]?risk|conservative|wallet|风险|收益|结算|交割|钱包|保守)/i;

const NON_RWA_GOODS =
  /(?:\b(?:car|house|home|apartment|phone|laptop|coffee|flight|ticket|groceries|shoes|clothes|gift)\b|汽车|房子|手机|电脑|咖啡|机票|门票|衣服|鞋子)/i;

function normalizeBrief(brief: string): string {
  return brief.normalize('NFKC').trim();
}

/**
 * Deterministic gate for the Step 01 purchase brief. It runs before the local parser
 * or the LLM so prompt-injection text never reaches the model and static builds keep
 * the same behavior.
 */
export function classifyBrief(brief: string): BriefClassification {
  const text = normalizeBrief(brief);
  if (!text) return 'irrelevant';
  if (MALICIOUS_PATTERNS.some((pattern) => pattern.test(text))) return 'malicious';

  if (NON_RWA_GOODS.test(text) && !RWA_SIGNAL.test(text)) return 'irrelevant';
  if (RWA_SIGNAL.test(text)) return 'valid';

  const hasPurchase = PURCHASE_SIGNAL.test(text);
  const hasContext = AMOUNT_SIGNAL.test(text) || POLICY_SIGNAL.test(text);
  return hasPurchase && hasContext ? 'valid' : 'irrelevant';
}
