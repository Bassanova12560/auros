# Toll Recovery & Continuity Layer v0

**Surface :** `/green/toll/continuity` · `GET|POST /api/v1/toll/continuity`

Institutions pay to sleep: playbook templates + HITL checklists if a source dies, an operator disappears, a control wallet is compromised, an SPV servicer changes, or a data vendor exits.

## Product rules

- **Templates + checklists only** — not executed custody recovery, key rotation, or servicer substitution.
- **HITL** — enrollments and readiness are indicative continuity attestations.
- Storage: `.data/toll-continuity.json` (cap 2000 rows).

## Scenarios

| Kind | Meaning |
|------|---------|
| `source_outage` | Primary feed / utility / ERP / sensor outage |
| `operator_loss` | Key person / ops operator loss |
| `wallet_compromise` | Control wallet incident (freeze / notify path) |
| `servicer_change` | SPV servicer replacement |
| `vendor_death` | Data vendor sunset / failure |

Each scenario has a fixed playbook checklist in `lib/toll/continuity.ts` (`CONTINUITY_PLAYBOOKS`).

## Lib APIs

- `enrollContinuityPlan({ assetDnaId, scenario, checklistDone?, contactEmail?, notes? })`
- `listContinuityPlans({ assetDnaId?, scenario?, limit? })`
- `assessContinuityReadiness({ assetDnaId, scenarios? })` → `readinessScore` (0–100) + `gaps` + disclaimer

Scoring (indicatif): no plan = 0; enrolled with partial checklist ≈ 40–99; full checklist = 100; aggregate = mean over assessed scenarios.

## HTTP

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v1/toll/continuity?assetDnaId=&scenario=&limit=` | Rate-limited — list + templates |
| POST | `/api/v1/toll/continuity` enroll | Bearer + **policy** credits |
| POST | `/api/v1/toll/continuity` `{ "action": "assess", "assetDnaId" }` | Bearer + **policy** credits |

Default POST action is `enroll` if `action` omitted.

## Related

`AUROS-CASH-MACHINE-TOP20.md` #18 · Control Tower `/green/toll/tower` · Source Attestation · Exceptions OS.
