import { localeCatalog, type Locale } from "@/lib/i18n";

export type CareersRole = {
  title: string;
  team: string;
  summary: string;
  impact: string;
  stack: string;
  apply: string;
  mailto: string;
};

export type CareersMessages = {
  product: string;
  eyebrow: string;
  title: string;
  intro: string;
  impactLabel: string;
  applyRole: string;
  footerLead: string;
  footerWalkthrough: string;
  footerBuilders: string;
  footerVision: string;
  footerEssay: string;
  applyEmail: string;
  roles: readonly CareersRole[];
};

const EN: CareersMessages = {
  product: "AUROS",
  eyebrow: "Careers",
  title: "Build the resource liquidity layer",
  intro:
    "Small team, high bar for safety and honesty. Remote-friendly (EU time zones preferred). We ship demos clearly labeled — no fake certifications.",
  impactLabel: "Impact ·",
  applyRole: "Apply for this role",
  footerLead: "Intro + GitHub or protocol sample:",
  footerWalkthrough: "Stack walkthrough:",
  footerBuilders: "/builders",
  footerVision: "ARL vision",
  footerEssay: "risk engine essay",
  applyEmail: "Apply by email",
  roles: [
    {
      title: "Head of IoT Integration",
      team: "iot-bridge · hiring now",
      summary:
        "Own device attestation end-to-end: OEM partnerships, meter/inverter firmware hooks, MQTT → ECDSA Proof-of-Resource pipelines, and the security bar that keeps unauthorized hardware from minting.",
      impact:
        "You make “resource tokens” real — only trusted devices create supply. Without this role, Resource Layer is a deck.",
      stack:
        "Edge Linux · Mosquitto / MQTT TLS · industrial protocols · device keys · Node or Rust · Soft skills: OEM diligence",
      apply:
        "Subject: Head of IoT Integration — include prior industrial IoT or metering work + a short threat model for replay.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20IoT%20Integration&body=GitHub%2Fportfolio%3A%0APrior%20industrial%20IoT%20or%20metering%3A%0AReplay%20threat%20model%20(short)%3A%0A",
    },
    {
      title: "Protocol Engineer — Energy Markets",
      team: "protocol · Solidity",
      summary:
        "Ship and harden EnergyFutures, ResourceOptions, lending, and parametric insurance: UUPS upgrades, circuit-breakers, position caps, pause paths, and audit-ready Hardhat suites.",
      impact:
        "You turn metered units into tradeable risk — without fake Verified badges or uncapped OI.",
      stack:
        "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · Prefer DeFi risk literacy",
      apply:
        "Subject: Protocol Engineer – Energy Markets — link a repo with tests; note any audit participation.",
      mailto:
        "mailto:careers@getauros.com?subject=Protocol%20Engineer%20%E2%80%93%20Energy%20Markets&body=Repo%20with%20tests%3A%0AAudit%20participation%20(if%20any)%3A%0A",
    },
    {
      title: "Head of Resource Markets",
      team: "markets · hiring",
      summary:
        "Own ARL market design (kWh, water, compute), LP relationships, and honest pilot narrative — no fake volume badges.",
      impact: "Institutions judge us on clarity of depth and labels, not slogans.",
      stack: "Energy markets · RWA / crypto fluency · EU time zones",
      apply: "Subject: Head of Resource Markets — one-pager on a past market design or LP program.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20Resource%20Markets&body=One-pager%20%2F%20past%20market%20design%20or%20LP%20program%3A%0A",
    },
    {
      title: "AI agent & markets engineer",
      team: "agent-api",
      summary:
        "Consumption forecasting, hedge cron jobs, and safe automation with HITL gates for forward energy orders.",
      impact: "Agents that can order kWh without becoming an unsupervised risk engine.",
      stack: "TypeScript · Express · ethers v6 · time-series models · rate limits / auth",
      apply: "Subject: Agent & markets engineer — sample of a hedging or forecasting system.",
      mailto:
        "mailto:careers@getauros.com?subject=Agent%20%26%20markets%20engineer&body=Sample%20hedging%20or%20forecasting%20system%3A%0A",
    },
  ],
};

