# Domaine et production AUROS

Document de référence pour l’équipe produit (PM, QA) et l’administration DNS.

## URL à utiliser pour les tests (maintenant)

| Environnement | URL | État |
|---------------|-----|------|
| **Production Next.js (Vercel)** | **https://auros-delta.vercel.app** | Live — application AUROS déployée |
| Alias Vercel équivalent | https://auros-adrienbalitrand-7929s-projects.vercel.app | Même déploiement que ci-dessus |
| **auros.app** | https://auros.app | **Squarespace « Coming soon »** — **ne pas** utiliser pour valider l’app Next.js |

**Consigne PM / QA :** tester **https://auros-delta.vercel.app** (et non `auros.app`) jusqu’à bascule DNS terminée.

## État Vercel (vérification 2026-06-04)

- Projet Vercel : `auros` (équipe `adrienbalitrand-7929s-projects`).
- Alias production : `auros-delta.vercel.app` → dernier déploiement **Production · Ready**.
- `npx vercel domains ls` : **0 domaine personnalisé** rattaché au compte / projet — **`auros.app` n’est pas encore configuré sur Vercel**.

### Commit « auros-focus » (ce59ab6c)

Le hash `ce59ab6c` **n’apparaît pas** dans l’historique Git local de ce dépôt. Les styles `.auros-focus` sont bien présents sur `main` (fichier `app/globals.css`, commits notamment `d7d84a0`, HEAD actuel `d3832cb`). Le build local (`npm run build`) réussit ; la prod Vercel est **Ready** sur l’alias ci-dessus.

## Objectif : faire pointer `auros.app` vers Vercel

Tant que le registrar / Squarespace garde les enregistrements actuels, `auros.app` restera sur Squarespace.

### 1. Ajouter le domaine dans Vercel

1. [Vercel Dashboard](https://vercel.com) → projet **auros** → **Settings** → **Domains**.
2. Ajouter `auros.app` et `www.auros.app` (recommandé).
3. Noter les enregistrements DNS exacts affichés par Vercel (ils priment sur tout exemple générique).

### 2. Modifier le DNS chez le registrar (ou Squarespace Domains)

Désactiver ou remplacer les enregistrements qui pointent vers Squarespace pour l’hébergement du site.

**Exemple courant (à confirmer dans le dashboard Vercel) :**

| Type | Nom / hôte | Valeur |
|------|------------|--------|
| **A** | `@` (apex) | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Pour un sous-domaine `www` uniquement, un **CNAME** `www` → `cname.vercel-dns.com` suffit souvent ; l’apex peut nécessiter **A** ou **ALIAS/ANAME** selon le registrar.

### 3. Squarespace

- Retirer ou ne plus utiliser la page « Coming soon » comme cible DNS une fois Vercel validé.
- La propagation DNS peut prendre **quelques minutes à 48 h**.

### 4. Validation

- Dans Vercel : statut **Valid** sur `auros.app`.
- Navigateur : `https://auros.app` affiche la même app que `https://auros-delta.vercel.app`.
- Certificat TLS : géré automatiquement par Vercel après validation DNS.

## Déploiement manuel (si besoin)

```bash
npm run build
npx vercel --prod
```

## Résumé une ligne

**Tester maintenant :** https://auros-delta.vercel.app · **DNS à faire :** pointer `auros.app` (A/CNAME) vers Vercel et ajouter le domaine dans le projet.
