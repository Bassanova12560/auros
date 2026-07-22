# Toll Red-Team Asset Layer v0

**Surface :** `/green/toll/red-team` · `POST /api/green/toll/red-team-pilot` · `POST /api/v1/toll/red-team` (Bearer + research credits)

Revue adversariale indicative d’actifs tokenisés : gaps documentaires, ambiguïté de droits, trail stalle, entités non mappées, dépendances ops, échecs Policy.

**Pas un pen-test, pas une certification sécurité, pas Verified.** Langage HITL. L’intégrateur / counsel tranche.

## API

```http
POST /api/v1/toll/red-team
Authorization: Bearer <key>
Content-Type: application/json

{ "assetDnaId": "auros:dna:v1:ge:…" }
```

Réponse : `{ findings[], score, summary, disclaimer, resolved, assetDnaId? }`  
Sévérités : `low | medium | high | critical`.

## Catégories v0

| Category | Exemples |
|----------|----------|
| `documentary_gap` | Pack vide, pas de deed, hash manquant, docs expirés |
| `rights_ambiguity` | Ownership unspecified, revenue share non quantifié |
| `stale_trail` | Trail vide / >45d / >90d |
| `unmapped_entity` | Pas de SPV/site/registry/market, juridiction absente |
| `operational_dependency` | Operator / geo / demo tier / dossier |
| `policy_fail` | Policy Engine deny ou review |

## Lib

`runAssetRedTeam({ assetDnaId | dna, events? })` · `evaluateAssetRedTeam` (pur).  
Compose Resolve · Policy · Rights Engine · Proof Stream.

Voir `AUROS-CASH-MACHINE-TOP20.md` #17 · `AUROS-TOLL-MASTER-PLAN.md`.
