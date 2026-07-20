# AUROS Shield 0.3

Easy Proof Tap + Premium Evidence Pack.

## Free — 1-line integrate
```bash
curl -X POST https://getauros.com/api/v1/shield/ingest \
  -H "Authorization: Bearer auros_pk_live_…" \
  -H "Content-Type: text/plain" \
  --data-binary @./export.json
```
```js
import { instrumentFetch } from "@adrien1212balitrand/auros-shield";
globalThis.fetch = instrumentFetch({ apiKey: process.env.AUROS_KEY });
```

## Premium — Evidence Pack
`POST /api/v1/shield/pack` → CFU + taps, bank_actions, 7–30y retention, reseal PQC.

https://getauros.com/developers/shield
