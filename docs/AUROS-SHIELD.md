# AUROS Shield — Proof Tap freemium

## Position

Devenir **la** sous-couche de preuve RWA : non invasive, freemium addictive, Premium pour scaler.

## Gratuit (entrer partout)

| Capacité | Détail |
|----------|--------|
| Proof Tap | `POST /api/v1/shield/tap` — 100 ancrages / mois / clé |
| Verify contrepartie | `POST /api/v1/shield/verify` — **illimité**, public |
| Receipt | `GET /api/v1/shield/receipts/:id` |
| CBOM | `GET /api/v1/shield/cbom` |
| On-prem | `npx auros-shield` · `POST /v1/tap` local |

**Règle d’or :** le payload est hashé puis **jeté**. Jamais stocké (`payload_retained: false`).

## Premium (être indispensable)

- Taps / ancrages cloud **illimités** (cap 50k/mo)
- Profil `hybrid_pqc_ready_v1`
- `GET /api/v1/shield/export` — registre des reçus
- Même upgrade que Protocol Monitor / Premium

## Flux non invasif

```
SI métier ──POST body──► Shield Tap
                           │ hash + discard payload
                           ├─ local seal (clé HSM client)
                           └─ cloud co-seal (AUROS) → receipt_id
Contrepartie ──POST verify──► valide le hash sans voir les données
```

## Package

`@adrien1212balitrand/auros-shield@0.2.0`

Page : `/developers/shield`
