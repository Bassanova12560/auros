# Auros Resource Layer — Investor pitch (1-pager)

**Tagline:** The liquidity engine for tokenized resources — meters in, tradable units out.

## Thesis

- **$RWA issuance** is crowded; **resource liquidity** (kWh, water, compute-linked power) is not.
- AI data centers need **programmatic hedges**; solar sites need **real-time monetization** of surplus.
- ARL connects both with **oracle-gated ERC-20 units** + **agent API**, under **HITL** settlement.

## Product surfaces (live previews)

| Surface | URL | Status |
|---------|-----|--------|
| Vision | `/resource-layer` | Shipped (Next.js) |
| Producer console | `/producer` | Demo / mock |
| Agent console | `/agent` | Demo / mock |
| Marketplace | `/market` | Demo / mock |

## Stack

```
protocol/     Solidity (Hardhat, OZ UUPS)
agent-api/    TypeScript, Express, ethers v6
iot-bridge/   MQTT → oracle pipeline (local compose)
app/          Next.js 16 marketing + dashboards
```

## Traction narrative (fill for your deck)

- AUROS RWA wizard + issuer pipeline (existing product)
- ARL contracts compile + agent-api mock mode
- Design partners: producers, DC operators (pipeline — not named in public repo)

## Business model (hypothesis)

- Protocol fee on mint/burn volume (basis points, pilot-tier)
- SaaS for agent-api + monitoring (enterprise)
- RFQ / liquidity partner rev-share (post HITL)

## Market sizing (ASCII)

```
Global electricity market     ~$2T+/yr (orders of magnitude)
Addressable tokenized flows   << 1% today
  └─ if 0.1% rails via ARL    = $2B notional routing opportunity (illustrative)
```

```
AI power demand CAGR (public estimates)     ████████████░░  high
On-chain resource instrument adoption       ██░░░░░░░░░░░░  early
```

## Moat

1. **Combined issuer + flow** story (dossier + liquidity)
2. **Agent-first API** with safety gates
3. **IoT + oracle** integration path (not PDF-only RWAs)

## Ask (template)

- Seed extension / strategic for: 2 protocol engineers, 1 IoT, 1 MM partner onboarding
- Use of funds: Sepolia → mainnet pilot, security review, producer #1

## Risks (honest)

- Regulatory variance by region
- Oracle / device trust
- Liquidity cold-start — mitigated via HITL RFQ, not fake volume

**Contact:** resources@getauros.com · **Spec:** docs/WHITEPAPER.md
