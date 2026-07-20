# AUROS Shield

On-prem cryptographic underlayer for AUROS RWA proofs (CFU, attest, audit packs).

## Why install it (the “quantum protection” pattern)

Banks and energy operators will be asked for:

1. **Data residency** — signing keys never leave the perimeter  
2. **Crypto inventory (CBOM)** — what algorithms protect long-lived evidence  
3. **Crypto agility / PQC readiness** — harvest-now-decrypt-later risk on 7–30y ESG/RWA retention  

AUROS Shield is the substrate you put **inside** the client network. Protocol cloud APIs stay the intelligence layer; Shield is the local root of trust that becomes table stakes later (like quantum-safe appliances today).

## Honest scope (v0.1)

- HMAC-SHA256 seals compatible with AUROS CFU / attest prefixes  
- Profiles: `classical_hmac_sha256_v1` · `hybrid_pqc_ready_v1` (envelope ready; NIST PQC second signature roadmap)  
- CBOM JSON for risk / procurement  
- Local HTTP: `/health` `/v1/cbom` `/v1/seal` `/v1/verify`  

Not: regulated HSM cert, MiCA advice, GO/REC, or a finished NIST PQC implementation.

## Install

```bash
npm install @adrien1212balitrand/auros-shield
export AUROS_SHIELD_SIGNING_KEY="…from HSM/KMS…"
npx auros-shield cbom
npx auros-shield serve --port 8787
```

Docker:

```bash
docker build -t auros-shield .
docker run --rm -e AUROS_SHIELD_SIGNING_KEY -p 8787:8787 auros-shield
```

## Product page

https://getauros.com/developers/shield
