# Pousser le dépôt vers GitHub

Dernière tentative automatique : **échec** — `git@github.com: Permission denied (publickey)`.

- Remote : `git@github.com:Bassanova12560/auros.git`
- Clé locale : `%USERPROFILE%\.ssh\id_ed25519_auros` (présente)
- Clé publique à coller sur GitHub : `docs/GITHUB_SSH_PUBLIC_KEY.txt`
- `gh` installé (2.93) mais **non connecté** (`gh auth login` requis pour l’option HTTPS)

La branche `main` locale n’a jamais synchronisé `origin/main` (pas de ref distante en local).

---

## Option 1 — GitHub Desktop (le plus simple)

1. Installer [GitHub Desktop](https://desktop.github.com/).
2. **File → Add local repository** → dossier `C:\Users\adrie\auros`.
3. Se connecter au compte GitHub qui a accès à `Bassanova12560/auros`.
4. Cliquer **Push origin** sur `main`.

---

## Option 2 — SSH (coller la clé publique)

1. Ouvrir https://github.com/settings/keys → **New SSH key**.
2. Coller le contenu de `docs/GITHUB_SSH_PUBLIC_KEY.txt` (titre ex. `auros-push`).
3. Dans PowerShell, depuis le repo :

```powershell
cd C:\Users\adrie\auros
$env:GIT_SSH_COMMAND = "ssh -i $env:USERPROFILE\.ssh\id_ed25519_auros -o IdentitiesOnly=yes"
git push -u origin main
```

---

## Option 3 — HTTPS avec GitHub CLI

```powershell
gh auth login
cd C:\Users\adrie\auros
git remote set-url origin https://github.com/Bassanova12560/auros.git
git push -u origin main
```

Pour revenir en SSH après coup :  
`git remote set-url origin git@github.com:Bassanova12560/auros.git`

---

## Vérifier que ça a marché

```powershell
git fetch origin
git status -sb
```

Vous devez voir `main...origin/main` sans commits « ahead » non poussés.
