# @adrien1212balitrand/auros-protocol

<p align="center">
  <a href="https://getauros.com/developers">
    <img src="https://getauros.com/auros-logo.svg" alt="AUROS" width="120" />
  </a>
</p>

Official TypeScript/JavaScript SDK for the [AUROS Protocol](https://getauros.com/developers) — the RWA intelligence layer.

Score MiCA readiness, browse 120+ tokenized products, rank jurisdictions, and generate compliance checklists — all via REST with typed responses.

## Install

```bash
npm install @adrien1212balitrand/auros-protocol
```

## Quickstart (< 5 min)

```ts
import { AurosProtocol } from "@adrien1212balitrand/auros-protocol";

const client = new AurosProtocol({
  apiKey: "auros_pk_test_demo", // demo key — 100 req/mo on free tier
});

const result = await client.score({
  description:
    "Retail warehouse Luxembourg €2.5M SPV professional investors whitepaper draft",
});

console.log(result.score, result.grade, result.mica_classification);
```

Get your own key (free, 100 requests/month):

```ts
const { api_key } = await new AurosProtocol({ apiKey: "auros_pk_test_demo" }).createKey({
  email: "you@company.com",
});
console.log(api_key); // store securely — shown once
```

## Methods

| Method | Endpoint | Auth |
|--------|----------|------|
| `score(body)` | `POST /api/v1/score` | Bearer |
| `scoreBatch(body)` | `POST /api/v1/score/batch` | Bearer |
| `products(query?)` | `GET /api/v1/products` | Bearer |
| `jurisdictions(query?)` | `GET /api/v1/jurisdictions` | Bearer |
| `checklist(body)` | `POST /api/v1/checklist` | Bearer |
| `monitor(body)` | `POST /api/v1/monitor` | Bearer (premium) |
| `getMonitor(id)` | `GET /api/v1/monitor/:id` | Bearer (premium) |
| `deleteMonitor(id)` | `DELETE /api/v1/monitor/:id` | Bearer (premium) |
| `dossier(body)` | `POST /api/v1/dossier` | Bearer (premium) |
| `registerWebhook(body)` | `POST /api/v1/webhooks` | Bearer (premium) |
| `webhooks()` | `GET /api/v1/webhooks` | Bearer (premium) |
| `deleteWebhook(id)` | `DELETE /api/v1/webhooks/:id` | Bearer (premium) |
| `createKey(body)` | `POST /api/v1/keys` | None |
| `greenWattScore(id)` | `GET /api/green/watt/:id` | None |
| `greenCarbonQuality(id)` | `GET /api/green/carbon-quality/:id` | None |
| `greenWattBatch(body)` | `POST /api/v1/green/watt/batch` | Bearer (premium) |
| `greenCarbonQualityBatch(body)` | `POST /api/v1/green/carbon-quality/batch` | Bearer (premium) |

## Examples

### Score with structured fields

```ts
const score = await client.score({
  asset_type: "real_estate",
  issuer_type: "company_spv",
  investor_type: "professional",
  whitepaper: "draft",
  jurisdiction: "luxembourg",
  value_eur: 2_500_000,
  has_kyc: true,
  has_data_room: false,
});
```

### Browse RWA catalog

```ts
const catalog = await client.products({
  category: "bonds",
  yield_min: 4,
  sort: "apy",
  limit: 10,
});
```

### Rank jurisdictions

```ts
const ranking = await client.jurisdictions({
  asset_type: "real_estate",
  investor_type: "professional",
  timeline_months: 6,
  budget: 50_000,
});
```

### Compliance checklist

```ts
const checklist = await client.checklist({
  asset_type: "real_estate",
  jurisdiction: "luxembourg",
  structure: "spv",
});
```

### Green Watt & CQS

```ts
// Public reads — no API key required on these routes (batch calls need a premium live key)
const watt = await client.greenWattScore("sunexchange");
console.log(watt.watt_score.rating, watt.watt_score.tier);

const batch = await client.greenWattBatch({
  items: [
    { id: "sunexchange" },
    { text: "Solar farm 12 MW PPA signed production MWh France" },
  ],
});
console.log(batch.succeeded, batch.items[0]);
```

## Configuration

```ts
const client = new AurosProtocol({
  apiKey: process.env.AUROS_API_KEY!,
  baseUrl: "https://getauros.com", // default
  fetch: customFetch, // optional — for Node < 18 or testing
});
```

## Errors

```ts
import { AurosProtocolError } from "@adrien1212balitrand/auros-protocol";

try {
  await client.score({ description: "short" });
} catch (err) {
  if (err instanceof AurosProtocolError) {
    console.log(err.code, err.status, err.message);
    // unauthorized | quota_exceeded | validation_error | ...
  }
}
```

## Publishing (maintainers)

```bash
cd packages/auros-protocol
npm run build
npm login
npm publish --access public
```

Requires `NPM_TOKEN` in CI or interactive `npm login`. Do not publish without org approval.

## Disclaimer

Responses are **indicative intelligence only** — not legal, tax, or investment advice. Validate with qualified counsel before any issuance.

## Links

- [Developer docs](https://getauros.com/developers/docs)
- [OpenAPI spec](https://getauros.com/auros-openapi.yaml)
- [Playground](https://getauros.com/developers#playground)
