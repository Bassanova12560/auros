# Repository visibility (GitHub)

**Status check (2026-07-30):** remote `Bassanova12560/auros` appeared **public** via GitHub API; `gh` was **not authenticated** in this environment — visibility change must be done by the owner.

## Recommendation (default)

**Keep the main monorepo private.**

Why:

- Application source includes ops-oriented docs, env catalogs, and historical commits that may reference sensitive paths even after sanitization.
- Career / sector credibility does **not** require a public monorepo full of internals.
- Attackers learn less; diligence partners get a scoped demo or private invite.

### Career vitrine without leaking AUROS

| Option | When | How |
|--------|------|-----|
| **A — Private main + public profile** (preferred) | Default | Private `auros` · pin LinkedIn · public [getauros.com](https://getauros.com) · optional thin public `auros-docs` or docs site |
| **B — Public monorepo hardened** | Only if you need recruiters to browse code | Strict `.gitignore` · sanitized docs · no ops curl · no cron/admin maps · secret scanning on |
| **C — Public showcase mirror** | Portfolio without source risk | Separate public repo: architecture narrative, mermaid diagrams, screenshots, links to live product — **no** deploy recipes |

Do **not** leave the monorepo public “for credibility” while unpaid strategy dumps, cron maps, and Vercel project IDs remain in `docs/`.

## Make private (owner action)

```bash
gh auth login
gh repo edit Bassanova12560/auros --visibility private
```

Or: GitHub → Settings → General → Danger Zone → Change visibility → **Private**.

Then enable (Settings → Code security):

- Secret scanning  
- Push protection  
- Dependabot alerts  

## If staying public (temporary)

1. Confirm README / SECURITY.md are product-facing only (done in showcase pass).  
2. Keep `docs/*` free of Bearer/cron/admin recipes (sanitized where found).  
3. Never commit `.env*`, `.data/`, Vercel dumps, HTML scrapes.  
4. Plan migration to **private** or a thin public mirror within days — not months.

## Never commit

- `.env.local`, `.env.*` (except `.env.example`)  
- Vercel env dumps / `.vercel`  
- Production HTML scrapes  
- Real API keys, signing keys, or operator secrets  

See root `.gitignore`.
