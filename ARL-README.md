# Auros Resource Layer (ARL)

**Vision:** Connect metered resources (energy, water, compute-linked power) to on-chain units and agent APIs — with human gates where settlement matters.

Public previews: [getauros.com/resource-layer](https://getauros.com/resource-layer) · Demo dashboards: `/producer`, `/agent`, `/market`.

Full narrative: [docs/WHITEPAPER.md](docs/WHITEPAPER.md) · Pitch: [docs/PITCH.md](docs/PITCH.md) · Site map: [site/README.md](site/README.md).

## Architecture

| Component | Path | Role |
|-----------|------|------|
| **Protocol** | `protocol/` | Hardhat — `ResourceToken`, `ResourceOracle`, `DeviceRegistry` |
| **Agent API** | `agent-api/` | Forward orders, hedging cron, mint monitor, market stubs |
| **IoT bridge** | MQTT → oracle (see `docker-compose.yml`) | Telemetry ingress |
| **Site / app** | `app/` | Next.js UI — vision page + mock consoles |

```
Devices ──MQTT──► Mosquitto ──► iot-bridge ──► Oracle ──► protocol contracts
                                                      ▲
Agents / dashboards ──HTTP──► agent-api ──────────────┘
Users ──HTTPS──► Next.js (app/)
```

## Prerequisites

- Node.js ≥ 20
- Docker (optional, for Mosquitto + local chain stack)
- Copy env templates: `protocol/.env.example`, `agent-api/.env.example` — **never commit secrets**

## Install

```bash
# Next.js site (repo root)
npm install

# Protocol
cd protocol && npm install

# Agent API
cd ../agent-api && npm install
```

## Compile & test (protocol)

```bash
cd protocol
npm run compile
npm run test
```

## Deploy contracts (local)

Terminal 1:

```bash
cd protocol
npm run node
```

Terminal 2:

```bash
cd protocol
npm run deploy:localhost
```

Record deployed addresses in `agent-api/.env` (`RESOURCE_ORACLE_ADDRESS`, `RESOURCE_TOKENS_JSON`, `RPC_URL=http://127.0.0.1:8545`).

## Agent API (local)

```bash
cd agent-api
cp .env.example .env
# MOCK_MODE=true for UI-only demos without chain
npm run dev
```

Default port: `4100` (see `.env.example`).

## Full-stack simulation (Docker)

From repo root:

```bash
docker compose up --build
```

Next.js is **not** in Compose by default — run `npm run dev` separately at the repo root.

Orchestration helpers:

- `scripts/deploy-all.sh` (Unix)
- `scripts/deploy-all.ps1` (Windows)

## Monitoring stub

```bash
node scripts/arl-monitor.mjs
```

Alerts when oracle mint stream is silent longer than `MINT_ALERT_MINUTES` (env, default 15).

## Frontend routes (ARL)

| Route | File |
|-------|------|
| `/resource-layer` | `app/resource-layer/page.tsx` |
| `/resource-layer/faq` | `app/resource-layer/faq/page.tsx` |
| `/producer` | `app/producer/page.tsx` |
| `/agent` | `app/agent/page.tsx` |
| `/market` | `app/market/page.tsx` |
| `/careers` | `app/careers/page.tsx` |

Homepage band: `app/_components/ResourceLayerBanner.tsx`.

## Contact

- Integrations & pilots: resources@getauros.com
- Hiring: careers@getauros.com

## Security

Hardening notes (API rate limits, operator keys, IoT replay, oracle circuit-breaker, position caps): [docs/ARL-SECURITY.md](docs/ARL-SECURITY.md).

## Relation to main AUROS README

The root [README.md](README.md) documents the RWA wizard product. **This file** is the entry point for Resource Layer protocol + local stack only.
