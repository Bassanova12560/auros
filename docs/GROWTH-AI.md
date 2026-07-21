# Growth AI — AUROS Copilot qui fait grandir le produit

## Principe manager

**RAG + agents + human-in-the-loop d’abord.**  
Fine-tune open-source ensuite, seulement si on a assez de conversations / mails validés pour mesurer un gain.

Fine-tuner trop tôt = coût GPU, dérive, risque de claims faux. Un bon RAG sur le catalogue ai-first + drafts revus bat un modèle « custom » mal nourri.

## Phases

### Phase A — maintenant (v1 livrée / en cours)

| Brique | Rôle |
|--------|------|
| RAG ai-first | `/ai-first/rag` + tools Copilot lecture seule |
| Drafts ops | Catalogue, contenu, social — approve dans `/ops/copilot` |
| **Care emails (draft)** | Mails personnalisés **proposés** (jamais auto-send) |
| Nurture cron | Relance dossier incomplet (template, déjà live) |
| Funnel events | `funnel_*` → Vercel Analytics |

### Phase B — suite (90 jours)

- Enrichir care drafts avec statut dossier (3 priorités manquantes, WELHR si eau)
- A/B subject lines (draft variants) — envoi manuel Resend / ops
- Copilot « coach » post-score : prochain pas unique (pas 15)
- Mémoire courte session (consent) pour ne pas répéter les mêmes conseils

### Phase C — fine-tune (si preuves)

- Dataset : drafts **approuvés** + FAQ réelles (anonymisées)
- Modèle : petit instruct open-source (ex. 7–8B) ou LoRA chez un hébergeur
- Garde-fous : pas de chiffres inventés ; citation RAG obligatoire ; HITL send
- Critère go : −20 % temps ops sur drafts **ou** +X % reprise dossier vs template

## Ce que l’IA peut faire pour que le client se sente aidé

1. **Un prochain pas** clair (reprendre express, 1 doc data room, verify)
2. **Ton pro rassurant** (incomplet OK, indicatif, counsel)
3. **Personnalisation réelle** (actif, juridiction, score) — pas de blabla générique
4. **Preuves** (lien verify / Evidence Pack) quand pertinent
5. **Jamais** promettre 35 %, sans clic, partenariat Tesla/Total

## Anti-patterns

- Auto-envoyer des mails IA sans revue
- Fine-tune sans dataset qualité
- Laisser l’IA modifier scores / CFU / attestations
