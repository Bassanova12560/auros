# AUROS Copilot

**Status:** v1 · public chat + internal draft inbox  
**Public:** `/copilot` · `POST /api/v1/copilot/chat`

## What it does

- Answers questions using **read-only tools**: ai-first RAG, Protocol products/compare, jurisdictions, ChargeFlow explain.
- Internal agents may draft catalog/content suggestions for human review.
- Approve sets `apply_result=queued_for_manual_merge` — **no automatic edit** of scores, attestations, CFU, or hub catalog code.

## Guardrails

- Never mint/retire ChargeFlow or change scores via Copilot tools.
- No claim of official Tesla / TotalEnergies partnership (prompt + soft post-filter).
- Rate limit on chat · shared `AI_DAILY_GENERATION_CAP` · provider chain Gemini → Groq → Mistral → OpenRouter (same as dossier).
- Internal ops APIs are authenticated server-side — **not documented publicly**.
- Content agent uses AI when keys are present; catalog scan stays deterministic (gap detection).
- Page context via query (`?context=compare&ids=…`, etc.) seeds read-only tools — no auto-publish.
- Compare assist can return `suggested_product_ids` for the user to add to `/compare` (human click only).

## Ops

Internal only. Do not publish endpoint lists, auth headers, or curl recipes in public channels.

## Costs

See `docs/AI-COSTS.md`. Copilot consumes the same daily generation budget.
