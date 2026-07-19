# AUROS × petites plateformes RWA — double proposition

## Leurs deux problèmes (dans l’ordre)

| # | Douleur plateforme | Ce qu’elles disent souvent |
|---|-------------------|---------------------------|
| **1** | **Pas assez de bons émetteurs / dossiers** | « On manque de deals qualifiés », onboarding coûteux, dossiers incomplets |
| **2** | **Liquidité faible après émission** | « Le token existe mais ne trade pas », spread large, pas de market making |

Les **petites plateformes** souffrent des deux plus que les géants (Centrifuge, etc.) qui ont déjà réseau + liquidité institutionnelle.

---

## Proposition AUROS en deux briques

### Brique 1 — **Issuer pipeline** (aujourd’hui, cœur produit)

**AUROS = démocratisation du dossier RWA** → vous leur amenez des **clients préparés**.

| Livrable | Valeur pour la plateforme |
|----------|---------------------------|
| Wizard + dossier | Moins de temps onboarding |
| Score + % admission | Tri des leads (vous / eux) |
| Data room 15 pièces | Due diligence amont |
| Studio + PDF | Crédibilité face à leurs compliance |

**Modèle revenu** : fee par dossier soumis, % sur mandat d’émission, ou rev share sur setup — **contrat B2B plateforme**, en plus des % apporteurs.

**Message plateforme**  
> « On vous envoie des émetteurs déjà structurés ; vous gardez l’émission et la relation. »

### Brique 2 — **Liquidity Bridge** (demain, produit distinct)

**Outil de market making / pont de liquidité** pour tokens RWA **déjà émis** — surtout sur plateformes sans desk ni MM dédié.

| Fonction cible (vision) | Note |
|-------------------------|------|
| Carnet indicatif / RFQ | Plus réaliste en v1 que « full CEX » |
| Partenaires MM ou LP | Capital & licence = partenaires, pas solo |
| Paires RWA / stablecoin | Dépend du réseau de la plateforme |
| Reporting liquidité | KPI pour l’émetteur et la plateforme |

**Ce n’est pas le wizard** — c’est un **second produit**, capital et réglementation plus lourds.

**Message plateforme**  
> « Vos tokens ne meurent pas après le launch : bridge de liquidité ciblé petits volumes RWA. »

---

## Pourquoi l’ordre 1 → 2 est stratégique

1. **Sans émetteurs, pas de token à liquider** — la brique 1 crée l’inventaire.
2. **La confiance plateforme** se gagne avec 2–3 dossiers propres, pas avec une promesse de MM.
3. **Liquidity Bridge** se vend mieux **après** un pilote issuer : « on connaît déjà vos actifs sur AUROS ».

---

## Pitch une phrase (petite plateforme)

> **AUROS** vous apporte des **émetteurs dossier-ready** et, à terme, un **pont de liquidité** pour que vos RWA restent tradables — le pack que les grandes infra ont déjà en interne.

---

## Roadmap alignée

| Phase | Focus | Preuve | Statut |
|-------|--------|--------|--------|
| **0** | Prod + 1 plateforme pilote (issuer pipeline) | 5–10 dossiers, webhook soumission | Live (webhook env + submit) |
| **1** | `partner_platform_id` + inbox `/platforms/dashboard` + webhook par tenant | Triage in_review / needs_info / approved | **MVP live** |
| **2** | Landing « tokeniser [actif] » → flux SEO | Volume leads | À venir |
| **3** | **Liquidity Bridge** MVP (RFQ / 1 MM partenaire / 1 chaîne) | Pilote 1 token | À venir |

### Ops — activer une plateforme

```bash
curl -X POST https://getauros.com/api/admin/partners/activate \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ops@platform.example",
    "code":"PLAT-DEMO",
    "kind":"platform",
    "webhook_url":"https://platform.example/hooks/auros",
    "webhook_secret":"…"
  }'
```

Optionnel : `DEFAULT_PLATFORM_PARTNER_CODE=PLAT-DEMO` sur Vercel pour router les soumissions sans match wizard.

Inbox : `/platforms/dashboard` (Clerk, partner `kind=platform`).

Ne pas annoncer la brique 2 sur la home **avant** d’avoir une LOI issuer ou un partenaire MM.

---

## Risques honnêtes (Liquidity Bridge)

- **Capital** : le market making consomme du bilan ou des LPs.
- **Réglementation** : MTF, CASP, dépendance juridiction — pas un feature flag.
- **Technique** : oracles, compliance transferts, ERC-3643 restrictions.
- **Concentration** : petits actifs = peu de volume → modèle économique à calibrer (fee fixe + spread share).

**Piste réaliste v1** : ne pas être le MM vous-mêmes — **orchestrer** (RFQ, routage vers 1–2 LPs / desks partenaires, dashboard liquidité).

---

## Différenciation vs « juste un SaaS dossier »

Vous vendez un **pack plateforme petite taille** :

- **Amont** : clients + dossiers (AUROS aujourd’hui)
- **Aval** : liquidité (Liquidity Bridge demain)

Les géants ne ciblent pas ce segment ; les conseils ne font pas le MM.

---

## Fichiers liés

- `docs/MODELE-ECONOMIQUE.md` — % apporteurs + revenus
- `docs/PRODUIT-AUROS.md` — périmètre actuel
- `PARTNER_WEBHOOK_URL` — déjà prêt pour notifier une plateforme à la soumission