const FR: CareersMessages = {
  product: "AUROS",
  eyebrow: "Carrières",
  title: "Construire la couche de liquidité des ressources",
  intro:
    "Petite équipe, haut niveau d’exigence sur la sécurité et l’honnêteté. Remote-friendly (fuseaux EU préférés). Nous livrons des démos clairement labellisées — pas de certifications fictives.",
  impactLabel: "Impact ·",
  applyRole: "Postuler à ce rôle",
  footerLead: "Intro + GitHub ou sample protocole :",
  footerWalkthrough: "Parcours stack :",
  footerBuilders: "/builders",
  footerVision: "Vision ARL",
  footerEssay: "essai risk engine",
  applyEmail: "Postuler par e-mail",
  roles: [
    {
      title: "Head of IoT Integration",
      team: "iot-bridge · recrutement ouvert",
      summary:
        "Posséder l’attestation appareil de bout en bout : partenariats OEM, hooks firmware compteur/onduleur, pipelines MQTT → ECDSA Proof-of-Resource, et la barre de sécurité qui empêche le hardware non autorisé de minter.",
      impact:
        "Vous rendez les « resource tokens » réels — seuls les appareils de confiance créent l’offre. Sans ce rôle, Resource Layer reste un deck.",
      stack:
        "Edge Linux · Mosquitto / MQTT TLS · protocoles industriels · clés appareil · Node ou Rust · Soft skills : diligence OEM",
      apply:
        "Objet : Head of IoT Integration — inclure une expérience IoT industriel ou metering + un court modèle de menace replay.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20IoT%20Integration&body=GitHub%2Fportfolio%3A%0APrior%20industrial%20IoT%20or%20metering%3A%0AReplay%20threat%20model%20(short)%3A%0A",
    },
    {
      title: "Protocol Engineer — Energy Markets",
      team: "protocol · Solidity",
      summary:
        "Livrer et durcir EnergyFutures, ResourceOptions, lending et assurance paramétrique : upgrades UUPS, coupe-circuits, plafonds de position, chemins pause, et suites Hardhat prêtes pour audit.",
      impact:
        "Vous transformez des unités mesurées en risque négociable — sans badges Verified fictifs ni OI non plafonné.",
      stack:
        "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · Préférence : culture risque DeFi",
      apply:
        "Objet : Protocol Engineer – Energy Markets — lier un repo avec tests ; noter toute participation à un audit.",
      mailto:
        "mailto:careers@getauros.com?subject=Protocol%20Engineer%20%E2%80%93%20Energy%20Markets&body=Repo%20with%20tests%3A%0AAudit%20participation%20(if%20any)%3A%0A",
    },
    {
      title: "Head of Resource Markets",
      team: "markets · recrutement",
      summary:
        "Posséder le design de marché ARL (kWh, eau, compute), les relations LP et un narratif pilote honnête — pas de badges de volume fictifs.",
      impact: "Les institutions nous jugent sur la clarté de la profondeur et des labels, pas sur les slogans.",
      stack: "Marchés énergie · aisance RWA / crypto · fuseaux EU",
      apply:
        "Objet : Head of Resource Markets — one-pager sur un design de marché ou programme LP passé.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20Resource%20Markets&body=One-pager%20%2F%20past%20market%20design%20or%20LP%20program%3A%0A",
    },
    {
      title: "Ingénieur agent IA & marchés",
      team: "agent-api",
      summary:
        "Prévision de consommation, cron de couverture, et automatisation sûre avec portes HITL pour les ordres d’énergie forward.",
      impact: "Des agents qui peuvent commander des kWh sans devenir un moteur de risque sans supervision.",
      stack: "TypeScript · Express · ethers v6 · modèles time-series · rate limits / auth",
      apply:
        "Objet : Agent & markets engineer — sample d’un système de couverture ou de prévision.",
      mailto:
        "mailto:careers@getauros.com?subject=Agent%20%26%20markets%20engineer&body=Sample%20hedging%20or%20forecasting%20system%3A%0A",
    },
  ],
};

