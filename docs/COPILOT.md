# AUROS Copilot

**Status:** v1 · public chat + ops draft inbox  
**Routes:** `/copilot` (public) · `/ops/copilot` (ops)  
**API:** `POST /api/v1/copilot/chat` · `GET/POST /api/ops/copilot/drafts*`

## What it does

- Answers questions using **read-only tools**: ai-first RAG, Protocol products/compare, jurisdictions, ChargeFlow explain.
- Ops agents create **drafts** (catalog gaps, content FAQ/blurb/changelog) stored in `copilot_drafts` (Supabase or `.data` fallback).
- Humans **approve / reject** in `/ops/copilot`. Approve sets `apply_result=queued_for_manual_merge` — **no automatic edit** of scores, attestations, CFU, or hub catalog code.

## Guardrails

- Never mint/retire ChargeFlow or change scores via Copilot tools.
- No claim of official Tesla / TotalEnergies partnership (prompt + soft post-filter).
- Rate limit on chat · shared `AI_DAILY_GENERATION_CAP` · provider chain Gemini → Groq → Mistral → OpenRouter (same as dossier).
- Ops endpoints require `Authorization: Bearer CRON_SECRET`.
- Content agent uses AI when keys are present; catalog scan stays deterministic (gap detection).
- Page context via query (`?context=compare&ids=…`, `?context=jurisdiction&jid=…`, `?context=chargeflow`, `?context=green`, `?context=rtms`) seeds read-only tools — no auto-publish.
- Compare assist can return `suggested_product_ids` for the user to add to `/compare` (human click only).
- Optional `GEMINI_API_KEY_2` for quota failover.

## Ops quickstart

```bash
# Scan catalog gaps → drafts
curl -X POST https://getauros.com/api/ops/copilot/drafts/scan \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"catalog","limit":8}'

# Content draft
curl -X POST https://getauros.com/api/ops/copilot/drafts/scan \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"content","topic":"Qu’est-ce que CFU-E ?","kind_hint":"faq"}'

# List pending
curl "https://getauros.com/api/ops/copilot/drafts?status=pending" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Apply migration: `supabase/migrations/0039_copilot_drafts.sql`.

## Costs

See `docs/AI-COSTS.md`. Copilot consumes the same daily generation budget.
