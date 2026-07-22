# AUROS Toll Master Plan — machine à cash inévitable

**Thèse :** AUROS n’est pas « un produit RWA de plus ». C’est le **péage d’infrastructure** — registre vivant + search + policy + audit + interface agents. Les autres gagnent plus / prennent moins de risque *uniquement* s’ils passent par AUROS.

**Statut v0 (code) :** Agent Protocol + Resolve / Search / Research / Policy / Drift / Trail / Trust Score / Metadata Schema / Embed — `docs/AUROS-AGENT-PROTOCOL-V0.md`.

---

## Principe économique

| Mauvais SaaS | Péage AUROS |
|--------------|-------------|
| Payer pour « accéder au produit » | Payer parce que lookup / événement / policy / agent **exige** AUROS |
| Feature checklist | Taxe invisible sur cycle de vie |
| Churn facile | Coût de sortie = SI banque + widgets + schema |

**Unités monétisables :** lookup · event lifecycle · search · research · policy decision · drift alert · export · embed licence · agent credits.

---

## Les 8 briques — ordre, pricing, moat

| # | Brique | Horizon 1 (0–6 mois) | Pricing cible | Moat |
|---|--------|----------------------|---------------|------|
| 1 | **Resolve API** | Canonical DNA + unknown-risk | €0.01–0.05 / lookup · packs volume | Qui possède l’ID canonique contrôle le marché |
| 2 | **Search Graph** | DNA + market + registry | Free 1k · Premium /mo · Enterprise | Graph + schema = switching cost |
| 3 | **Research API** | Pack structuré + citations trail | 5–20× Search | Desks/IA paient le raisonnement sourcé |
| 4 | **Policy Engine** | Règles declarative v0 | Sièges enterprise + €/decision | Branché SI → quasi-inamovible |
| 5 | **Drift Detection** | Stale / silent / docs / demo | Alerts + monitoring MRR | Post-émission = cash récurrent |
| 6 | **Metadata Standard** | Schema AUROS JSON | Adoption gratuite → licence redistrib | Schema.org des RWA |
| 7 | **Validation Trail** | Proof Stream API | Volume + export certifié | Audit trail = compliance budget |
| 8 | **Embedded Widgets** | DNA / trust badge iframe+JS | Licence + SLA | Intel Inside — distribution sans visite |

---

## Horizon 1 — 6 mois (construire le péage)

**Objectif :** toute intégration sérieuse Green/RWA *peut* (puis *doit*) appeler AUROS pour resolve + trail + trust.

| Sprint | Livrable | Force à payer |
|--------|----------|---------------|
| H1.1 | Resolve + unknown risk + OpenAPI | Banques / wallets : « actif non résolu = risque » |
| H1.2 | Search + Research packs | Apps / copilots : retrieval sans hallucination |
| H1.3 | Policy rules v0 (doc stale, unverified, unknown) | Plateformes : gate avant listing |
| H1.4 | Drift + watchlist digest (déjà partiel) → API unifiée | Fonds : monitoring portefeuille |
| H1.5 | Embed DNA / trust partout | Affichage tiers = licence |
| H1.6 | Agent Protocol tools + SDK hints | IA : `resolve_asset` avant toute réponse |

**Pricing H1 (indicatif, EUR) :**

| SKU | Prix | Inclut |
|-----|------|--------|
| Free key | 0 | 1k req/mo Resolve/Search light |
| Green API Premium | 299/mo | Volume + batches (live) |
| Toll Lookup Pack | 99–499/mo | Resolve + Trail volume |
| Research Desk | 799/mo | Research + Policy eval |
| Embed licence | 149–999/mo | Widgets + branding |

**KPI H1 :** 3 partenaires affichent badge DNA · 1 desk policy · 10k lookups/mo · 0 claim auto-cert.

---

## Horizon 2 — 2 ans (devenir le DNS + Cloudflare)

**Objectif :** schema AUROS adopté ; policy dans 1–2 banques pilotes ; lifecycle fees sur events.

| Track | Construction | Pricing | Pourquoi ils paient |
|-------|--------------|---------|---------------------|
| Entity Resolution | Token ↔ SPV ↔ site ↔ DNA | Enterprise | Personne ne reconstruit |
| Lifecycle Toll | Fee / event (mint, doc, audit, redemption) | Stripe-like events | Traçabilité = licence d’opérer |
| Policy Enterprise | Règles custom + SSO | 5–50k/an | Compliance programmable |
| Drift Graph | Incident + covenant monitor | MRR / AUM band | Réduction risque crédit |
| Benchmark API | Comparables / readiness indices | Data licence | Desks Bloomberg-like |
| Agent Protocol GA | SDK + credits IA | Retrieval credits | Moins d’hallucinations = edge produit |

**Moat H2 :** standard de métadonnées + widgets omniprésents + policy dans le SI.

---

## Horizon 3 — 5 ans (système nerveux du marché)

**Objectif :** AUROS = Intel Inside des RWA — lookup obligatoire de facto.

| Position | Analogie | Cash |
|----------|----------|------|
| DNS des actifs réels | Resolve + Entity Graph | Taxe lookup mondiale |
| Cloudflare policies | Policy + Drift | Enforcement invisible |
| Bloomberg RWA | Search + Research + Benchmarks | Terminal / API data |
| Stripe of reality events | Lifecycle Toll | Fee / événement |

**Anti-patterns à ne jamais faire :** auto-certifier · broker deals · inventer partenaires · fine-tune avant HITL.

---

## Mapping code (v0 → briques)

| Brique | Code |
|--------|------|
| Resolve | `lib/toll/resolve.ts` · `POST/GET /api/v1/toll/resolve` |
| Search | `lib/toll/search.ts` · `/api/v1/toll/search` |
| Research | `lib/toll/research.ts` · `/api/v1/toll/research` |
| Policy | `lib/toll/policy.ts` · `/api/v1/toll/policy` |
| Drift | `lib/toll/drift.ts` · `/api/v1/toll/drift` |
| Metadata | `lib/toll/metadata-schema.ts` · `GET /api/v1/toll/schema` |
| Trail | `lib/toll/trail.ts` · `/api/v1/toll/trail` |
| Trust | `lib/toll/trust-score.ts` |
| Agent | `lib/toll/agent.ts` · `/api/v1/toll/agent` |
| Embed | `/embed/asset-dna` · `public/auros-resolve.js` |

Fondations déjà live : Asset DNA · Proof Stream · Portfolio alerts · Green API Premium · Partner attribution.

---

## Suite immédiate après v0

1. Metering lookup credits (Upstash counters)  
2. Lifecycle event fee hooks sur Proof Stream actions  
3. Schema adoption guide partenaires  
4. 1 pilote policy banque (HITL, pas auto-block marché)

Voir aussi : `ASSET-DNA-V1.md` · `GREEN-MONETIZATION.md` · `GROWTH-AI.md` · `PARTNER-PILOTS.md`.
