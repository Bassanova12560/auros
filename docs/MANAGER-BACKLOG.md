# Manager backlog — AUROS

Living priorities. Manager owns this; update when shipping or discovering debt.
Last review: 2026-07-21.

## P0 — maintenant (risque / trust / cash)

| Item | Pourquoi | Statut |
|------|----------|--------|
| Repo GitHub **privé** + secret scanning | Code = surface d’attaque | **Bloqué** : `gh auth login` côté machine, puis `gh repo edit … --visibility private` |
| Ne jamais re-exposer secrets / recettes ops | Déjà durci ; maintenir | OK — règle agent |
| Séparer `ATTEST_SIGNING_KEY` de `CRON_SECRET` en prod | Un leak cron ≠ falsifier attestations | À vérifier sur Vercel |
| Upstash Redis pour rate limits prod | Sinon limites mémoire = faibles sous multi-instance | À confirmer env Vercel |

## P1 — performance produit (conversion)

| Item | Pourquoi |
|------|----------|
| Mesurer le tunnel **WELHR → playbook/ROI → WETS/verify** | Sinon on ship des surfaces sans savoir ce qui convertit |
| Revue humaine inbox Copilot / social drafts (habitude ops) | Drafts sans revue = feature morte |
| Express wizard + 3 priorités data room sur tous les CTA hot | UX déjà codée ; cohérence landing → start |
| Attribution partenaires → 2–3 pilotes réels (phase C live) | Modèle éco vivant, pas dashboard fantôme |

## P2 — idées fortes mais pas urgentes

| Item | Note |
|------|------|
| Liquidity Bridge (RFQ / 1 MM) | `PROPOSITION-PLATEFORMES` — seulement avec LOI |
| Academy Praticien (contenu) | Waitlist OK ; pas de fake parcours |
| KYC / deploy SC | Hors cœur vision actuelle |
| BIM/ERP plugins natifs | Rester export-first |
| Auto-publish LinkedIn/X | Rester human-in-the-loop |
| Spot/lithium « live trading » | Rester snapshot indicatif |

## Erreurs à ne plus refaire

- Claims **35 %**, **sans clic**, URLs affiliées inventées
- Mettre « 15 étapes » en vedette (4 parties max)
- Documenter chemins `/api/admin` / cron / `CRON_SECRET` en public
- Ship sans check secrets / gitignore / exposition docs
- Overbuild marketing hero (stats, chips) — UX psychology

## Cœur produit (ne pas diluer)

**AUROS = dossier RWA + preuves eau/énergie (Détecter → Décider → Prouver).**  
Tout le reste sert ce tunnel ou attend.
