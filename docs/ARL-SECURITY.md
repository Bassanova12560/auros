# ARL security notes

Defense-in-depth for the Auros Resource Layer stack. Demos remain mock/HITL — these controls reduce abuse surface before mainnet settlement.

## Agent API (`agent-api/`)

| Control | Detail |
|---------|--------|
| Agent ID | `X-Agent-ID` required unless `AGENT_ID_REQUIRED=false`; schema blocks newlines / injection |
| Rate limits | Global + stricter mutate limits (`RATE_LIMIT_*`) |
| CORS | Allowlist via `CORS_ORIGINS` |
| Headers | `nosniff`, `DENY` frame, `no-store`, permissions policy |
| Body size | JSON capped at 32kb |
| Operator key | `ARL_OPERATOR_KEY` / `AUROS_LIQUIDITY_API_KEY` for mark-price, insurance report, compute mint, provide-liquidity |
| Validation | Zod + strict eth addresses / index ids |
| Secrets | Timing-safe compare for API keys |
| Health | `/health` exempt from agent-id (probes) |

## IoT bridge (`iot-bridge/`)

| Control | Detail |
|---------|--------|
| Auth | ECDSA production signatures + device allowlist / registry |
| Freshness | Timestamp skew window (`IOT_MAX_SKEW_MS`) |
| Replay | Digest cache of processed messages |
| Size | Payload byte cap |
| Rate | Per-device mint rate (`IOT_DEVICE_RATE_PER_MIN`) |
| Topic | Topic device id must match payload |

## Protocol (`protocol/`)

| Control | Detail |
|---------|--------|
| Upgradeability | UUPS + owner-gated `_authorizeUpgrade` |
| Reentrancy | Guard on mint / trade / lend paths |
| Pause | Pausable on critical contracts |
| Oracle | Circuit-breaker on index price jumps; `setPriceForced` owner-only |
| Futures | `MAX_MARGIN`, `MAX_OPEN_INTEREST`, leverage caps |
| Options | Expiry window, size/premium caps, no self-trade |
| Lending | LTV 50% MVP + `MAX_BORROW` per borrow |
| Proofs | `ResourceOracle` marks used proofs |

## Ops checklist

1. Never commit `.env` — use `.env.example` only.
2. Set long random `ARL_OPERATOR_KEY` in any shared/staging deploy.
3. Restrict `CORS_ORIGINS` to production origins.
4. Prefer MQTT auth + TLS; avoid `MQTT_TLS_INSECURE=true` outside local lab.
5. Treat UI dashboards as demos until settlement is audited and HITL-gated.
