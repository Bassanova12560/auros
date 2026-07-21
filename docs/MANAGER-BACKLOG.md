# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-21 (P0/P1 execution).

## P0 — maintenant (risque / trust / cash)

| Item | Pourquoi | Statut |
|------|----------|--------|
| Repo GitHub **privé** + secret scanning | Code = surface d’attaque | **Bloqué** : `gh auth login` puis `gh repo edit Bassanova12560/auros --visibility private` |
| Ne jamais re-exposer secrets / recettes ops | Déjà durci ; maintenir | OK — règle agent |
| `ATTEST_SIGNING_KEY` dédiée en prod | Un leak cron ≠ falsifier preuves | **En cours** — ajout Vercel + redeploy |
| Upstash Redis rate limits | Multi-instance Vercel | **Action user** — `docs/UPSTASH-SETUP.md` (5 min) |

## P1 — performance produit (conversion)

| Item | Pourquoi | Statut |
|------|----------|--------|
| Mesurer tunnel WELHR → playbook/ROI → verify | Savoir ce qui convertit | **Ship** — events `funnel_*` → Vercel Analytics |
| Revue humaine inbox Copilot / social drafts | Drafts sans revue = feature morte | Ops habit |
| Express wizard + 3 priorités sur CTA hot | Cohérence landing → start | À vérifier parcours |
| Attribution partenaires → 2–3 pilotes | Modèle éco vivant | À venir |

## P2 — idées fortes mais pas urgentes

| Item | Note |
|------|------|
| Liquidity Bridge (RFQ / 1 MM) | Seulement avec LOI |
| Academy Praticien (contenu) | Waitlist OK |
| KYC / deploy SC | Hors cœur |
| BIM/ERP plugins natifs | Export-first |
| Auto-publish LinkedIn/X | Human-in-the-loop |
| Spot/lithium live trading | Snapshot indicatif |

## Erreurs à ne plus refaire

- Claims **35 %**, **sans clic**, URLs affiliées inventées
- « 15 étapes » en vedette (4 parties max)
- Documenter `/api/admin` / cron / secrets en public
- Ship sans check secrets / exposition
- Overbuild hero marketing

## Cœur produit

**AUROS = dossier RWA + preuves eau/énergie (Détecter → Décider → Prouver).**
