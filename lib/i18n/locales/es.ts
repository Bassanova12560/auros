import type { Messages } from "../types";

export const es: Messages = {
  nav: {
    score: "Puntuación",
    tokenize: "Tokenizar",
    dossiers: "Expedientes",
    jurisdictions: "Jurisdicciones",
    partners: "Plataformas",
    login: "Acceder",
    start: "Empezar",
    menu: "Menú",
  },
  breadcrumb: {
    ariaLabel: "Ruta de navegación",
    green: "Green",
    compare: "Compare",
    academy: "Academy",
    partners: "Plataformas",
    pricing: "Tarifas",
  },
  hero: {
    eyebrow: "Activos del mundo real",
    title: "Tokenizar el mundo real.",
    subtitle:
      "Puntuación, data room y estudio regulatorio — prepare su expediente antes de la plataforma RWA.",
    ctaPrimary: "Crear mi expediente",
    ctaEstimate: "Valorar mi activo",
    metricAssets: "Clases de activos",
    metricJurisdictions: "Jurisdicciones",
    metricDossier: "Expediente medio",
  },
  platforms: {
    caption: "Preparación de expediente RWA — sin comparador de plataformas",
  },
  score: {
    eyebrow: "Puntuación",
    title: "¿Su activo está listo?",
    subtitle: "Una frase basta. Resultado al instante, sin cuenta.",
    placeholder: "Ej. Casa de piedra 180 m² en Burdeos, 1,2 M€…",
    submit: "Calcular puntuación",
    emailPlaceholder: "Email (opcional)",
    saveEmail: "Guardar",
    emailSaved: "Guardado ✓",
    linkCopied: "Enlace copiado",
    linkFailed: "Error",
    share: "Compartir puntuación",
    reset: "Nueva estimación",
    calculate: "Calcular",
    shareBtn: "Compartir",
    fullDossier: "Expediente completo",
    otherAsset: "Otro activo",
    disclaimer: "Puntuación indicativa — no es asesoramiento regulado",
    indicativeNote:
      "Puntuación indicativa según la información proporcionada. No es asesoramiento jurídico ni financiero.",
    emptyQuery: "Describa su activo en una frase para calcular la puntuación.",
    tierHigh: "Alto potencial de tokenización",
    tierMid: "Buen potencial",
    tierLow: "Preparación recomendada",
    quickExamplesLabel: "3 ejemplos rápidos",
    quickExamples: [
      "Apartamento T3 París 15.º, valor 450 000 €",
      "Cartera arte contemporáneo, 3 obras, 180 000 €",
      "Crédito comercial, PYME Lyon, 250 000 €",
    ],
    inputHint: "~30 segundos · Sin cuenta · Resultado indicativo",
    exampleCard: {
      title: "Ejemplo de resultado",
      readiness: "Expediente listo al 72%",
      maturity: "Madurez · 72% · expediente listo",
      badgeLegal: "Legal ✓",
      badgeKyc: "KYC ✓",
      badgeMica: "MiCA ⚠",
      badgeDataRoom: "Data room ✓",
      disclaimer: "Ejemplo ilustrativo — su puntuación se calculará en tiempo real",
    },
  },
  regulatory: {
    eyebrow: "Cumplimiento",
    title: "Marco regulatorio transparente",
    subtitle:
      "AUROS ofrece análisis indicativo — no asesoramiento legal ni financiero.",
    kyc: "KYC / AML",
    kycDesc:
      "Recorrido de identidad alineado con estándares KYC/AML habituales en tokenización.",
    jurisdictions: "Jurisdicciones cubiertas",
    jurisdictionsDesc:
      "Más de 40 jurisdicciones modeladas — análisis adaptado al país y marcos MiCA / locales.",
    indicative: "Puntuación indicativa",
    indicativeDesc:
      "Estimación de preparación — validación final por sus asesores y el equipo AUROS.",
    partners: "Acompañamiento AUROS",
    partnersDesc:
      "Estructuración del expediente y revisión humana — sin imponer una plataforma externa.",
    disclaimer:
      "Los resultados de AUROS son solo informativos y no constituyen asesoramiento de inversión, legal o fiscal.",
  },
  trustPage: {
    howWeWorkEyebrow: "Proceso",
    howWeWorkTitle: "Cómo trabajamos",
    howWeWorkIntro:
      "Tres pasos concretos — sin promesa de licencia, sin intermediario impuesto. Usted conserva sus asesores; AUROS estructura la preparación.",
    howWeWorkSteps: [
      {
        number: "01",
        title: "Diagnóstico gratuito",
        description:
          "Wizard y score indicativo (~12 min): describe el activo, AUROS genera un dossier estructurado y una primera lectura de preparación.",
      },
      {
        number: "02",
        title: "Elección de jurisdicción",
        description:
          "Comparador 8 jurisdicciones o Starter Kit 5 000 €: memo SPV + regulador objetivo, entregado en 5 días hábiles — a validar con su counsel.",
      },
      {
        number: "03",
        title: "Revisión humana AUROS",
        description:
          "Envío del dossier al equipo: completitud data room, coherencia regulatoria indicativa, próximos pasos — sin colocación de producto tercero.",
      },
    ],
    caseStudiesEyebrow: "Retorno anonimizado",
    caseStudiesTitle: "Ejemplos de recorridos",
    caseStudiesNote:
      "Testimonios ilustrativos, sectores y etiquetas modificados — no referencias de clientes certificadas.",
    caseStudies: [
      {
        sector: "Inmobiliario · Francia",
        quote:
          "El dossier PDF nos permitió alinear abogado y banco en la misma base en una semana.",
        context: "Score 72 · comparador Luxemburgo vs Francia · counsel externo",
      },
      {
        sector: "Energía renovable · UE",
        quote:
          "RTMS Green + wizard renovable: primera estructuración antes de due diligence inversor.",
        context: "Activo solar · etiqueta en candidatura · sin emisión finalizada",
      },
    ],
    infrastructureTitle: "Infraestructura y datos",
    infrastructureItems: [
      "Alojamiento: Vercel Edge Network — datacenters UE",
      "Cifrado en tránsito: TLS 1.3",
      "Cifrado en reposo: AES-256",
      "Conservación: datos eliminados bajo solicitud, máx. 3 años de inactividad",
    ],
    faqTitle: "FAQ privacidad y DPO",
    badges: ["MiCA-ready", "RGPD", "KYC/AML", "Alojamiento UE", "TLS 1.3"],
    faq: [
      {
        question: "¿Quién accede a los datos de mi expediente?",
        answer:
          "Solo el equipo AUROS, en el marco de la revisión de su expediente. Sin transmisión a terceros sin consentimiento explícito.",
      },
      {
        question: "¿Se venden mis datos o se usan para publicidad?",
        answer: "No. AUROS no vende datos ni muestra publicidad.",
      },
      {
        question: "¿Dónde se alojan mis datos?",
        answer:
          "En Vercel Edge Network con datacenters en Europa (Fráncfort, París). Sin transferencia fuera de la UE sin base legal RGPD.",
      },
      {
        question: "¿Puedo eliminar mi cuenta y mis datos?",
        answer:
          "Sí. Envíe una solicitud a privacy@auros.app — eliminación efectiva en 30 días.",
      },
      {
        question: "¿AUROS está sujeto al RGPD?",
        answer:
          "Sí. AUROS trata datos personales conforme al RGPD (Reglamento UE 2016/679).",
      },
      {
        question: "¿Quién es el DPO de AUROS?",
        answer: "El responsable del tratamiento está en privacy@auros.app.",
      },
      {
        question: "¿Los resultados del score son confidenciales?",
        answer:
          "Sí. Su puntuación y expediente son privados por defecto. Usted controla el intercambio mediante el enlace generado.",
      },
      {
        question: "¿Cuánto tiempo se conserva mi expediente?",
        answer:
          "Mientras su cuenta esté activa, más 3 años de inactividad. Puede solicitar la eliminación en cualquier momento.",
      },
    ],
  },
  socialProof: {
    eyebrow: "Pruebas",
    title: "Propietarios de activos y operadores",
    statDossiers: "2.400+",
    statDossiersLabel: "Expedientes generados (piloto)",
    statJurisdictions: "40+",
    statJurisdictionsLabel: "Jurisdicciones modeladas",
    statTime: "~12 min",
    statTimeLabel: "Tiempo medio expediente",
    statPlatforms: "5",
    statPlatformsLabel: "Fases data room",
    t1quote:
      "Puntuación y expediente en una tarde — sin idas y venidas jurídicas previas.",
    t1name: "Sofia M.",
    t1role: "Inmobiliario · Lyon",
    t2quote: "El expediente estructurado nos ahorró semanas.",
    t2name: "James K.",
    t2role: "Crédito privado · Londres",
    t3quote: "Presentación clara para nuestros LPs.",
    t3name: "Elena R.",
    t3role: "Arte · Ginebra",
  },
  dossierPreview: {
    eyebrow: "Entregables",
    title: "Un estudio de preparación — no un PDF de maqueta",
    subtitle:
      "Tras el wizard: espacio en línea: madurez del expediente, estudio regulatorio, data room — y export PDF si hace falta.",
    disclaimer:
      "Esquema de las secciones reales en /dossier — su contenido y puntuación, no un viñedo de ejemplo fijo.",
    ctaWizard: "Crear mi dossier",
    ctaDemo: "Ver dossier demo",
    blocks: [
      {
        tag: "01",
        title: "Puntuación y admisión",
        description:
          "Puntuación indicativa, % admisión, máximo 3 prioridades.",
      },
      {
        tag: "02",
        title: "Estudio de tokenización",
        description:
          "Ruta regulatoria, tokenomics, roadmap y proveedores.",
      },
      {
        tag: "03",
        title: "Data room (15 docs)",
        description:
          "Prioridades + subida progresiva; lista completa plegada por defecto.",
      },
      {
        tag: "04",
        title: "Solicitud a AUROS",
        description:
          "Envío al equipo en 48 h — sin comparador ni logos de terceros.",
      },
      {
        tag: "05",
        title: "Exportar y compartir",
        description: "PDF, pack legal .md, enlace — además del espacio en línea.",
      },
    ],
  },
  quickScore: {
    title: "Estimación rápida",
    close: "Cerrar",
    stepAsset: "Tipo de activo",
    stepValue: "Valor estimado",
    stepCountry: "País del activo",
    next: "Siguiente",
    back: "Volver",
    seeScore: "Ver puntuación",
    ctaFull: "Obtener informe completo",
    prefillNote: "El wizard se rellenará con sus 3 respuestas.",
    resultStep: "Resultado",
  },
  stats: {
    scoreMax: "Puntuación máx. (indicativa)",
    jurisdictions: "Jurisdicciones",
    sections: "Secciones expediente",
    avgTime: "Tiempo medio",
  },
  trust: {
    mica: "MiCA",
    gdpr: "RGPD",
    kyc: "KYC / AML",
    jurisdictions: "jurisdicciones",
  },
  tiers: {
    high: "Alto potencial de tokenización",
    mid: "Buen potencial",
    low: "Preparación recomendada",
  },
  quickScoreExplain: {
    default:
      "Puntuación indicativa según tipo de activo, valor declarado y jurisdicción.",
    high:
      "Perfil sólido para tokenización — expediente bien posicionado para revisión AUROS.",
    mid:
      "Buen potencial — complete el expediente (títulos, cumplimiento, ingresos) para maximizar elegibilidad.",
    low:
      "Preparación recomendada — aclare documentación y estructura jurídica.",
  },
  story: {
    act1Title: "Usted posee activos reales",
    act1Body:
      "Inmobiliario, arte, metales, vehículos — patrimonio tangible que los mercados digitales aún no leen bien.",
    act2Title: "El mundo digital aún no los ve",
    act2Body:
      "Regulación, iliquidez, documentación dispersa: la tokenización exige un lenguaje que pocos activos tienen.",
    act3Title: "AUROS traduce el activo para on-chain",
    act3Body:
      "Puntuación, expediente institucional y hoja de ruta — en minutos, sin compromiso.",
  },
  progress: {
    title: "Preparación para tokenización",
    subtitle: "Complete el expediente para subir la puntuación",
    itemAsset: "Tipo de activo identificado",
    itemValue: "Valor estimado",
    itemLocation: "Jurisdicción",
    itemDescription: "Descripción detallada (20+ palabras)",
    itemDocuments: "Documentación disponible",
    itemDossier: "Expediente completo generado",
  },
  scoreReveal: {
    tierHigh: "ALTO POTENCIAL DE TOKENIZACIÓN",
    tierStrong: "BUEN POTENCIAL DE TOKENIZACIÓN",
    tierModerate: "POTENCIAL MODERADO",
    tierPrep: "PREPARACIÓN RECOMENDADA",
    microHigh: "Top 12 % de activos en esta categoría",
    microStrong: "Top 28 % de activos en esta categoría",
    microModerate: "Rango mediano para esta clase de activo",
    microPrep: "Orientación de estructuración disponible",
  },
  howItWorks: {
    eyebrow: "Recorrido",
    title: "Tres pasos hasta su expediente",
    step1Title: "Describa el activo",
    step1Desc:
      "15 pasos guiados: tipo, valor, estructura, ingresos, cumplimiento. Cada pregunta se contextualiza para su clase de activo — sin jerga innecesaria.",
    step2Title: "Puntuación y expediente IA",
    step2Desc:
      "Informe institucional, estudio regulatorio, exportación PDF. La puntuación de preparación y las prioridades se generan en tiempo real a partir de sus respuestas.",
    step3Title: "Envío",
    step3Desc:
      "Envío al equipo AUROS, marco MiCA, próximos pasos concretos. Recibe una respuesta en 48 h laborables con las acciones prioritarias para avanzar.",
    step1Duration: "~2 min",
    step2Duration: "~8 min",
    step3Duration: "Respuesta en 48 h",
    screenshotPlaceholder: "Captura de pantalla wizard",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        question: "¿Debo preparar documentos antes de empezar?",
        answer:
          "No. El wizard guía cada paso. Los documentos (título, valoración, KYC) se solicitan al final del recorrido, no al inicio.",
      },
      {
        question: "¿Qué pasa si mi puntuación es baja?",
        answer:
          "AUROS proporciona 3 prioridades concretas a corregir — no una lista de 15 carencias. Puede mejorar el expediente y recalcular.",
      },
      {
        question: "¿Necesito un abogado antes de rellenar el expediente?",
        answer:
          "No. El expediente AUROS es una preparación, no un acto jurídico. El abogado interviene después, con un brief ya estructurado (~40% menos horas facturables).",
      },
      {
        question: "¿En qué plazo responde el equipo AUROS?",
        answer:
          "En 48 horas laborables tras el envío. Los Starter Kits de jurisdicción se entregan inmediatamente tras el pago.",
      },
      {
        question: "¿El expediente me compromete a algo?",
        answer:
          "No. Ningún compromiso, ninguna tarifa en esta fase. La decisión de tokenizar sigue siendo enteramente suya.",
      },
    ],
  },
  finalCta: {
    title: "Avance a la tokenización con un expediente listo",
    subtitle: "Gratis para empezar. Puntuación, expediente IA, PDF.",
    wizard: "Iniciar wizard",
    score: "Probar puntuación",
  },
  greenPromo: {
    eyebrow: "AUROS Green",
    title: "Ecosistema energía verde y RWA tokenizado",
    subtitle:
      "Mercado mundial, estándar RTMS, registro público y etiqueta Verified — estados honestos, sin greenwashing.",
    cta: "Hub del ecosistema",
    marketCta: "Mercado",
    registerCta: "Vender mi excedente",
  },
  assetUniverse: {
    eyebrow: "Universo RWA",
    title: "Cada activo real, listo para tokenizar",
    subtitle:
      "Admisión, data room y estudio regulatorio — despliegue on-chain en fase 2.",
    cards: [
      {
        title: "Inmobiliario",
        desc: "Residencial, comercial, suelo tokenizable.",
        stat: "€2.4T",
        statLabel: "mercado UE (indicativo)",
      },
      {
        title: "Arte y coleccionables",
        desc: "Obras, relojes, vinos.",
        stat: "48h",
        statLabel: "expediente tipo",
      },
      {
        title: "Crédito privado",
        desc: "Pools institucionales estructurados.",
        stat: "MiCA",
        statLabel: "marco UE",
      },
      {
        title: "Metales y energía",
        desc: "Oro, infraestructura productiva.",
        stat: "12+",
        statLabel: "clases",
      },
    ],
  },
  footer: {
    tagline: "Inteligencia de tokenización para activos reales.",
    product: "Producto",
    legal: "Legal",
    terms: "Términos",
    privacy: "Privacidad",
    legalNotice: "Aviso legal",
    rights: "AUROS · Todos los derechos reservados.",
    howItWorks: "Cómo funciona",
    discover: "Descubrir",
    trust: "Confianza",
    compareAll: "Comparar todos los rendimientos RWA",
    jurisdictionComparator: "Comparador jurisdicciones",
    stablecoins: "Stablecoins RWA",
    realEstate: "Inmobiliario RWA",
    bonds: "Bonos RWA",
    commodities: "Materias primas RWA",
    privateCredit: "Crédito privado RWA",
    academy: "AUROS Academy",
    green: "AUROS Green",
    faq: "FAQ",
    glossary: "Glosario RWA",
    tools: "Herramientas",
    resources: "Recursos",
    rwaIndex: "AUROS RWA Index",
    quarterlyReport: "State of RWA Issuers",
    about: "Acerca de",
    pricing: "Precios",
  },
};
