# Pilote partenaire — onboarding utilities / cabinets / family offices

Guide opérationnel pour lancer un premier partenaire apporteur sur le rail AUROS (wizard + widget H₂O + attribution).

---

## 1. Créer le code partenaire

Convention : **2–32 caractères**, lettres/chiffres/tiret, majuscules.

Exemples : `UTILITIES_FR`, `CAB-LUX`, `FO-GENEVA`

Le code est **libre** — il suffit de l'utiliser dans les URLs. Aucune table d'enregistrement préalable.

---

## 2. Kit automatique

```bash
PARTNER_CODE=UTILITIES_FR npm run partner:pilot-kit
```

Avec export fichier :

```bash
PARTNER_CODE=UTILITIES_FR SITE_URL=https://getauros.com npm run partner:pilot-kit -- --write
# → docs/pilots/partner-utilities_fr.md
```

Le kit contient : liens wizard, guide eau, embed, snippets iframe/JS, commandes curl, smoke tests.

---

## 3. Liens à envoyer au partenaire

| Usage | URL |
|-------|-----|
| Wizard Passeport Hydrique | `https://getauros.com/wizard?type=green&asset=renewable&partner=CODE` |
| Guide tokenisation eau | `https://getauros.com/comment-tokeniser/eau?partner=CODE` |
| Widget embed | `https://getauros.com/eau/embed?partner=CODE` |
| Docs intégration | `https://getauros.com/eau/embed/docs` |
| Portail self-service | `https://getauros.com/partners/portal` |

Remplacer `getauros.com` par `NEXT_PUBLIC_SITE_URL` en prod.

---

## 4. Widget H₂O — deux modes

### Iframe (simple)

Copier depuis `/eau/embed/docs` ou le portail partenaire (bouton « Copier le snippet iframe »).

### JS + postMessage (CRM / analytics)

Événements émis par le widget :

| Event | Quand | Payload |
|-------|-------|---------|
| `auros:h2o:ready` | Chargement | `{ partner? }` |
| `auros:h2o:score` | Preview calculé | `{ rating, tier, preview_id, asset_class, passport_required: true }` |
| `auros:h2o:passport` | Clic CTA | `{ partner? }` |

Filtrer côté parent :

```js
window.addEventListener("message", (event) => {
  if (event.data?.source !== "auros-embed") return;
  // ...
});
```

---

## 5. Vérifier l'attribution

1. Ouvrir un lien avec `?partner=UTILITIES_FR`
2. Soumettre un lead (score widget) ou compléter un dossier
3. Aller sur `/partners/portal` → saisir `UTILITIES_FR`
4. Vérifier leads/dossiers et activité récente

**Prérequis DB :** colonne `referred_by` sur `leads` et `dossiers` (migrations `0029` / `0030`).

---

## 6. Export ops (sans UI admin)

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://getauros.com/api/admin/partner-referrals?partner=UTILITIES_FR"
```

Format CSV — pour facturation / reporting mensuel.

---

## 7. Webhook externe (optionnel)

À la soumission dossier, AUROS peut notifier Make/Zapier/Slack :

```env
PARTNER_WEBHOOK_URL=https://hook.eu2.make.com/...
PARTNER_WEBHOOK_SECRET=shared-secret
```

Header envoyé : `X-Auros-Secret` (si secret défini).

Voir `docs/SIMULATION.md` pour le format payload.

---

## 8. Grille commission indicative

Affichée dans le portail (non contractuelle) :

| Événement | Indicatif |
|-----------|-----------|
| Lead | 50 € |
| Dossier créé | 200 € |
| Dossier soumis | 400 € |

Contrat signé prime sur ces chiffres.

---

## 9. Checklist go-live partenaire

- [ ] Code partenaire validé (`npm run partner:pilot-kit`)
- [ ] `NEXT_PUBLIC_SITE_URL` = domaine canonique
- [ ] Migration `referred_by` appliquée
- [ ] Test attribution lead + dossier
- [ ] Portail affiche l'activité
- [ ] Snippet embed testé sur site partenaire (CSP : `frame-ancestors *` sur `/eau/embed/*`)
- [ ] Webhook configuré si besoin CRM
- [ ] Contact ops : `RESEND_INTERNAL_EMAIL`

---

## Voir aussi

- `docs/EAU-PILOT.md` — détail rail H₂O
- `docs/RELEASE-ECOSYSTEM.md` — checklist déploiement globale
- `docs/PROD-LAUNCH.md` — mise en prod générale
