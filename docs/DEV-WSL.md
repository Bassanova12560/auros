# Développement sous WSL (Linux)

## Erreur `ChunkLoadError` / `@supabase/postgrest-js` / `@supabase/auth-js`

Cause : **`node_modules` ou `.next` Windows**, dev lancé dans **WSL** (fichiers tronqués ou cache Turbopack invalide). Next.js tente de charger un chunk SSR Supabase qui n’existe plus ou est corrompu.

Le projet configure `serverExternalPackages` pour Supabase dans `next.config.ts` — après un pull, **supprime quand même `.next`** avant de relancer.

### Correctif

```bash
cd /mnt/c/Users/adrie/auros
rm -rf node_modules .next
npm install
npm run dev
```

Si ça persiste : clone ou copie le projet dans `~/auros` (disque Linux natif), puis `npm install` là-bas.

---

## Erreur `lightningcss.linux-x64-gnu.node`

Cause : `node_modules` installé sous **Windows**, puis `npm run dev` lancé dans **WSL**. Tailwind v4 utilise un binaire natif **par OS**.

### Correctif (dans WSL, à la racine du projet)

```bash
cd /mnt/c/Users/adrie/auros
rm -rf node_modules .next
npm install
npm run dev
```

Variante plus rapide (si le reste des deps est OK) :

```bash
npm install lightningcss-linux-x64-gnu@1.32.0
npm rebuild lightningcss
rm -rf .next
npm run dev
```

### Bonnes pratiques

- Installe toujours les deps **depuis le même environnement** que celui qui lance `npm run dev` (WSL **ou** PowerShell, pas les deux sur le même `node_modules`).
- Pour de meilleures perfs, clone le repo dans le home Linux (`~/auros`) plutôt que sur `/mnt/c/...`.
- Alternative : lancer le dev **uniquement sous Windows** : `npm run dev` dans PowerShell depuis `C:\Users\adrie\auros`.
