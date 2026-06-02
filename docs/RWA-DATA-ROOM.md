# Data room RWA — structure AUROS

## 5 phases · 15 documents

| Phase | Documents |
|-------|-----------|
| 1 — Asset preparation | Proof of ownership, valuation report, due diligence report |
| 2 — Legal & regulatory | SPV documents, legal opinion, tax memo |
| 3 — Token design | Whitepaper, tokenomics, smart contract audit |
| 4 — Investor protection | Prospectus, risk disclosure, KYC/AML policy |
| 5 — Operations | Custody & audit agreements, financial reporting plan, insurance |

## 8 plateformes (matrice d'admission)

TokenFi, RWA.xyz, IX Swap, Stobox, Centrifuge, Ondo Finance, Polymesh, DeFiLlama.

Chaque plateforme définit dans `lib/rwa-platforms.ts` :

- Documents requis
- Classes d'actifs préférées
- Seuils de valeur (EUR)
- Exigences (EU, investisseur accrédité, cashflow, on-chain)

## Score affiché

- **Taux d'admission** (`lib/admission-scoring.ts`) — différenciateur produit
- **Data room %** — pondération des 15 documents
- **Conformité %** — champs wizard 10–14

Le score wizard final est aligné sur le taux d'admission global.
