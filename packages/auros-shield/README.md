# AUROS Shield

On-prem + cloud Proof Tap for RWA — freemium underlayer.

## Free
- Local `POST /v1/tap` (hash only, payload discarded)
- Cloud `POST /api/v1/shield/tap` — 100 anchors / month
- Public `POST /api/v1/shield/verify` — forever free
- CBOM

## Premium
- Unlimited taps, hybrid_pqc_ready, receipt export

```bash
npm install @adrien1212balitrand/auros-shield
export AUROS_SHIELD_SIGNING_KEY="…HSM…"
npx auros-shield tap --file ./export.json
npx auros-shield serve --port 8787
```

https://getauros.com/developers/shield
