# Repository visibility (GitHub)

Prefer a **private** GitHub repository for AUROS application source.

```bash
gh auth login
gh repo edit Bassanova12560/auros --visibility private
```

Enable on GitHub (Settings → Code security):

- Secret scanning
- Push protection
- Dependabot alerts

Never commit `.env.local`, Vercel env dumps, or HTML scrapes of production pages.
