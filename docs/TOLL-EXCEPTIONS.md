# Toll Exception Management OS v0

**Surface :** `/green/toll/exceptions` · `GET/POST /api/v1/toll/exceptions` · `GET/PATCH /api/v1/toll/exceptions/[id]`

Ops queue for messy cases: missing docs, jurisdiction conflict, stale data, partial availability.

## Product rules

- **HITL only** — escalate, assign, resolve with a human evidence note.
- **No auto-resolution** that claims compliance.
- Storage: `.data/toll-exceptions.json` (same local JSON pattern as Toll sources / liquidity waitlist).

## Status / severity

| Status | Meaning |
|--------|---------|
| `open` | New case |
| `escalated` | Raised for senior / legal review |
| `resolved` | Desk closed the loop with a note |
| `closed` | Archived after resolve (or direct close) |

Severity: `low` | `medium` | `high`. Optional SLA `dueAt` (ISO); `autoSla: true` on create suggests H24 / 72h / 7d.

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v1/toll/exceptions` | Rate-limited |
| POST | `/api/v1/toll/exceptions` | Bearer + light trail credit |
| GET | `/api/v1/toll/exceptions/[id]` | Rate-limited (full evidence) |
| PATCH | `/api/v1/toll/exceptions/[id]` | Bearer + light trail credit |

Resolve: `PATCH …/[id]` with `{ "action": "resolve", "resolutionNote": "…" }`.

Kinds: `missing_docs` · `jurisdiction_conflict` · `stale_data` · `partial_availability` · `other`.

Voir `AUROS-CASH-MACHINE-TOP20.md` · Control Tower `/green/toll/tower`.
