# Institutional auth v0 — Portfolio desk · SSO · on-prem · branding

Trust layer for banks / funds before full SSO contracts.

## Live surfaces

| Surface | Path | Access |
|---------|------|--------|
| Public Portfolio Console | `/green/portfolio` | Open (volume-gated API) |
| Institutional desk | `/green/portfolio/desk` | **Clerk sign-in** |
| SSO runbook / tenants | `/green/portfolio/sso` | Public sales + ops |
| White-label KPIs | `/embed/portfolio?partner=` | iframe (`frame-ancestors *`) |
| Air-gap pack | `GET /api/v1/green/portfolio/airgap` | Clerk · Premium+ key · cron |
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

## White-label branding

```bash
AUROS_INSTITUTIONAL_BRANDS='[{"partnerId":"acme","companyName":"Acme Bank","primaryColor":"#0B3D2E","hideAurosBranding":false,"productLabel":"Portfolio"}]'
```

Embed: `/embed/portfolio?partner=acme&theme=dark`

## SSO tenants

```bash
AUROS_SSO_TENANTS='[{"tenantId":"acme","displayName":"Acme Bank","idpProtocol":"saml","status":"configured","domains":["acme.bank"],"clerkOrgId":"org_xxx"}]'
```

Runbook live on `/green/portfolio/sso` (5 steps). SAML/OIDC IdP stays in Clerk Enterprise.

## Air-gap pack

`GET /api/v1/green/portfolio/airgap?download=1` → JSON `auros.portfolio.airgap.v1` + `contentHash` (sha256).  
Import offline / Shield — no emails, no keys.

## Non-goals (v0)

- Full IdP broker inside AUROS  
- Auto-provision of org seats without Clerk  
- Replacing Green API keys with SSO alone for machine clients  

## Related

- [`PORTFOLIO-CONSOLE-V1.md`](./PORTFOLIO-CONSOLE-V1.md)  
- [`ASSET-DNA-V1.md`](./ASSET-DNA-V1.md)  
- [`AUROS-SHIELD.md`](./AUROS-SHIELD.md)  
