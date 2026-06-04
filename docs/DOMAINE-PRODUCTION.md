# Domaine et production AUROS

Document de référence pour l'équipe produit (PM, QA) et l'administration DNS.

## URL à utiliser pour les tests (maintenant)

| Environnement | URL | État |
|---------------|-----|------|
| **Production Next.js (Vercel)** | **https://auros-delta.vercel.app** | Live — application AUROS déployée |
| Alias Vercel équivalent | https://auros-adrienbalitrand-7929s-projects.vercel.app | Même déploiement que ci-dessus |
| **auros.app** | https://auros.app | **Squarespace** (`Server: Squarespace`) — DNS **non** basculé vers Vercel |

**Consigne PM / QA :** tester **https://auros-delta.vercel.app** (et non `auros.app`) jusqu'à bascule DNS terminée et validation Vercel **Valid**.

## Vérification automatique (2026-06-04)

### DNS public (Google 8.8.8.8)

| Enregistrement | Valeur actuelle | Cible Vercel |
|----------------|-----------------|--------------|
| `auros.app` **A** | `198.49.23.144` (+ 3 IP Squarespace) | `76.76.21.21` |
| `www.auros.app` **CNAME** | `ext-sq.squarespace.com` | `cname.vercel-dns.com` |

**Conclusion :** le DNS n'a **pas** encore été modifié chez Squarespace.

### Vercel CLI

- Compte : `adrienbalitrand-7929` — projet **`auros`** — prod **Ready** sur `auros-delta.vercel.app`.
- `npx vercel domains add auros.app` → **403 `domain_not_owned`** (domaine non rattaché au compte tant que le DNS ne prouve pas le contrôle).
- `npx vercel alias set auros-delta.vercel.app auros.app` → **refusé** (même raison).
- `npx vercel domains ls` → **0** domaine personnalisé.
- `NEXT_PUBLIC_SITE_URL` (Production) : **vide** — à définir sur `https://auros.app` **après** ajout réussi des domaines sur Vercel.

### HTTP

```text
curl.exe -sI https://auros.app
Server: Squarespace
```

## Procédure Squarespace (3 clics — descriptions visuelles)

Checklist copier-coller : [`scripts/squarespace-dns-checklist.md`](../scripts/squarespace-dns-checklist.md).

1. **Ouvrir la zone DNS du domaine** — Connexion [squarespace.com](https://www.squarespace.com) → **Paramètres** (icône engrenage) → **Domaines** → cliquer **`auros.app`** → onglet **Paramètres DNS** / **DNS Settings** (liste des enregistrements A, CNAME, etc.).

2. **Nettoyer l’apex Squarespace** — Supprimer les **4 enregistrements A** sur `@` pointant vers `198.x` / `198.185.x`, puis **Ajouter** un enregistrement **A** : hôte **`@`**, valeur **`76.76.21.21`**.

3. **Basculer www vers Vercel** — Modifier ou supprimer le **CNAME** `www` → `ext-sq.squarespace.com`, puis **Ajouter** **CNAME** : hôte **`www`**, valeur **`cname.vercel-dns.com`**.

Attendre la propagation (souvent 5–30 min, parfois jusqu’à 48 h).

## Après propagation DNS

1. Réexécuter :

   ```bash
   npx vercel domains add auros.app --scope adrienbalitrand-7929s-projects
   npx vercel domains add www.auros.app --scope adrienbalitrand-7929s-projects
   npx vercel alias set auros-delta.vercel.app auros.app --scope adrienbalitrand-7929s-projects
   npx vercel alias set auros-delta.vercel.app www.auros.app --scope adrienbalitrand-7929s-projects
   ```

2. Vercel → projet **auros** → **Settings** → **Environment Variables** : `NEXT_PUBLIC_SITE_URL` = `https://auros.app` (Production), puis redéployer si nécessaire.

3. Valider : Vercel **Domains** = **Valid** ; `curl.exe -sI https://auros.app` affiche **`Server: Vercel`**.

## Enregistrements DNS exacts (Vercel — apex + www)

| Type | Nom / hôte | Valeur |
|------|------------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Si le dashboard Vercel affiche d'autres valeurs (TXT `_vercel`, etc.), **priorité au dashboard** au moment de l'ajout du domaine.

## Déploiement manuel (si besoin)

```bash
npm run build
npx vercel --prod
```

## Résumé une ligne

**Tester maintenant :** https://auros-delta.vercel.app — **Action bloquante :** DNS Squarespace (voir checklist) puis re-lancer `vercel domains add` / alias / `NEXT_PUBLIC_SITE_URL`.
