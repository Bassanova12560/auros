# Squarespace DNS — auros.app → Vercel

Valeurs à copier-coller (projet Vercel **auros**, apex + www).

## Enregistrements à appliquer

| Type | Hôte / Nom | Valeur | TTL |
|------|------------|--------|-----|
| **A** | `@` (racine / apex) | `76.76.21.21` | 3600 (ou défaut) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 (ou défaut) |

## Enregistrements à supprimer ou remplacer

| Type | Hôte | Ancienne valeur (constat DNS 2026-06-04) |
|------|------|------------------------------------------|
| **A** | `@` | `198.49.23.144`, `198.49.23.145`, `198.185.159.144`, `198.185.159.145` |
| **CNAME** | `www` | `ext-sq.squarespace.com` |

Ne laissez **qu’une seule** entrée **A** `@` → `76.76.21.21` pour l’apex.

## Après propagation (côté dev, dans le dépôt)

```powershell
cd C:\Users\adrie\auros
npx vercel domains add auros.app --scope adrienbalitrand-7929s-projects
npx vercel domains add www.auros.app --scope adrienbalitrand-7929s-projects
npx vercel alias set auros-delta.vercel.app auros.app --scope adrienbalitrand-7929s-projects
npx vercel alias set auros-delta.vercel.app www.auros.app --scope adrienbalitrand-7929s-projects
# NEXT_PUBLIC_SITE_URL production :
# npx vercel env rm NEXT_PUBLIC_SITE_URL production --scope adrienbalitrand-7929s-projects --yes
# puis ajouter https://auros.app (dashboard ou vercel env add)
curl.exe -sI https://auros.app | findstr /i Server
# Attendu : Server: Vercel (plus Squarespace)
```

## Vérification DNS (PowerShell)

```powershell
nslookup -type=A auros.app 8.8.8.8
nslookup -type=CNAME www.auros.app 8.8.8.8
```

Attendu : apex → `76.76.21.21` ; `www` → `cname.vercel-dns.com`.
