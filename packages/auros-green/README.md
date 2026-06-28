# @adrien1212balitrand/auros-green

Official TypeScript SDK for the [AUROS Green API](https://getauros.com/green/api).

## Install

```bash
npm install @adrien1212balitrand/auros-green
```

## Quickstart

```typescript
import { AurosGreen } from "@adrien1212balitrand/auros-green";

const green = new AurosGreen({ apiKey: process.env.AUROS_API_KEY });

// Unified score (CQS + Watt + Nature + benchmark)
const { score } = await green.getScore("toucan");
console.log(score.composite_score, score.carbon_quality?.score);

// Registry Connect — Verra / Gold Standard / Puro serial
const registry = await green.getRegistry("VCS-674");
console.log(registry.registry_connect.project_name);

// Nature Score Index
const { payload: natureIndex } = await green.getNatureIndex();
console.log(natureIndex.entries[0]?.name);

// Premium — monthly history
const { history } = await green.getScoreHistory("moss");
console.log(history.trend?.composite_delta);

// DPP Bridge JSON-LD
const dpp = await green.getDpp("toucan", "jsonld");
```

## Tiers

| Tier | Limit |
|------|-------|
| Anonymous | 100 req/day/IP |
| Free API key | 1 000 req/month |
| Premium | 25 000 req/month + history + batch 50 |

Free key: `POST https://getauros.com/api/v1/keys`

## Links

- [API Hub](https://getauros.com/green/api)
- [OpenAPI](https://getauros.com/api/green/openapi)
- [Registry Connect](https://getauros.com/green/registry-connect)
- [Nature Score Index](https://getauros.com/data/nature-score)
