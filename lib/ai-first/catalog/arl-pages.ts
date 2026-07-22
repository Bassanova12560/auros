import { enrichPage } from "../enrich";

export const resourceLayerPage = enrichPage({
  id: "resource-layer",
  path: "/resource-layer",
  title: "Auros Resource Layer | Liquidity for tokenized resources",
  description:
    "Tokenize metered energy, water, and compute-linked power. WATT unit-of-account design, roadmap, and HITL pilots.",
  summary:
    "Auros Resource Layer connects IoT-attested production to on-chain resource units and agent APIs. Demos are labeled; paid and compliance paths stay human-in-the-loop. WATT is an energy unit-of-account design in preview — not a public sale on this site.",
  contentType: "product",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: [
    "Auros Resource Layer",
    "tokenized kWh",
    "WATT energy stablecoin",
    "machine economy",
    "IoT Proof-of-Resource",
  ],
  intents: [
    "How do I tokenize solar production?",
    "What is WATT?",
    "Where is the ARL roadmap?",
  ],
  audience: ["energy producers", "data centers", "IoT OEMs", "institutions"],
  facts: [
    { key: "Status", value: "Testnet demos + Hardhat protocol" },
    { key: "Contact", value: "resources@getauros.com" },
    { key: "HITL", value: "Paid / compliance paths human-gated" },
  ],
  relatedPaths: ["/builders", "/lab", "/trade", "/producer", "/careers", "/press"],
});

export const buildersPage = enrichPage({
  id: "builders",
  path: "/builders",
  title: "Builders — Auros Resource Layer protocol",
  description:
    "Architecture, mint→trade motion demo, GitHub monorepo, Early Builder lab badge, testnet access.",
  summary:
    "Builder hub for Auros Resource Layer: architecture from MQTT to agent API, animated lab demo, public repository, and testnet access requests. Early Builder badges are local lab codes — not Verified NFTs.",
  contentType: "guide",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["ARL builders", "resource protocol", "MQTT oracle", "agent API"],
  intents: ["How do I build on ARL?", "Where is the ARL GitHub?"],
  audience: ["protocol engineers", "IoT engineers", "agent builders"],
  facts: [
    { key: "Repo", value: "github.com/Bassanova12560/auros" },
    { key: "Access", value: "resources@getauros.com" },
  ],
  relatedPaths: ["/resource-layer", "/lab", "/trade", "/careers"],
});

export const energyLabPage = enrichPage({
  id: "lab",
  path: "/lab",
  title: "Energy Lab — simulate producer revenue | AUROS",
  description:
    "Interactive sandbox: daily kWh, mock market price, uptime → illustrative revenue. Not a PPA.",
  summary:
    "Energy Lab lets producers slide production and price knobs to see illustrative token mint and revenue. Educational only — not an offtake agreement or financial advice.",
  contentType: "tool",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["energy lab", "kWh tokenization simulator", "producer revenue"],
  intents: ["Estimate revenue from tokenized solar", "Simulate mint and sell kWh"],
  audience: ["solar producers", "energy operators"],
  facts: [{ key: "Label", value: "Lab sandbox · illustrative" }],
  relatedPaths: ["/resource-layer", "/producer", "/builders"],
});

export const pressPage = enrichPage({
  id: "press",
  path: "/press",
  title: "Press — AUROS",
  description: "Media and diligence desk. No fabricated outlet logos.",
  summary:
    "Minimal press desk for AUROS: factual descriptors, narrative links, and written requests for quotes or entity docs. We do not display invented media logos.",
  contentType: "guide",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["AUROS press", "media kit"],
  intents: ["Press contact AUROS", "Diligence pack"],
  audience: ["journalists", "institutions"],
  facts: [{ key: "Contact", value: "resources@getauros.com" }],
  relatedPaths: ["/legal", "/resource-layer", "/builders"],
});

export const tradePage = enrichPage({
  id: "trade",
  path: "/trade",
  title: "Trade terminal — Resource Layer demo | AUROS",
  description: "Demo terminal for resource spot, perps, and options. Simulated orders.",
  summary:
    "Unified demo ticket for tokenized kWh and Phase 3 derivatives. Orders are simulated; production routing uses agent-api and HITL settlement.",
  contentType: "app",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["resource trading", "energy perps demo"],
  intents: ["Demo trade tokenized energy"],
  audience: ["traders", "builders"],
  facts: [{ key: "Mode", value: "Demo / simulated" }],
  relatedPaths: ["/resource-layer", "/builders", "/lab", "/market"],
});

export const producerPage = enrichPage({
  id: "producer",
  path: "/producer",
  title: "Producer dashboard — Resource Layer demo | AUROS",
  description: "Preview console for devices, production, and minted resource tokens.",
  summary:
    "Demo producer console showing devices, production, and token balance for energy sites. Labeled demo — not live settlement.",
  contentType: "app",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["energy producer dashboard", "akWh mint demo"],
  intents: ["See producer mint flow"],
  audience: ["energy producers"],
  facts: [{ key: "Mode", value: "Demo" }],
  relatedPaths: ["/lab", "/resource-layer", "/builders"],
});

export const careersArlPage = enrichPage({
  id: "careers",
  path: "/careers",
  title: "Careers — Auros Resource Layer | AUROS",
  description:
    "Hiring: Head of IoT Integration, Protocol Engineer — Energy Markets, and markets roles.",
  summary:
    "Open roles for Auros Resource Layer: IoT integration, Solidity energy markets, and resource markets leadership. Remote-friendly EU time zones.",
  contentType: "guide",
  language: "en",
  indexable: true,
  lastUpdated: "2026-07-22",
  keywords: ["AUROS careers", "IoT engineer", "Solidity energy markets"],
  intents: ["Jobs at AUROS Resource Layer"],
  audience: ["engineers", "markets talent"],
  facts: [{ key: "Apply", value: "careers@getauros.com" }],
  relatedPaths: ["/builders", "/resource-layer", "/blog/cross-exchange-risk-engine"],
});

export const arlPages = [
  resourceLayerPage,
  buildersPage,
  energyLabPage,
  pressPage,
  tradePage,
  producerPage,
  careersArlPage,
];
