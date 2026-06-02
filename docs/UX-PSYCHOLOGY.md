# UX psychologie — AUROS (règles produit)

Objectif : **sérieux pro** sans **montagne insurmontable**.

## Principes (à respecter dans tout nouveau code)

1. **Une décision principale par écran** — un CTA primaire, le reste secondaire ou replié.
2. **Parler en parties, pas en 15 étapes** — 4 moments : Actif → Stratégie → Conformité → Récap.
3. **Normaliser l'incomplet** — « pas encore », « indicatif », « vous complétez après ».
4. **Max 3 priorités** quand il manque des infos — jamais une liste de 15 manques.
5. **Preuve de sérieux sans peur** — MiCA/RGPD/confidentialité, pas jargon menaçant.
6. **Temps estimé** — « ~4 min restantes » réduit l'anxiété de durée.
7. **Sauvegarde visible** — l'utilisateur ne croit pas perdre son travail.

## Implémentation

| Fichier | Rôle |
|---------|------|
| `lib/wizard-journey-i18n.ts` | Copy rassurante par phase / étape |
| `lib/readiness-ease.ts` | Fin wizard & score : 3 priorités max |
| `app/_components/ProfessionalTrustBar.tsx` | Bandeau confiance |
| `LandingExplore.tsx` | Profondeur repliée sur la home |
| `WizardShell.tsx` | Progression « Partie X · ~N min » |
| `lib/data-room-ease.ts` | Data room : 3 pièces prioritaires, liste 15 repliée |
| `lib/emails/locale-templates.ts` | E-mails wizard + concierge FR/EN/ES, ton rassurant |

## Prompt agent (à réutiliser)

> Avant d'ajouter une feature AUROS : réduire la charge cognitive, garder le ton institutionnel chaleureux, max 3 actions visibles, jamais culpabiliser l'utilisateur pour un dossier incomplet.
