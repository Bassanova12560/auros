# Pousser le dépôt vers GitHub

> **INTERNAL** — Machine setup only. Prefer private repo (`docs/REPO-VISIBILITY.md`).

Si `gh` / SSH échoue : se connecter une fois (`gh auth login` ou clé SSH dans GitHub → Settings → SSH keys), puis `git push -u origin main`.

Remote typique : `https://github.com/Bassanova12560/auros.git` ou SSH équivalent.

## Option 1 — GitHub Desktop

1. Installer [GitHub Desktop](https://desktop.github.com/).  
2. Add local repository → dossier du monorepo.  
3. Push `main`.

## Option 2 — SSH

1. GitHub → Settings → SSH keys → coller la **clé publique** locale (jamais la privée).  
2. Push avec l’identité SSH appropriée.

## Option 3 — HTTPS + GitHub CLI

```powershell
gh auth login
git remote set-url origin https://github.com/Bassanova12560/auros.git
git push -u origin main
```

## Visibilité

Après push : rendre le monorepo **privé** sauf décision contraire documentée dans `docs/REPO-VISIBILITY.md`.
