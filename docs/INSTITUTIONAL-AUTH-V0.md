# Institutional auth v0 — Portfolio desk · SSO · on-prem

Trust layer for banks / funds before full SSO contracts.

## Live surfaces

| Surface | Path | Access |
|---------|------|--------|
| Public Portfolio Console | `/green/portfolio` | Open (volume-gated API) |
| Institutional desk | `/green/portfolio/desk` | **Clerk sign-in** |
| White-label KPIs | `/embed/portfolio` | iframe (`frame-ancestors *`) |
| On-prem proofs | AUROS Shield (`docs/AUROS-SHIELD.md`) | Customer-held keys |

## Volume boost (session)

When no API key is present, a Clerk session upgrades DNA volume limits:

| Signal | Effective tier |
|--------|----------------|
| Signed-in user | `free` (50 rows / stream events) |
| Clerk `orgId` ∈ `AUROS_INSTITUTIONAL_ORG_IDS` | `enterprise` (100) |
| Email domain ∈ `AUROS_INSTITUTIONAL_DOMAINS` | `enterprise` (100) |
| Bearer Premium / Enterprise key | unchanged (key wins) |

Env (comma-separated):

```bash
AUROS_INSTITUTIONAL_DOMAINS=example-bank.com,fund.lu
AUROS_INSTITUTIONAL_ORG_IDS=org_xxx,org_yyy
```

## SSO (path)

1. **Now:** Clerk Organizations + desk gate (`/green/portfolio/desk`)  
2. **Sales:** Clerk Enterprise SAML/OIDC (IdP client) — configure in Clerk Dashboard, map org → allowlist  
3. **Contract:** dedicated tenant / allowlist domains + Enterprise API key  

Contact: `hello@getauros.com`

## On-prem

- Proof seals stay customer-side via **AUROS Shield** (`npx auros-shield serve`)  
- Cloud Portfolio reads DNA hashes / streams — no private key exfil  
- Full air-gapped desk = Enterprise engagement

## Non-goals (v0)

- Full IdP broker inside AUROS  
- Auto-provision of org seats without Clerk  
- Replacing Green API keys with SSO alone for machine clients  

## Related

- [`PORTFOLIO-CONSOLE-V1.md`](./PORTFOLIO-CONSOLE-V1.md)  
- [`ASSET-DNA-V1.md`](./ASSET-DNA-V1.md)  
- [`AUROS-SHIELD.md`](./AUROS-SHIELD.md)  