const ES: CareersMessages = {
  product: "AUROS",
  eyebrow: "Carreras",
  title: "Construir la capa de liquidez de recursos",
  intro:
    "Equipo pequeño, alto listón de seguridad y honestidad. Remote-friendly (zonas horarias EU preferidas). Enviamos demos claramente etiquetadas — sin certificaciones falsas.",
  impactLabel: "Impacto ·",
  applyRole: "Postular a este rol",
  footerLead: "Intro + GitHub o sample de protocolo:",
  footerWalkthrough: "Recorrido del stack:",
  footerBuilders: "/builders",
  footerVision: "Visión ARL",
  footerEssay: "ensayo risk engine",
  applyEmail: "Postular por email",
  roles: [
    {
      title: "Head of IoT Integration",
      team: "iot-bridge · contratando ahora",
      summary:
        "Poseer la atestación de dispositivos de extremo a extremo: partnerships OEM, hooks de firmware de contador/inversor, pipelines MQTT → ECDSA Proof-of-Resource, y el listón de seguridad que impide que hardware no autorizado mintee.",
      impact:
        "Haces reales los “resource tokens” — solo dispositivos de confianza crean oferta. Sin este rol, Resource Layer es un deck.",
      stack:
        "Edge Linux · Mosquitto / MQTT TLS · protocolos industriales · claves de dispositivo · Node o Rust · Soft skills: diligence OEM",
      apply:
        "Asunto: Head of IoT Integration — incluir trabajo previo en IoT industrial o metering + un threat model breve de replay.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20IoT%20Integration&body=GitHub%2Fportfolio%3A%0APrior%20industrial%20IoT%20or%20metering%3A%0AReplay%20threat%20model%20(short)%3A%0A",
    },
    {
      title: "Protocol Engineer — Energy Markets",
      team: "protocol · Solidity",
      summary:
        "Entregar y endurecer EnergyFutures, ResourceOptions, lending y seguros paramétricos: upgrades UUPS, circuit-breakers, caps de posición, rutas pause y suites Hardhat listas para auditoría.",
      impact:
        "Conviertes unidades medidas en riesgo negociable — sin badges Verified falsos ni OI sin tope.",
      stack:
        "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · Preferible: literacia de riesgo DeFi",
      apply:
        "Asunto: Protocol Engineer – Energy Markets — enlazar un repo con tests; indicar cualquier participación en auditoría.",
      mailto:
        "mailto:careers@getauros.com?subject=Protocol%20Engineer%20%E2%80%93%20Energy%20Markets&body=Repo%20with%20tests%3A%0AAudit%20participation%20(if%20any)%3A%0A",
    },
    {
      title: "Head of Resource Markets",
      team: "markets · contratando",
      summary:
        "Poseer el diseño de mercado ARL (kWh, agua, compute), relaciones LP y una narrativa de piloto honesta — sin badges de volumen falsos.",
      impact: "Las instituciones nos juzgan por la claridad de profundidad y etiquetas, no por eslóganes.",
      stack: "Mercados energéticos · fluidez RWA / crypto · zonas horarias EU",
      apply:
        "Asunto: Head of Resource Markets — one-pager sobre un diseño de mercado o programa LP pasado.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20Resource%20Markets&body=One-pager%20%2F%20past%20market%20design%20or%20LP%20program%3A%0A",
    },
    {
      title: "Ingeniero de agentes IA y mercados",
      team: "agent-api",
      summary:
        "Forecast de consumo, cron de coberturas y automatización segura con puertas HITL para órdenes de energía forward.",
      impact: "Agentes que pueden pedir kWh sin convertirse en un motor de riesgo sin supervisión.",
      stack: "TypeScript · Express · ethers v6 · modelos time-series · rate limits / auth",
      apply:
        "Asunto: Agent & markets engineer — sample de un sistema de cobertura o forecast.",
      mailto:
        "mailto:careers@getauros.com?subject=Agent%20%26%20markets%20engineer&body=Sample%20hedging%20or%20forecasting%20system%3A%0A",
    },
  ],
};

