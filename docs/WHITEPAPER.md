# Auros Resource Layer — Whitepaper (draft)

**Status:** design document for pilots — not a securities offering or grid interconnection approval.

## 1. Abstract

Auros Resource Layer (ARL) bridges **metered physical resources** and **on-chain ERC-20 units** with oracle-gated mint and burn. It targets the *flow* side of real-world assets: kilowatt-hours, water volumes, and related measurable commodities that power AI infrastructure and renewable export.

## 2. Problem statement

RWA tokenization excels at cap-table and document workflows (AUROS dossier tooling). Secondary liquidity for the **underlying flows** — especially energy — remains fragmented: OTC quotes, delayed settlement, and agent systems that cannot safely interact with the grid.

## 3. Design principles

1. **Metered reality** — mint only from attested readings, not marketing claims.
2. **Pause and upgrade** — UUPS upgradeable contracts with explicit roles.
3. **HITL by default** — automation proposes; humans approve settlement where required.
4. **Least exposure** — public docs describe outcomes, not operational attack maps.

## 4. Protocol architecture

```
[ IoT / meters ] → MQTT (iot-bridge) → [ Oracle service ] → ResourceOracle.sol
                                                      ↓
                                            ResourceToken.sol (AKWH, AH2O, …)
                                                      ↓
                              [ Pools / RFQ ] ← agent-api (agents, hedgers)
```

### 4.1 Smart contracts (`protocol/`)

- **ResourceToken** — ERC-20, one token = one resource unit; `RESOURCE_ORACLE` role mints/burns.
- **ResourceOracle** — aggregates attestations; pausable.
- **DeviceRegistry** — maps device identities to producers.

### 4.2 Agent API (`agent-api/`)

HTTP surface for forward orders, hedge cron, mint monitoring, and market quotes. Requires `x-agent-id` when `AGENT_ID_REQUIRED=true`. Mock mode supports local simulation without chain keys.

### 4.3 IoT bridge

MQTT subscriber that normalizes telemetry and forwards signed batches to the oracle pipeline. Mosquitto is the default local broker.

### 4.4 Site (`app/`)

Marketing and **demo dashboards** (`/producer`, `/agent`, `/market`) — mock data, clearly labeled.

## 5. Tokenomics (AUR / WATT / resource tokens)

| Instrument | Role |
|------------|------|
| **AKWH / AH2O** | Resource tokens — claim on one kWh or one litre-equivalent unit within pilot rules |
| **WATT** | Working name for watt-hour denominated micro-units in some pools (pilot-specific) |
| **AUR** | Ecosystem coordination token — governance, fee routing, and partner incentives (parameters TBD per jurisdiction) |

No fixed supply numbers in this draft. Pilots use testnet mint caps and multisig treasury.

## 6. Oracle and IoT security

- Device registration with rotating credentials
- Stale reading rejection
- Mint silence alerts (see `scripts/arl-monitor.mjs`)
- Separation of oracle keys from agent API keys

## 7. Liquidity

Resource tokens pair against stable liquidity routes (Uniswap-style routers in production configs). Demo UI shows **indicative** depth only.

## 8. Use cases

1. **Solar export monetization** — mint from export meter, sell AKWH on regional market.
2. **Data-center hedge** — agent forecasts load, schedules forward buys, tracks hedge ratio.
3. **Water-stressed compute** — AH2O units for cooling-heavy sites (California pilots).
4. **Issuer + flow** — SPV token for asset ownership; ARL for energy revenue line transparency.

## 9. Regulatory posture

Grid laws, GO certificates, and securities qualification remain off-chain with counsel. AUROS software does not replace balancing responsibility or licensed trading venues.

## 10. Roadmap (indicative)

1. Local full stack (Hardhat + agent-api + Mosquitto)
2. Sepolia deploy with capped mint
3. Producer pilot (single site, HITL withdraw)
4. Agent partner (forecast + forward queue)
5. Market maker RFQ integration

## References

- [ARL-README.md](../ARL-README.md) — install and deploy
- [PITCH.md](./PITCH.md) — investor summary
- Live previews: `/resource-layer`, `/producer`, `/agent`, `/market`

Contact: resources@getauros.com
