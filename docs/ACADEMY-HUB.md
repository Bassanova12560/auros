# AUROS Academy hub — MVP vs later

## Live (MVP)

- Hub `/academy` — 3 schools + certification tiers + registry link
- Schools: `/academy/tokenized-resources`, `/academy/resource-trading`, `/academy/machine-economy`
- Modules `/academy/[school]/[101|201|301]` — ≥2 lessons + quiz unlock after lessons
- Métier filters (energy producer, water utility, bank/risk, counsel/issuer, platform builder, agent engineer)
- Content `data/academy/` — FR + EN (ES/AR/ZH fall back EN)
- Progress: Clerk auth + `academy_learning_progress` (service role) / memory fallback in non-prod
- Soft CTAs (max 3): Fundamentals cert, `/start`, `/lab` (also `/compare` / `/green` in lessons)
- Pricing honesty: free Fundamentals attestation; optional PDF diploma **39 €** (Stripe); institution **249 €**
- Existing verify / renew / registry / diploma PDF (`@react-pdf/renderer`)

## Deferred (do not claim live)

- Qualiopi or any state accreditation
- University / partner logos or fake testimonials
- Live on-chain certificate NFT mint
- Fellow / capstone project path
- B2B white-label curriculum
- In-person sessions
- Native AR/ZH lesson bodies (chrome may fall back EN)

## Ops

- Apply migration `supabase/migrations/0057_academy_learning_progress.sql` on production Supabase before relying on durable progress.