const AR: CareersMessages = {
  product: "AUROS",
  eyebrow: "الوظائف",
  title: "ابنِ طبقة سيولة الموارد",
  intro:
    "فريق صغير، معايير عالية للسلامة والصراحة. مناسب للعمل عن بُعد (يفضَّل مناطق توقيت الاتحاد الأوروبي). نسلّم عروضاً توضيحية مُصنَّفة بوضوح — بلا شهادات مزيفة.",
  impactLabel: "الأثر ·",
  applyRole: "قدّم لهذا الدور",
  footerLead: "مقدمة + GitHub أو عيّنة بروتوكول:",
  footerWalkthrough: "جولة في المكدس:",
  footerBuilders: "/builders",
  footerVision: "رؤية ARL",
  footerEssay: "مقال محرك المخاطر",
  applyEmail: "قدّم عبر البريد",
  roles: [
    {
      title: "Head of IoT Integration",
      team: "iot-bridge · توظيف الآن",
      summary:
        "امتلك توثيق الأجهزة من الطرف إلى الطرف: شراكات OEM، خطاطيف برمجيات العداد/العاكس، خطوط MQTT → ECDSA Proof-of-Resource، وشريط الأمان الذي يمنع الأجهزة غير المصرّح بها من السكّ.",
      impact:
        "تجعل «رموز الموارد» حقيقية — فقط الأجهزة الموثوقة تخلق العرض. بدون هذا الدور، Resource Layer مجرد عرض تقديمي.",
      stack:
        "Edge Linux · Mosquitto / MQTT TLS · بروتوكولات صناعية · مفاتيح أجهزة · Node أو Rust · مهارات ناعمة: عناية OEM",
      apply:
        "الموضوع: Head of IoT Integration — أدرج خبرة IoT صناعي أو قياس + نموذج تهديد قصير لإعادة التشغيل.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20IoT%20Integration&body=GitHub%2Fportfolio%3A%0APrior%20industrial%20IoT%20or%20metering%3A%0AReplay%20threat%20model%20(short)%3A%0A",
    },
    {
      title: "Protocol Engineer — Energy Markets",
      team: "protocol · Solidity",
      summary:
        "سلّم وحصّن EnergyFutures وResourceOptions والإقراض والتأمين البارامتري: ترقيات UUPS، قواطع دوائر، حدود مراكز، مسارات إيقاف، ومجموعات Hardhat جاهزة للتدقيق.",
      impact:
        "تحوّل الوحدات المقاسة إلى مخاطر قابلة للتداول — بلا شارات Verified مزيفة ولا فائدة مفتوحة بلا سقف.",
      stack:
        "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · يفضَّل إلمام بمخاطر DeFi",
      apply:
        "الموضوع: Protocol Engineer – Energy Markets — اربط مستودعاً مع اختبارات؛ واذكر أي مشاركة في تدقيق.",
      mailto:
        "mailto:careers@getauros.com?subject=Protocol%20Engineer%20%E2%80%93%20Energy%20Markets&body=Repo%20with%20tests%3A%0AAudit%20participation%20(if%20any)%3A%0A",
    },
    {
      title: "Head of Resource Markets",
      team: "markets · توظيف",
      summary:
        "امتلك تصميم أسواق ARL (كيلوواط ساعة، ماء، حوسبة)، علاقات مزوّدي السيولة، وسرداً تجريبياً صادقاً — بلا شارات حجم مزيفة.",
      impact: "تحكّمنا المؤسسات بوضوح العمق والتصنيفات، لا بالشعارات.",
      stack: "أسواق الطاقة · طلاقة RWA / كريبتو · مناطق توقيت الاتحاد الأوروبي",
      apply:
        "الموضوع: Head of Resource Markets — صفحة واحدة عن تصميم سوق سابق أو برنامج مزوّدي سيولة.",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20Resource%20Markets&body=One-pager%20%2F%20past%20market%20design%20or%20LP%20program%3A%0A",
    },
    {
      title: "مهندس وكلاء ذكاء اصطناعي وأسواق",
      team: "agent-api",
      summary:
        "توقّع الاستهلاك، مهام تحوط مجدولة، وأتمتة آمنة مع بوابات HITL لأوامر الطاقة الآجلة.",
      impact: "وكلاء يطلبون كيلوواط ساعة دون أن يصبحوا محرك مخاطر بلا إشراف.",
      stack: "TypeScript · Express · ethers v6 · نماذج سلاسل زمنية · حدود معدّل / مصادقة",
      apply:
        "الموضوع: Agent & markets engineer — عيّنة من نظام تحوط أو توقّع.",
      mailto:
        "mailto:careers@getauros.com?subject=Agent%20%26%20markets%20engineer&body=Sample%20hedging%20or%20forecasting%20system%3A%0A",
    },
  ],
};

