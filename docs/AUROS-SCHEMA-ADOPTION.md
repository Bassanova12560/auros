# AUROS Metadata Schema — guide d’adoption partenaires

**Schema id :** `auros.rwa.asset.v0` · `GET /api/v1/toll/schema`

## Pourquoi publier en AUROS schema

Sans métadonnées canoniques, un actif n’est pas résolvable, comparable, ni policy-ready. Publier en schema AUROS = être trouvable via Search Graph et Trust Score.

## Champs minimum

| Champ | Obligatoire | Notes |
|-------|-------------|-------|
| `id` | oui | Asset DNA `auros:dna:v1:…` (mint via register / ops) |
| `assetClass` | oui | taxonomy AUROS |
| `displayName` | oui | label humain |
| `jurisdiction.country` | oui | ISO-ish |
| `documents[]` | recommandé | hash + expiresAt |
| `compliance` | recommandé | listing/label tiers (HITL pour verified) |

## Intégration

1. Obtenir / mint DNA (register Green ou API ops).
2. Aligner payload sur `GET /api/v1/toll/schema`.
3. Embed : `/embed/asset-dna?id=…` ou `auros-resolve.js`.
4. Agents : `resolve_asset` avant toute affirmation.

## Ce qu’on ne fait pas

- Badge Verified automatique
- Redistribution data sans licence
- Claims de partenariat inventés

Voir : `AUROS-TOLL-MASTER-PLAN.md` · `AUROS-AGENT-PROTOCOL-V0.md` · `PARTNER-PILOTS.md`.
