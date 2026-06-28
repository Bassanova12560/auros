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

const { score } = await green.getScore("toucan");
console.log(score.composite_score, score.carbon_quality?.score);

const registry = await green.getRegistry("VCS-674");
console.log(registry.registry_connect.project_name);
```

Free tier: no API key required (100 req/day/IP). Get a key at `POST https://getauros.com/api/v1/keys`.
