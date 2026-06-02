# Supabase Storage — data room

## 1. SQL

Exécutez `supabase/migrations/0004_dossier_files_and_status.sql` ou le bloc **0004** dans `000_all_combined.sql`.

## 2. Bucket

Dashboard → **Storage** → **New bucket**

| Champ | Valeur |
|--------|--------|
| Name | `dossier-files` |
| Public | **Non** (privé) |

## 3. Test upload

1. Compte Clerk + dossier sauvegardé
2. Ouvrir `/dossier/{uuid}` ou `/dossier?id=uuid`
3. Data room → **+ Fichier** sur un document (PDF, PNG, JPG, DOCX, max 10 Mo)

Les fichiers sont servis via URL signée (1 h) — uniquement pour le propriétaire du dossier.
