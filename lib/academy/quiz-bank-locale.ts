import type { QuizQuestion } from "./types";

/** English question bank — same ids as FR for scoring compatibility. */
export const FUNDAMENTALS_BANK_EN: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What does RWA (Real-World Asset) mean?",
    options: [
      { id: "a", label: "A real asset tokenized on-chain (real estate, debt, funds…)" },
      { id: "b", label: "A native L1 cryptocurrency" },
      { id: "c", label: "An art-collectible NFT only" },
      { id: "d", label: "An algorithmic stablecoin" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q2",
    prompt: "What is the main role of a data room in RWA tokenization?",
    options: [
      { id: "a", label: "Store only the smart contract" },
      { id: "b", label: "Gather due diligence documents for investors and regulators" },
      { id: "c", label: "Replace investor KYC" },
      { id: "d", label: "Publish the marketing whitepaper" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q3",
    prompt: "In phase 0 of an RWA project, which decision is structural?",
    options: [
      { id: "a", label: "Website color choice" },
      { id: "b", label: "Structuring jurisdiction (SPV, regulator, tax)" },
      { id: "c", label: "Twitter follower count" },
      { id: "d", label: "Mandatory CEX listing" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    prompt: "MiCA mainly concerns…",
    options: [
      { id: "a", label: "EU crypto-assets framework (issuers, CASPs)" },
      { id: "b", label: "Building permits only" },
      { id: "c", label: "Real estate VAT only" },
      { id: "d", label: "SWIFT bank transfers" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    prompt: "A « permissioned » RWA token generally means…",
    options: [
      { id: "a", label: "Transfers restricted to eligible / whitelisted investors" },
      { id: "b", label: "Token without blockchain" },
      { id: "c", label: "Free token for everyone without KYC" },
      { id: "d", label: "Never transferable token" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q6",
    prompt: "DIFC (Dubai) is often cited for RWA because…",
    options: [
      { id: "a", label: "It bans all issuance" },
      { id: "b", label: "Regulated MENA hub with VARA/FSRA framework" },
      { id: "c", label: "It automatically replaces MiCA in Europe" },
      { id: "d", label: "Zero KYC for all assets" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q7",
    prompt: "Luxembourg is common for institutional RWA because…",
    options: [
      { id: "a", label: "Funds / vehicles ecosystem (RAIF, CSSF) and established EU hub" },
      { id: "b", label: "No supervision at all" },
      { id: "c", label: "Professional investors banned" },
      { id: "d", label: "Retail-only listing required" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q8",
    prompt: "Before issuing, a sponsor should typically…",
    options: [
      { id: "a", label: "Validate asset eligibility, structure and compliance with counsel" },
      { id: "b", label: "Deploy token without documentation" },
      { id: "c", label: "Ignore jurisdiction if site is in English" },
      { id: "d", label: "Confuse marketing with regulatory prospectus" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q9",
    prompt: "An AUROS Academy certificate…",
    options: [
      { id: "a", label: "Shows indicative understanding — does not replace regulator approval" },
      { id: "b", label: "Replaces CSSF or AMF license" },
      { id: "c", label: "Guarantees financial return" },
      { id: "d", label: "Waives all investor KYC" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q10",
    prompt: "Which assets are commonly tokenized as RWA?",
    options: [
      { id: "a", label: "Real estate, bonds, private credit, fund units" },
      { id: "b", label: "Internet memes only" },
      { id: "c", label: "Native BTC only" },
      { id: "d", label: "Algorithmic stablecoins only" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q11",
    prompt: "An SPV in RWA issuance mainly serves to…",
    options: [
      { id: "a", label: "Ring-fence the asset and channel flows / rights to token holders" },
      { id: "b", label: "Avoid all accounting" },
      { id: "c", label: "Replace KYC" },
      { id: "d", label: "List on DEX without due diligence" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q12",
    prompt: "Why does jurisdiction affect investor taxation?",
    options: [
      { id: "a", label: "Withholding, treaties and token qualification vary by country" },
      { id: "b", label: "Blockchain sets one global rate" },
      { id: "c", label: "Only wallet country matters, never SPV" },
      { id: "d", label: "Tax is always zero everywhere" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q13",
    prompt: "KYC in RWA mainly aims to…",
    options: [
      { id: "a", label: "Identify investors and verify eligibility (retail vs professional)" },
      { id: "b", label: "Set token price" },
      { id: "c", label: "Replace smart contract audit" },
      { id: "d", label: "Remove prospectus need" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q14",
    prompt: "Sponsors often confuse « marketing » with…",
    options: [
      { id: "a", label: "Regulatory documentation / prospectus — major compliance risk" },
      { id: "b", label: "Logo color code" },
      { id: "c", label: "PowerPoint slide count" },
      { id: "d", label: "MetaMask version" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q15",
    prompt: "Why renew an AUROS Academy certificate?",
    options: [
      { id: "a", label: "RWA rules evolve — keeps credibility up to date" },
      { id: "b", label: "AMF legal obligation" },
      { id: "c", label: "To receive free tokens" },
      { id: "d", label: "To skip due diligence" },
    ],
    correctOptionId: "a",
  },
];

/** Spanish question bank — same ids as FR. */
export const FUNDAMENTALS_BANK_ES: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "¿Qué significa RWA (Real-World Asset)?",
    options: [
      { id: "a", label: "Un activo real tokenizado on-chain (inmobiliario, deuda, fondos…)" },
      { id: "b", label: "Una criptomoneda nativa de un L1" },
      { id: "c", label: "Solo un NFT de colección artística" },
      { id: "d", label: "Un stablecoin algorítmico" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q2",
    prompt: "¿Cuál es el rol principal de una data room en tokenización RWA?",
    options: [
      { id: "a", label: "Almacenar solo el smart contract" },
      { id: "b", label: "Reunir documentos de due diligence para inversores y reguladores" },
      { id: "c", label: "Sustituir el KYC del inversor" },
      { id: "d", label: "Publicar el whitepaper de marketing" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q3",
    prompt: "En fase 0 de un proyecto RWA, ¿qué decisión es estructural?",
    options: [
      { id: "a", label: "El color del sitio web" },
      { id: "b", label: "La jurisdicción de estructuración (SPV, regulador, fiscalidad)" },
      { id: "c", label: "El número de seguidores en Twitter" },
      { id: "d", label: "Listing obligatorio en CEX" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    prompt: "MiCA concierne principalmente…",
    options: [
      { id: "a", label: "Marco UE de criptoactivos (emisores, CASP)" },
      { id: "b", label: "Permisos de construcción inmobiliaria" },
      { id: "c", label: "Solo IVA inmobiliario" },
      { id: "d", label: "Transferencias SWIFT bancarias" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    prompt: "Un token RWA « permissioned » significa generalmente…",
    options: [
      { id: "a", label: "Transferencias restringidas a inversores elegibles / whitelist" },
      { id: "b", label: "Token sin blockchain" },
      { id: "c", label: "Token gratuito sin KYC" },
      { id: "d", label: "Token nunca transferible" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q6",
    prompt: "DIFC (Dubai) se cita a menudo para RWA porque…",
    options: [
      { id: "a", label: "Prohíbe toda emisión" },
      { id: "b", label: "Hub regulado MENA con marco VARA/FSRA" },
      { id: "c", label: "Sustituye automáticamente MiCA en Europa" },
      { id: "d", label: "Cero KYC obligatorio" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q7",
    prompt: "Luxemburgo es frecuente para RWA institucional porque…",
    options: [
      { id: "a", label: "Ecosistema fondos / vehículos (RAIF, CSSF) y hub UE establecido" },
      { id: "b", label: "Ausencia total de supervisión" },
      { id: "c", label: "Inversores profesionales prohibidos" },
      { id: "d", label: "Solo listing retail obligatorio" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q8",
    prompt: "Antes de emitir, un promotor debe típicamente…",
    options: [
      { id: "a", label: "Validar elegibilidad del activo, estructura y compliance con counsel" },
      { id: "b", label: "Desplegar token sin documentación" },
      { id: "c", label: "Ignorar jurisdicción si el sitio está en inglés" },
      { id: "d", label: "Confundir marketing y prospecto regulatorio" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q9",
    prompt: "Un certificado AUROS Academy…",
    options: [
      { id: "a", label: "Acredita comprensión indicativa — no sustituye aprobación regulatoria" },
      { id: "b", label: "Sustituye licencia CSSF o AMF" },
      { id: "c", label: "Garantiza rentabilidad financiera" },
      { id: "d", label: "Dispensa de todo KYC inversor" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q10",
    prompt: "¿Qué activos se tokenizan comúnmente en RWA?",
    options: [
      { id: "a", label: "Inmobiliario, bonos, crédito privado, participaciones de fondos" },
      { id: "b", label: "Solo memes de internet" },
      { id: "c", label: "Solo BTC nativo" },
      { id: "d", label: "Solo stablecoins algorítmicos" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q11",
    prompt: "Un SPV en emisión RWA sirve sobre todo para…",
    options: [
      { id: "a", label: "Aislar el activo y canalizar flujos / derechos a inversores tokenizados" },
      { id: "b", label: "Evitar toda contabilidad" },
      { id: "c", label: "Sustituir KYC" },
      { id: "d", label: "Listar en DEX sin due diligence" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q12",
    prompt: "¿Por qué la jurisdicción influye en la fiscalidad del inversor?",
    options: [
      { id: "a", label: "Retenciones, tratados y calificación del token varían por país" },
      { id: "b", label: "La blockchain impone un tipo único mundial" },
      { id: "c", label: "Solo importa el país del wallet, nunca el SPV" },
      { id: "d", label: "La fiscalidad es siempre cero" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q13",
    prompt: "El KYC en RWA busca principalmente…",
    options: [
      { id: "a", label: "Identificar inversores y verificar elegibilidad (retail vs pro)" },
      { id: "b", label: "Fijar el precio del token" },
      { id: "c", label: "Sustituir auditoría smart contract" },
      { id: "d", label: "Eliminar necesidad de prospecto" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q14",
    prompt: "Un promotor confunde a menudo « marketing » con…",
    options: [
      { id: "a", label: "Documentación regulatoria / prospecto — riesgo compliance mayor" },
      { id: "b", label: "Código de color del logo" },
      { id: "c", label: "Número de diapositivas PowerPoint" },
      { id: "d", label: "Versión de MetaMask" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q15",
    prompt: "¿Por qué renovar un certificado AUROS Academy?",
    options: [
      { id: "a", label: "Las reglas RWA evolucionan — mantiene credibilidad actualizada" },
      { id: "b", label: "Obligación legal AMF" },
      { id: "c", label: "Para recibir tokens gratis" },
      { id: "d", label: "Para evitar due diligence" },
    ],
    correctOptionId: "a",
  },
];
