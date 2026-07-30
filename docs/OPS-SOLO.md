# Opérations solo (sans console admin)

> **INTERNAL** — Operator runbook. Prefer private repo. No public curl / admin maps.

## Changer le statut d’un dossier

Dans Supabase → Table Editor → `dossiers` → colonne `status`,  
ou en CLI (machine de confiance, `.env.local` chargé) :

```bash
npm run ops:status -- <uuid-dossier> in_review fr
npm run ops:status -- <uuid-dossier> needs_info fr
npm run ops:status -- <uuid-dossier> approved fr
```

Envoie un e-mail au porteur si `in_review`, `needs_info` ou `approved` (Resend configuré).

## Voir les soumissions

Supabase → `dossiers` → filtre `status = submitted`.

## Toi seul sur le projet

Pas d’interface admin publique documentée — moins de surface. Revue via Supabase + scripts ops + boîte interne Resend.
