# AUROS Shield — facile à intégrer, Premium qui aide

## Réponse courte

**Oui, maintenant c’est facile** : curl d’un fichier, ou une ligne `instrumentFetch`.  
**Premium = Evidence Pack** : le livrable banque/auditeur quand chaque entreprise a des RWA — pas juste « plus de quota ».

## Free — devenir le standard

| Intégration | Effort |
|-------------|--------|
| `POST /api/v1/shield/ingest` + body brut | 0 schéma |
| `instrumentFetch({ apiKey })` | 1 ligne |
| `npx auros-shield serve` | on-prem |
| Verify public | illimité |

Quota free : 100 ingest/mois. Payload **jamais** stocké.

## Premium — du lourd utile

`POST /api/v1/shield/pack` assemble :

- CFU (hash + statut) de la clé
- Taps Shield récents
- `pack_hash` + signature
- `bank_actions` (joindre au dossier crédit/ESG, re-verify, reseal PQC)
- Horizon rétention 7–30 ans

Sans ouvrir la data room. C’est ce que risk/credit demandent quand le RWA est la norme.

## Page

`/developers/shield`
