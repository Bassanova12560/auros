# AUROS Shield — sous-couche crypto on-prem

## Positionnement

AUROS Protocol = intelligence RWA dans le cloud.  
**AUROS Shield** = racine de confiance que le client installe chez lui (DMZ / Kubernetes / VM), sur le modèle des appliances « quantum-safe » : on l’adopte avant que ce soit obligatoire.

## Problème futur qu’on anticipe

- Preuves CFU / attest / packs ESG conservées **7–30 ans** → risque *harvest now, decrypt later*
- Banques exigent **clés hors cloud** + inventaire crypto (CBOM) pour procurement
- Migration **PQC** (NIST ML-DSA / ML-KEM) : il faut une enveloppe agile *aujourd’hui*, pas un rip-and-replace demain

## Ce que v0.1 livre

| Capacité | Détail |
|----------|--------|
| Seal / verify local | HMAC-SHA256, préfixes compatibles CFU & attest |
| Profils | `classical_hmac_sha256_v1`, `hybrid_pqc_ready_v1` |
| CBOM | JSON inventaire algorithmes + plan migration |
| Serveur | `GET /health` `GET /v1/cbom` `POST /v1/seal` `POST /v1/verify` |
| Package | `@adrien1212balitrand/auros-shield` + Docker |

## Ce que ce n’est pas

- Certification HSM / FIPS
- Implémentation NIST PQC finale (roadmap derrière le même envelope)
- Agrément bancaire / conseil MiCA
- GO/REC ou label Green Verified

## Roadmap honnête

1. Dual-signature hybrid (HMAC + ML-DSA) derrière `hybrid_pqc_ready_v1`
2. Connexion HSM / PKCS#11 pour `AUROS_SHIELD_SIGNING_KEY`
3. Sync optionnelle cloud Protocol (export hash only — pas de raw data room)
4. SLA Enterprise + runbook banque

## Pages

- Produit : `/developers/shield`
- CBOM exemple cloud : `/api/v1/shield/cbom`
- Institutions : `/developers/institutions`
