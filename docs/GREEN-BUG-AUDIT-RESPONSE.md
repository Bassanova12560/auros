# AUROS Green — réponse audit bugs (2026-06-04)

Vérification du code actuel (`app/green`, `lib/green`) après Sprints 1–19. Beaucoup d’items de l’audit externe sont **périmés** (formulaires, carte Leaflet, rate limits déjà livrés).

## Synthèse

| Verdict | IDs |
|---------|-----|
| **Faux positif / périmé** | BUG-008, BUG-009, BUG-010 (carte), BUG-011 (Turnstile), UX-007 |
| **Corrigé ou renforcé** | BUG-007 (CTA hub), BUG-012, UX-008, UX-009 |
| **Backlog (hors scope pass)** | NFT, Pinecone, commission 3 %, Stripe label 300 €, API RTMS abonnement, boost ads, formation auditeur, Cloudflare Turnstile |

## Tableau détaillé

| ID | Statut | Evidence |
|----|--------|----------|
| **BUG-007** | **fixed** (renforcé) | `GreenHubHeroSection.tsx` : `PrimaryButton` → `/green/market` ; lien producteur → `/green/register?type=producer` ; lien **Référencer mon acteur** → `/green/register` (`secondaryRegisterCta`). L’intitulé audit « Déposer mon projet » n’existe plus dans le code (remplacé par libellés actuels + candidature label sur `/green/about` / `/green/label`). |
| **BUG-008** | **false** | `app/green/register/page.tsx` → `GreenRegisterView` → `GreenActorRegisterForm` ; serveur `saveGreenMarketActorAction` dans `lib/actions/green-market-actor.ts` (Zod implicite via validation serveur, pays, géocodage, rate limit 8/h/IP). |
| **BUG-009** | **false** | `app/green/label/page.tsx` → `GreenLabelView` → `GreenLabelForm` ; `saveGreenLabelAction` + upload PDF optionnel `uploadGreenLabelDocumentAction`. Stripe 300 € non implémenté (backlog monétisation). |
| **BUG-010** | **outdated** + **fixed** (alias) | Carte interactive sur **`/green/market`** (`GreenMarketMap`, popups nom/type/capacité/lien `greenMarketActorSheetHref` → `/green/market/actor/[id]`). Route audit **`/green/map`** absente → **301** vers `/green/market` (`GREEN_LEGACY_REDIRECTS` dans `next.config.ts`). |
| **BUG-011** | **partial** | Rate limits actifs : `green-market-actor` (8/h), `green-label` (5/h) via `lib/rate-limit.ts`. **Aucun** Turnstile / captcha dans le dépôt (`TURNSTILE_SITE_KEY` absent) — backlog infra anti-bot. |
| **BUG-012** | **fixed** | Hero hub : `w-full min-w-0 max-w-full`, boutons pleine largeur &lt; `sm`, typo `text-[10px]` sur CTA long (iPhone SE). |
| **UX-007** | **false** | Même que BUG-007 — CTAs hub ont des `href`. |
| **UX-008** | **fixed** | Même que BUG-012. |
| **UX-009** | **fixed** | Espace acteur canonique **`/green/my`** (`GreenMyView`, Clerk). **`/green/dashboard`** → **301** `/green/my` (pas de page dupliquée). |

## URLs de test (prod après deploy)

| Parcours | URL |
|----------|-----|
| Hub Green | https://auros.app/green |
| Inscription acteur | https://auros.app/green/register |
| Producteur (query) | https://auros.app/green/register?type=producer |
| Label Verified | https://auros.app/green/label |
| Place de marché + carte | https://auros.app/green/market |
| Fiche acteur (ex. seed) | https://auros.app/green/market/actor/demo-producer-fr |
| Alias carte (redirect) | https://auros.app/green/map → `/green/market` |
| Alias dashboard (redirect) | https://auros.app/green/dashboard → `/green/my` |
| Mes fiches | https://auros.app/green/my |

## Backlog séparé (non traité ce pass)

- NFT Green Proof, Pinecone, commission marketplace 3 %
- Stripe paiement label 300 €
- API RTMS subscription, boost annonces, formation auditeur
- Cloudflare Turnstile sur register/label (nécessite clés env + composant client)

## Références code

- Hub hero : `app/green/_components/GreenHubHeroSection.tsx`
- Redirects : `lib/green/constants.ts` (`GREEN_LEGACY_REDIRECTS`), `next.config.ts`
- Registre audit précédent : `docs/GREEN-AUDIT-IMPLEMENTATION.md`
