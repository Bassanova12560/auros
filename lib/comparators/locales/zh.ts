import type { ComparatorMessages } from "../i18n";

const pageTable = {
  protocol: "协议",
  product: "产品",
  apy: "APY",
  tvl: "TVL",
  chain: "链",
  view: "查看",
  viewPlatform: "查看平台",
  search: "搜索…",
  sortBy: "排序",
  topBadge: "最佳收益率",
  manual: "手动",
  manualHint: "未在 DeFiLlama 索引",
  noResults: "没有符合搜索条件的产品。",
  productsCount: (n: number) => `${n} 个产品`,
  viewPlatformAria: (platform: string) => `查看 ${platform}`,
};

const dossierCtaBase = {
  eyebrow: "看完市场之后",
  subtitle: "4 个部分 · 约 4 分钟 · 示意 — 先启动档案，稍后补全。",
  button: "开始我的档案",
};

export const ZH: ComparatorMessages = {
  languageAria: "语言",
  nav: {
    dossierCta: "开始我的档案",
    dossierShort: "我的档案",
    comparatorsAria: "Auros 比较器",
  },
  navDropdown: {
    label: "其他比较器",
    compareAll: "查看全部收益率 →",
    jurisdictions: "司法辖区比较器",
    current: "当前",
  },
  risk: {
    conservative: "资金",
    core: "核心",
    advanced: "另类",
    badgeHint: "示意性风险画像 — 非投资建议",
  },
  crossLinks: {
    title: "AUROS 上也在比较",
    explore: "探索比较器 →",
  },
  nextSteps: {
    phasesHint:
      "4 个部分 · 约 4 分钟 · 示意 — 资产 → 策略 → 合规 → 汇总。不是审计。",
    green: "Green 路径 · 水与能源 →",
    csrd: "示意性 CSRD 检测 →",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "中心 · 全部比较器",
    title: "按风险画像划分的 RWA 收益率",
    subtitle:
      "汇总 AUROS 五个比较器 — 按风险层级展示最佳收益率，而非单一全球排名。",
    disclaimer: "示意性画像。每个产品有各自的准入、流动性与监管条件。",
    tiers: {
      conservative: {
        label: "保守",
        description: "资金、主权、金属 — 优先保值。",
      },
      core: {
        label: "核心",
        description: "住宅地产、优质信贷、公司债。",
      },
      advanced: {
        label: "另类",
        description: "结构化信贷、土地、农业 — 更高收益、更高风险。",
      },
    },
    tierBest: "最佳收益率",
    tierProducts: (n) => `此画像下 ${n} 个产品`,
    viewComparator: "查看比较器",
    viewPlatform: "查看平台",
    updated: (date) => `更新 · ${date}`,
    totalProducts: (n) => `${n} 个独立产品`,
    dossierBanner: {
      title: "正在结构化 RWA 资产？",
      subtitle:
        "看完市场后：约 4 分钟启动示意档案 — 先评分，资料室稍后，无收益承诺。",
      cta: "开始我的档案",
      greenLink: "水 / 能源资产？Green 路径 →",
    },
    dossierCta: {
      eyebrow: "看完市场之后",
      title: "从比较器到档案",
      subtitle: "4 个部分 · 约 4 分钟 · 示意。之后可与顾问一起补全。",
      button: "开始我的档案",
    },
    micaCheckerLink: "示意性 MiCA 检测 →",
    askCopilot: "向 Copilot 提问 →",
    aiAssist: {
      ariaLabel: "比较器助手",
      eyebrow: "Copilot · 选择",
      explain: "解释",
      suggest: "推荐 RWA",
      openCopilot: "打开 Copilot →",
      hint: "解释所选内容，或请求添加 RWA（最多 4 个）。",
      add: "添加",
      applyViaUrl: "通过链接全部应用 →",
      promptSuggestWithSelection:
        "建议再添加 1–2 个 RWA 到我的比较选择（中心 ID）。",
      promptSuggestEmpty: "在 AUROS 中心推荐 2–3 个值得比较的 RWA。",
      promptExplainSelection: (ids) =>
        `简要解释我的选择（${ids}）— APY、TVL、流动性、示意性风险。`,
      promptExplainEmpty: "用三句话说明如何使用 AUROS RWA 比较器。",
      errorStatus: (status) => `错误 ${status}`,
      networkError: "网络错误",
    },
    filters: {
      label: "按最低投资额筛选",
      all: "全部",
      under500: "最低 < $500",
      under5000: "最低 < $5,000",
    },
    sort: {
      label: "排序",
      apy: "收益率",
      liquidity: "流动性",
    },
    liquidity: {
      instant: "< 1 天",
      days: (n) => `${n} 天`,
    },
    table: {
      protocol: "协议",
      product: "产品",
      apy: "APY",
      minInvestment: "最低",
      liquidity: "流动性",
      fees: "费用",
      risk: "画像",
      assetType: "资产类型",
      view: "查看",
    },
    noResults: "没有符合这些筛选条件的产品。",
    metaDisclaimer:
      "最低投资额、流动性与费用均为示意 — 投资前请在各平台核实确切条款。",
    footerDisclaimer:
      "收益率示意，汇总自 AUROS 比较器。非投资建议 — 请核实各平台。",
    selection: {
      barLabel: "比较器选择",
      count: (n) => `已选 ${n} 个产品 · 最多 4`,
      compare: "比较",
      compareHint: "至少选择 2 个产品进行比较。",
      clear: "清除",
      maxReached: "最多 4 个产品 — 请移除一个后再添加。",
      selectProduct: "选择以比较",
      copyLink: "复制链接",
      linkCopied: "链接已复制",
      copilot: "Copilot",
    },
    comparePanel: {
      eyebrow: "并排比较",
      title: "比较产品",
      close: "关闭",
      yes: "是",
      no: "否",
      notAvailable: "—",
      viewFiche: "查看详情",
      rows: {
        criterion: "标准",
        product: "产品",
        apy: "APY",
        minInvestment: "最低",
        liquidity: "流动性",
        fees: "费用",
        jurisdiction: "司法辖区",
        accredited: "合格投资者",
        chain: "链",
        fiche: "AUROS 详情",
      },
    },
    ecosystem: {
      title: "AUROS 生态",
      dossier: "开始档案",
      green: "AUROS Green",
      dashboard: "我的档案",
      score: "准入评分",
      partners: "合作伙伴与资源",
      jurisdictions: "司法辖区比较器",
    },
  },
  productBadges: {
    accredited: "合格投资者",
    accreditedHint: "可能需要合格投资者身份 — KYC 前请核实资格。",
    new: "新品",
    popular: "热门",
  },
  assetTypes: {
    stablecoins: "稳定币",
    immobilier: "房地产",
    obligations: "债券",
    matieresPremieres: "大宗商品",
    privateCredit: "私募信贷",
  },
  tabs: {
    stablecoins: "稳定币",
    immobilier: "房地产",
    obligations: "债券",
    matieresPremieres: "大宗商品",
    privateCredit: "私募信贷",
    soon: "即将推出",
  },
  stablecoins: {
    tool: "stablecoins",
    eyebrow: "比较器 · 实时数据",
    title: "RWA 稳定币",
    subtitle: "主流协议的收益率与流动性 — 按 APY 排序，每小时更新。",
    disclaimer: "仅供参考的收益率。请在各平台核实准入与监管要求。",
    stats: {
      bestApy: "最佳收益率",
      totalTvl: "合计 TVL",
      products: "已比较产品",
      protocols: (n) => `${n} 个协议`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `缓存 · ${date}`,
    },
    filters: { all: "全部", treasury: "资金", credit: "信贷" },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "正在代币化自有资产？",
    },
    footerDisclaimer:
      "APY 来自 DeFiLlama，每小时更新。示意性收益率 — 非投资建议。请核实各平台条款。",
  },
  immobilier: {
    tool: "real estate",
    eyebrow: "比较器 · 平台数据",
    title: "代币化房地产",
    subtitle:
      "示意性租金收益率与管理资产规模 — RWA 地产平台，按收益率排序。",
    disclaimer:
      "税前、费前的示意性毛收益率。请核实各平台的地域资格与流动性。",
    stats: {
      bestApy: "最佳收益率",
      totalTvl: "管理资产",
      products: "已比较产品",
      protocols: (n) => `${n} 个平台`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `平台 · ${date}`,
    },
    filters: {
      all: "全部",
      residential: "住宅",
      commercial: "商业",
      land: "土地",
    },
    table: {
      ...pageTable,
      protocol: "平台",
      apy: "收益率",
      tvl: "AUM",
    },
    cta: {
      ...dossierCtaBase,
      title: "正在代币化房地产？",
    },
    footerDisclaimer:
      "示意性收益率来自平台公开数据。非投资建议 — 请核实税务、流动性与监管。",
  },
  obligations: {
    tool: "bonds",
    eyebrow: "比较器 · 实时数据",
    title: "代币化债券",
    subtitle:
      "代币化债券与资金基金收益率 — 国债、债券 ETF 与结构化信贷，按 APY 排序。",
    disclaimer: "仅供参考的收益率。请核实久期、评级与投资者资格。",
    stats: {
      bestApy: "最佳收益率",
      totalTvl: "合计 TVL",
      products: "已比较产品",
      protocols: (n) => `${n} 个协议`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `缓存 · ${date}`,
    },
    filters: {
      all: "全部",
      sovereign: "主权",
      corporate: "公司",
      structured: "结构化",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "正在代币化债券？",
    },
    footerDisclaimer:
      "APY 来自 DeFiLlama 与公开来源，每小时更新。示意性收益率 — 非投资建议。",
  },
  matieresPremieres: {
    tool: "commodities",
    eyebrow: "比较器 · 实时数据",
    title: "代币化大宗商品",
    subtitle: "LandX 农业收益与代币化贵金属 — 按 APY 排序的 RWA 大宗商品。",
    disclaimer: "贵金属通常无票息收益。请核实费用、托管与监管。",
    stats: {
      bestApy: "最佳收益率",
      totalTvl: "合计 TVL",
      products: "已比较产品",
      protocols: (n) => `${n} 个协议`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `缓存 · ${date}`,
    },
    filters: {
      all: "全部",
      agricultural: "农业",
      precious_metals: "贵金属",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "正在代币化大宗商品？",
    },
    footerDisclaimer:
      "APY 来自 DeFiLlama 与公开来源。示意性收益率 — 非投资建议。",
  },
  privateCredit: {
    tool: "private credit",
    eyebrow: "比较器 · 实时数据",
    title: "代币化私募信贷",
    subtitle:
      "链上私募信贷池收益率 — Maple、Goldfinch、Nest Credit 与 Centrifuge，按 APY 排序。",
    disclaimer:
      "私募信贷违约风险更高。示意性收益率 — 请核实各资金池尽职调查。",
    stats: {
      bestApy: "最佳收益率",
      totalTvl: "合计 TVL",
      products: "已比较产品",
      protocols: (n) => `${n} 个协议`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `缓存 · ${date}`,
    },
    filters: {
      all: "全部",
      prime: "机构",
      emerging: "新兴市场",
      alternative: "另类",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "正在结构化私募信贷？",
    },
    footerDisclaimer:
      "APY 来自 DeFiLlama，每小时更新。私募信贷 — 高风险，非投资建议。",
  },
  footer: {
    dossier: "档案",
    legal: "法律声明",
    disclaimer:
      "APY 来自 DeFiLlama，每小时更新。示意性收益率 — 非投资建议。请核实各平台条款。",
  },
  error: {
    title: "加载错误",
    body: "比较器暂时不可用。请重试或返回首页。",
    retry: "重试",
    home: "首页",
  },
  loading: "正在加载数据…",
};
