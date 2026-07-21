# Proof Stream v0

Living event journal for an [Asset DNA](./ASSET-DNA-V1.md) — not a static dossier snapshot.

## Events

| Action | When |
|--------|------|
| `dna.minted` | DNA created |
| `market.submitted` | Actor register pending |
| `market.approved` / `market.rejected` | Ops moderation |
| `registry.published` | Label → registry |

## Read

`GET /api/v1/asset-dna/{id}/stream`

## Storage

Local `.data/proof-stream.json` + optional Supabase `proof_stream_events` (migration 0054).
