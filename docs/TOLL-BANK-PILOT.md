# Bank Policy / Eligibility Pilot

**Surface :** `/green/toll/bank` · `GET|POST /api/v1/toll/bank-pilot`

One-tenant sticky package for a first bank: frozen rule set + decision log. Indicative HITL — never auto-blocks markets.

## Flow

1. `POST { action: "enroll", bankName, contactEmail, slug? }` → tenant
2. Desk `/green/toll/bank?slug=…`
3. `POST { action: "decide", slug, kind: "policy"|"eligibility", q }` → decision + `logId`

## Infra

Durable limits require Upstash — see `docs/UPSTASH-SETUP.md`. Probe: `/api/v1/toll/infra-status`.

## Related

Policy desk · Eligibility · Wallet attribution · Source attestation signed
