# ARL security notes

> **INTERNAL** — High-level operator reminders only. Do not publish control inventories, header names, or rate-limit constants in public READMEs or trust pages.

Defense-in-depth for the Auros Resource Layer. Demos remain mock / HITL — treat dashboards as non-settlement until audited.

## Principles

- **Least privilege** on operator and agent credentials; rotate if shared or leaked.  
- **Never commit** `.env` — templates only (`.env.example`).  
- **Public surfaces** expose product APIs and demos; internal mutate / bootstrap paths stay authenticated and undocumented publicly.  
- **IoT / MQTT** : prefer TLS + device auth; insecure TLS only for local lab.  
- **Protocol** : upgradeability, pause, and oracle guards are design concerns for mainnet — not a public checklist to map.

## Responsible disclosure

See root [SECURITY.md](../SECURITY.md) — **security@getauros.com**.

## Ops checklist (operators)

1. Secrets only in host env / secret managers.  
2. Restrict CORS / origins to known production hosts.  
3. Keep settlement paths human-gated until audit + policy allow.  
4. Prefer private GitHub for this monorepo — see `docs/REPO-VISIBILITY.md`.