const ZH: CareersMessages = {
  product: "AUROS",
  eyebrow: "招聘",
  title: "共建资源流动性层",
  intro:
    "小团队，对安全与诚实要求极高。支持远程（优先欧盟时区）。我们交付的演示均明确标注——不做虚假认证。",
  impactLabel: "影响 ·",
  applyRole: "申请此职位",
  footerLead: "自我介绍 + GitHub 或协议样例：",
  footerWalkthrough: "技术栈导览：",
  footerBuilders: "/builders",
  footerVision: "ARL 愿景",
  footerEssay: "风险引擎文章",
  applyEmail: "通过邮件申请",
  roles: [
    {
      title: "Head of IoT Integration",
      team: "iot-bridge · 正在招聘",
      summary:
        "端到端负责设备证明：OEM 合作、表计/逆变器固件挂钩、MQTT → ECDSA Proof-of-Resource 流水线，以及阻止未授权硬件铸造的安全门槛。",
      impact:
        "你让“资源代币”成为现实——只有可信设备才能创造供给。没有此角色，Resource Layer 只是一页 deck。",
      stack:
        "Edge Linux · Mosquitto / MQTT TLS · 工业协议 · 设备密钥 · Node 或 Rust · 软技能：OEM 尽调",
      apply:
        "主题：Head of IoT Integration — 请附工业 IoT 或计量经验 + 简短重放威胁模型。",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20IoT%20Integration&body=GitHub%2Fportfolio%3A%0APrior%20industrial%20IoT%20or%20metering%3A%0AReplay%20threat%20model%20(short)%3A%0A",
    },
    {
      title: "Protocol Engineer — Energy Markets",
      team: "protocol · Solidity",
      summary:
        "交付并加固 EnergyFutures、ResourceOptions、借贷与参数化保险：UUPS 升级、断路器、仓位上限、暂停路径，以及可审计的 Hardhat 测试套件。",
      impact:
        "你把计量单位变成可交易风险——不做虚假 Verified 徽章，也不做无上限未平仓量。",
      stack:
        "Solidity ^0.8.24 · OpenZeppelin UUPS · Reentrancy / Pausable · Hardhat · ethers v6 · 优先具备 DeFi 风险素养",
      apply:
        "主题：Protocol Engineer – Energy Markets — 附带测试的仓库链接；注明任何审计参与。",
      mailto:
        "mailto:careers@getauros.com?subject=Protocol%20Engineer%20%E2%80%93%20Energy%20Markets&body=Repo%20with%20tests%3A%0AAudit%20participation%20(if%20any)%3A%0A",
    },
    {
      title: "Head of Resource Markets",
      team: "markets · 招聘中",
      summary:
        "负责 ARL 市场设计（千瓦时、水、算力）、LP 关系与诚实的试点叙事——不做虚假成交量徽章。",
      impact: "机构用深度与标签的清晰度评判我们，而不是口号。",
      stack: "能源市场 · RWA / 加密素养 · 欧盟时区",
      apply:
        "主题：Head of Resource Markets — 关于过往市场设计或 LP 计划的一页纸。",
      mailto:
        "mailto:careers@getauros.com?subject=Head%20of%20Resource%20Markets&body=One-pager%20%2F%20past%20market%20design%20or%20LP%20program%3A%0A",
    },
    {
      title: "AI 代理与市场工程师",
      team: "agent-api",
      summary:
        "消费预测、对冲定时任务，以及带 HITL 门控的安全自动化，用于远期能源订单。",
      impact: "代理可以下千瓦时订单，而不会变成无人监督的风险引擎。",
      stack: "TypeScript · Express · ethers v6 · 时间序列模型 · 限速 / 鉴权",
      apply:
        "主题：Agent & markets engineer — 对冲或预测系统样例。",
      mailto:
        "mailto:careers@getauros.com?subject=Agent%20%26%20markets%20engineer&body=Sample%20hedging%20or%20forecasting%20system%3A%0A",
    },
  ],
};

const CATALOG = localeCatalog({ fr: FR, en: EN, es: ES, ar: AR, zh: ZH });

export function getCareersMessages(locale: Locale): CareersMessages {
  return CATALOG[locale] ?? CATALOG.en;
}
