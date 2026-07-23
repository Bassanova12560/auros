import type { ComparatorMessages } from "../i18n";

const pageTable = {
  protocol: "البروتوكول",
  product: "المنتج",
  apy: "APY",
  tvl: "TVL",
  chain: "السلسلة",
  view: "عرض",
  viewPlatform: "عرض المنصة",
  search: "بحث…",
  sortBy: "ترتيب حسب",
  topBadge: "أفضل عائد",
  manual: "يدوي",
  manualHint: "غير مفهرس على DeFiLlama",
  noResults: "لا توجد منتجات تطابق بحثك.",
  productsCount: (n: number) =>
    n === 1 ? "منتج واحد" : `${n} منتجات`,
  viewPlatformAria: (platform: string) => `عرض ${platform}`,
};

const dossierCtaBase = {
  eyebrow: "بعد السوق",
  subtitle:
    "4 أجزاء · ~4 دقائق · إرشادي — ابدأ الملف، وأكمل لاحقاً.",
  button: "ابدأ ملفي",
};

export const AR: ComparatorMessages = {
  languageAria: "اللغة",
  nav: {
    dossierCta: "ابدأ ملفي",
    dossierShort: "ملفي",
    comparatorsAria: "مقارنات Auros",
  },
  navDropdown: {
    label: "مقارنات أخرى",
    compareAll: "عرض كل العوائد ←",
    jurisdictions: "مقارن الولايات القضائية",
    current: "الحالي",
  },
  risk: {
    conservative: "خزينة",
    core: "أساسي",
    advanced: "بديل",
    badgeHint: "ملف مخاطر إرشادي — ليس نصيحة استثمارية",
  },
  crossLinks: {
    title: "يُقارَن أيضاً على AUROS",
    explore: "استكشاف المقارن ←",
  },
  nextSteps: {
    phasesHint:
      "4 أجزاء · ~4 دقائق · إرشادي — الأصل → الاستراتيجية → الامتثال → الملخص. ليس تدقيقاً.",
    green: "مسار Green · ماء وطاقة ←",
    csrd: "فحص CSRD إرشادي ←",
  },
  compareHub: {
    tool: "compare",
    eyebrow: "المركز · كل المقارنات",
    title: "عوائد RWA حسب ملف المخاطر",
    subtitle:
      "عرض مجمّع لمقارنات AUROS الخمس — يُعرض أفضل عائد لكل مستوى مخاطر، وليس في ترتيب عالمي واحد.",
    disclaimer:
      "ملفات إرشادية. لكل منتج شروط وصول وسيولة وتنظيم خاصة به.",
    tiers: {
      conservative: {
        label: "محافظ",
        description: "خزينة، سيادي، معادن — أولوية الحفاظ على رأس المال.",
      },
      core: {
        label: "أساسي",
        description: "عقارات سكنية، ائتمان أوّلي، سندات شركات.",
      },
      advanced: {
        label: "بديل",
        description: "ائتمان مهيكل، أراضٍ، زراعة — عائد أعلى ومخاطر أعلى.",
      },
    },
    tierBest: "أفضل عائد",
    tierProducts: (n) =>
      n === 1 ? "منتج واحد في هذا الملف" : `${n} منتجات في هذا الملف`,
    viewComparator: "عرض المقارن",
    viewPlatform: "عرض المنصة",
    updated: (date) => `حدّث · ${date}`,
    totalProducts: (n) =>
      n === 1 ? "منتج فريد واحد" : `${n} منتجات فريدة`,
    dossierBanner: {
      title: "هل تُهيكل أصلاً من نوع RWA؟",
      subtitle:
        "بعد السوق: ابدأ ملفاً إرشادياً خلال ~4 دقائق — درجة الآن، غرفة بيانات لاحقاً، بلا وعد بعائد.",
      cta: "ابدأ ملفي",
      greenLink:
        "كربون أو ماء أو طاقة في القائمة؟ مسار Green + فحص CSRD إرشادي ←",
    },
    dossierCta: {
      eyebrow: "بعد السوق",
      title: "من المقارن إلى الملف",
      subtitle:
        "4 أجزاء · ~4 دقائق · إرشادي. تُكمل لاحقاً مع مستشارك.",
      button: "ابدأ ملفي",
    },
    micaCheckerLink: "فحص MiCA إرشادي ←",
    askCopilot: "اطرح سؤالاً على Copilot ←",
    aiAssist: {
      ariaLabel: "مساعد المقارن",
      eyebrow: "Copilot · التحديد",
      explain: "شرح",
      suggest: "اقتراح RWA",
      openCopilot: "فتح Copilot ←",
      hint: "اشرح التحديد أو اطلب RWA للإضافة (حد أقصى 4).",
      add: "إضافة",
      applyViaUrl: "تطبيق الكل عبر الرابط ←",
      promptSuggestWithSelection:
        "اقترح 1–2 من أصول RWA لإضافتها إلى تحديد المقارنة (معرّفات المركز).",
      promptSuggestEmpty:
        "اقترح 2–3 من أصول RWA مثيرة للمقارنة على مركز AUROS.",
      promptExplainSelection: (ids) =>
        `اشرح باختصار تحديدي (${ids}) — APY وTVL والسيولة والمخاطر الإرشادية.`,
      promptExplainEmpty: "اشرح كيفية استخدام مقارن RWA في AUROS في 3 جمل.",
      errorStatus: (status) => `خطأ ${status}`,
      networkError: "خطأ في الشبكة",
    },
    filters: {
      label: "تصفية",
      all: "الكل",
      under500: "الحد الأدنى < 500 $",
      under5000: "الحد الأدنى < 5٬000 $",
      class: "الفئة",
      risk: "المخاطر",
      source: "المصدر",
      sourceLive: "Live DeFiLlama",
      sourceManual: "يدوي",
      chain: "السلسلة",
      apy: "APY",
      apyAny: "كل APY",
      apyPositive: "APY > 0",
      apyOver5: "APY ≥ 5%",
      apyOver10: "APY ≥ 10%",
    },
    sort: {
      label: "ترتيب حسب",
      apy: "العائد",
      liquidity: "السيولة",
    },
    liquidity: {
      instant: "< يوم واحد",
      days: (n) => `${n} ي`,
    },
    table: {
      protocol: "البروتوكول",
      product: "المنتج",
      apy: "APY",
      minInvestment: "الحد الأدنى",
      liquidity: "السيولة",
      fees: "الرسوم",
      risk: "الملف",
      assetType: "نوع الأصل",
      tvl: "TVL",
      source: "المصدر",
      chain: "السلسلة",
      view: "عرض",
    },
    selectionPrompt:
      "حدّد منتجين إلى 4 للمقارنة جنباً إلى جنب (APY وTVL والمخاطر والمصدر).",
    faqTitle: "أسئلة شائعة",
    noResults: "لا توجد منتجات تطابق هذه التصفية.",
    metaDisclaimer:
      "الحد الأدنى والسيولة والرسوم إرشادية — تحقق من الشروط الدقيقة على كل منصة قبل الاستثمار.",
    footerDisclaimer:
      "عوائد إرشادية مجمّعة من مقارنات AUROS. ليست نصيحة استثمارية — تحقق من كل منصة.",
    selection: {
      barLabel: "تحديد المقارن",
      count: (n) =>
        n === 1
          ? "منتج واحد محدد · حد أقصى 4"
          : `${n} منتجات محددة · حد أقصى 4`,
      compare: "مقارنة",
      compareHint: "حدد منتجين على الأقل للمقارنة.",
      clear: "مسح",
      maxReached: "الحد الأقصى 4 منتجات — أزل واحداً لإضافة آخر.",
      selectProduct: "تحديد للمقارنة",
      copyLink: "نسخ الرابط",
      linkCopied: "تم نسخ الرابط",
      copilot: "Copilot",
    },
    comparePanel: {
      eyebrow: "مقارنة جنباً إلى جنب",
      title: "مقارنة المنتجات",
      close: "إغلاق",
      yes: "نعم",
      no: "لا",
      notAvailable: "—",
      viewFiche: "عرض البطاقة",
      rows: {
        criterion: "المعيار",
        product: "المنتج",
        apy: "APY",
        minInvestment: "الحد الأدنى",
        liquidity: "السيولة",
        fees: "الرسوم",
        jurisdiction: "الولاية القضائية",
        accredited: "معتمد",
        chain: "السلسلة",
        tvl: "TVL",
        source: "المصدر",
        risk: "المخاطر",
        fiche: "بطاقة AUROS",
      },
    },
    monetization: {
      eyebrow: "بعد المقارنة",
      subtitle:
        "تقرير إرشادي قابل للمشاركة، ملف مدفوع، أو مقدمة desk — بلا ترتيب مدفوع.",
      reportCta: "تقرير المقارنة",
      dossierCta: "الملف / غرفة البيانات",
      deskCta: "التحدث مع desk",
      csvCta: "تصدير CSV",
      csvDone: "تم تنزيل CSV",
      csvLicenceHint: "تصدير مجاني محدود — ترخيص البيانات عبر Premium / API",
      greenUpsell: "صفوف الكربون / الموارد → مسار Green + CSRD ←",
    },
    sponsored: {
      badgeSponsored: "Sponsored",
      badgePartenariat: "شراكة",
      hint: "مساحة شراكة — لا تشتري ترتيب APY ولا شارة Verified",
      stripTitle: "شراكات (عرض)",
      stripSubtitle: "فتحات صريحة — ترتيب APY الحي/اليدوي لا يتغير.",
    },
    alerts: {
      eyebrow: "تنبيهات القائمة",
      title: "مراقبة هذا التحديد",
      subtitle:
        "قائمة انتظار — نُعلمك عندما تكون تنبيهات APY / webhooks جاهزة.",
      emailLabel: "البريد",
      emailPlaceholder: "you@company.com",
      submit: "أعلمني",
      submitting: "جارٍ الإرسال…",
      success: "تم التسجيل — تأكيد أفضل جهد.",
      errorRateLimit: "محاولات كثيرة — أعد المحاولة لاحقاً.",
      errorEmail: "بريد غير صالح.",
      errorGeneric: "فشل — أعد المحاولة.",
    },
    report: {
      eyebrow: "تقرير مقارنة · إرشادي",
      title: "Compare Report",
      subtitle: "لقطة قابلة للمشاركة / الطباعة — ليست نصيحة؛ لا يُختلق APY.",
      print: "طباعة / PDF",
      dossierCta: "المتابعة إلى الملف",
      deskCta: "مقدمة desk",
      back: "العودة إلى المركز",
      empty: "حدد 2–4 منتجات في /compare لإنشاء تقرير.",
      indicative: "بيانات إرشادية — تحقق من كل منصة قبل أي قرار.",
      asOf: (date) => `As of ${date}`,
    },
    ecosystem: {
      title: "منظومة AUROS",
      dossier: "ابدأ ملفاً",
      green: "AUROS Green",
      dashboard: "ملفاتي",
      score: "درجة القبول",
      partners: "الشركاء والموارد",
      jurisdictions: "مقارن الولايات القضائية",
    },
  },
  productBadges: {
    accredited: "معتمد",
    accreditedHint:
      "قد يُطلب مستثمر مؤهل أو ما يعادله — تحقق من الأهلية قبل KYC.",
    new: "جديد",
    popular: "شائع",
  },
  assetTypes: {
    stablecoins: "عملات مستقرة",
    immobilier: "عقارات",
    obligations: "سندات",
    matieresPremieres: "سلع",
    privateCredit: "ائتمان خاص",
    privateEquity: "أسهم / PE",
    artCollectibles: "فن ومقتنيات",
  },
  tabs: {
    stablecoins: "عملات مستقرة",
    immobilier: "عقارات",
    obligations: "سندات",
    matieresPremieres: "سلع",
    privateCredit: "ائتمان خاص",
    privateEquity: "أسهم / PE",
    artCollectibles: "فن",
    soon: "قريباً",
  },
  stablecoins: {
    tool: "stablecoins",
    eyebrow: "مقارن · بيانات مباشرة",
    title: "عملات مستقرة RWA",
    subtitle:
      "عوائد وسيولة لأبرز البروتوكولات — مرتّبة حسب APY، تُحدَّث كل ساعة.",
    disclaimer:
      "عوائد إرشادية فقط. تحقق من شروط الوصول والتنظيم على كل منصة.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "TVL مجمّع",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "بروتوكول واحد" : `${n} بروتوكولات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `ذاكرة مؤقتة · ${date}`,
    },
    filters: { all: "الكل", treasury: "خزينة", credit: "ائتمان" },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "هل تُرمّز أصولك الخاصة؟",
    },
    footerDisclaimer:
      "APY عبر DeFiLlama، تحديث ساعي. عوائد إرشادية — ليست نصيحة استثمارية. تحقق من الشروط على كل منصة.",
  },
  immobilier: {
    tool: "real estate",
    eyebrow: "مقارن · بيانات المنصات",
    title: "عقارات مرمّزة",
    subtitle:
      "عوائد إيجارية إرشادية وأصول تحت الإدارة — منصات عقارات RWA مرتّبة حسب العائد.",
    disclaimer:
      "عوائد إجمالية إرشادية قبل الضرائب والرسوم. تحقق من الأهلية الجغرافية والسيولة على كل منصة.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "أصول تحت الإدارة",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "منصة واحدة" : `${n} منصات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `منصات · ${date}`,
    },
    filters: {
      all: "الكل",
      residential: "سكني",
      commercial: "تجاري",
      land: "أراضٍ",
    },
    table: {
      ...pageTable,
      protocol: "المنصة",
      apy: "العائد",
      tvl: "AUM",
    },
    cta: {
      ...dossierCtaBase,
      title: "هل تُرمّز عقارات؟",
    },
    footerDisclaimer:
      "عوائد إرشادية من بيانات المنصات العامة. ليست نصيحة استثمارية — تحقق من الضرائب والسيولة والتنظيم.",
  },
  obligations: {
    tool: "bonds",
    eyebrow: "مقارن · بيانات مباشرة",
    title: "سندات مرمّزة",
    subtitle:
      "عوائد منتجات السندات وصناديق الخزينة — سندات خزانة وصناديق ETF وائتمان مهيكل، مرتّبة حسب APY.",
    disclaimer:
      "عوائد إرشادية فقط. تحقق من المدة والتصنيف وأهلية المستثمر على كل منصة.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "TVL مجمّع",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "بروتوكول واحد" : `${n} بروتوكولات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `ذاكرة مؤقتة · ${date}`,
    },
    filters: {
      all: "الكل",
      sovereign: "سيادي",
      corporate: "شركات",
      structured: "مهيكل",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "هل تُرمّز سندات؟",
    },
    footerDisclaimer:
      "APY عبر DeFiLlama ومصادر عامة، تحديث ساعي. عوائد إرشادية — ليست نصيحة استثمارية.",
  },
  matieresPremieres: {
    tool: "commodities",
    eyebrow: "مقارن · بيانات مباشرة",
    title: "سلع مرمّزة",
    subtitle:
      "عوائد زراعية LandX ومعادن ثمينة مرمّزة — سلع RWA مرتّبة حسب APY.",
    disclaimer:
      "المعادن الثمينة عادة بلا كوبون. تحقق من الرسوم والحفظ والتنظيم.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "TVL مجمّع",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "بروتوكول واحد" : `${n} بروتوكولات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `ذاكرة مؤقتة · ${date}`,
    },
    filters: {
      all: "الكل",
      agricultural: "زراعي",
      precious_metals: "معادن ثمينة",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "هل تُرمّز سلعاً؟",
    },
    footerDisclaimer:
      "APY عبر DeFiLlama ومصادر عامة. عوائد إرشادية — ليست نصيحة استثمارية.",
  },
  privateCredit: {
    tool: "private credit",
    eyebrow: "مقارن · بيانات مباشرة",
    title: "ائتمان خاص مرمّز",
    subtitle:
      "عوائد مجمعات الائتمان الخاص على السلسلة — Maple وGoldfinch وNest Credit وCentrifuge، مرتّبة حسب APY.",
    disclaimer:
      "الائتمان الخاص يحمل مخاطر تعثر أعلى. عوائد إرشادية — تحقق من العناية الواجبة لكل مجمع.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "TVL مجمّع",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "بروتوكول واحد" : `${n} بروتوكولات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `ذاكرة مؤقتة · ${date}`,
    },
    filters: {
      all: "الكل",
      prime: "مؤسسي",
      emerging: "أسواق ناشئة",
      alternative: "بديل",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "هل تُهيكل ائتماناً خاصاً؟",
    },
    footerDisclaimer:
      "APY عبر DeFiLlama، تحديث ساعي. ائتمان خاص — مخاطر مرتفعة، ليست نصيحة استثمارية.",
  },
  privateEquity: {
    tool: "private equity",
    eyebrow: "مقارن · صناديق وأسهم",
    title: "أسهم وPE مرمّزة",
    subtitle:
      "صناديق PE وأسهم مرمّزة — Securitize وOndo وBacked وSwarm. APY 0 إن لم يوجد كوبون عام موثوق.",
    disclaimer:
      "كثير من منتجات الأسهم بلا عائد ثابت. المصادر اليدوية مقابل المباشرة موسومة بوضوح.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "TVL / AUM",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "بروتوكول واحد" : `${n} بروتوكولات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `كتالوج · ${date}`,
    },
    filters: {
      all: "الكل",
      funds: "صناديق PE",
      public_equity: "أسهم",
      infrastructure: "بنية تحتية",
    },
    table: pageTable,
    cta: {
      ...dossierCtaBase,
      title: "هل ترمّز صناديق أو أسهماً؟",
    },
    footerDisclaimer:
      "DeFiLlama مباشرة + كتالوج يدوي. ليست نصيحة استثمارية.",
  },
  artCollectibles: {
    tool: "art",
    eyebrow: "مقارن · فن ومقتنيات",
    title: "فن ومقتنيات مرمّزة",
    subtitle:
      "فن مجزأ ومقتنيات على السلسلة — Masterworks وParticle وArtory. بلا عوائد مخترعة.",
    disclaimer:
      "فن RWA غالباً بلا كوبون. قارن الوصول والحفظ والسيولة — أرقام إرشادية.",
    stats: {
      bestApy: "أفضل عائد",
      totalTvl: "مراجع",
      products: "منتجات مُقارنة",
      protocols: (n) =>
        n === 1 ? "منصة واحدة" : `${n} منصات`,
      liveSource: (date) => `DeFiLlama · ${date}`,
      cacheSource: (date) => `كتالوج · ${date}`,
    },
    filters: {
      all: "الكل",
      fine_art: "فنون جميلة",
      collectibles: "مقتنيات",
    },
    table: {
      ...pageTable,
      protocol: "المنصة",
    },
    cta: {
      ...dossierCtaBase,
      title: "هل ترمّز فناً أو مقتنيات؟",
    },
    footerDisclaimer:
      "كتالوج منسّق؛ APY 0 إن لم يوجد كوبون عام. ليست نصيحة استثمارية.",
  },
  footer: {
    dossier: "الملف",
    legal: "إشعار قانوني",
    disclaimer:
      "APY عبر DeFiLlama، تحديث ساعي. عوائد إرشادية — ليست نصيحة استثمارية. تحقق من الشروط على كل منصة.",
  },
  error: {
    title: "خطأ في التحميل",
    body: "المقارن غير متاح مؤقتاً. أعد المحاولة أو ارجع إلى الصفحة الرئيسية.",
    retry: "إعادة المحاولة",
    home: "الرئيسية",
  },
  loading: "جارٍ تحميل البيانات…",
};
