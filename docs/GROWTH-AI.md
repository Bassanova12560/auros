# Growth AI — AUROS Copilot qui fait grandir le produit

## Principe manager

**Gratuit pour aider le client. Payant pour scaler l’entreprise.**  
RAG + agents + human-in-the-loop d’abord. Fine-tune open-source seulement avec dataset validé.

## Modèle freemium (clair)

| Couche | Pour qui | Contenu | Prix |
|--------|----------|---------|------|
| **Free — aide client** | Issuers, acheteurs, RSE | Chat Green personnalisé `/green/assistant`, Copilot `/copilot`, scores WELHR/RTMS indicatifs, care **drafts** mails (ops envoie) | €0 |
| **Growth — équipe** | PME / mid-market | Green API quotas, webhooks, plusieurs sièges, historique briefs | Abonnement (voir `/green/api` Premium) |
| **Enterprise — RWA AI desk** | Banques, plateformes, counsel | SLA, RAG privé (leur data room hash-only), playbooks white-label, export preuves, SSO, quotas élevés, option fine-tune LoRA sur *leurs* FAQ | Contrat |

Le free doit **faire sentir** qu’on est aidé (1 prochain pas, ton rassurant, personnalisation).  
Le payant vend **volume, gouvernance, preuve, intégration** — pas le chat de base.

## Où l’IA vit (produit)

| Surface | Rôle |
|---------|------|
| `/green/assistant` | Chatbot Green **personnalisé** (rôle / actif / région) |
| `/copilot` | Assistant RWA transverse |
| `/ops/copilot` | Drafts care / social / catalogue — HITL |
| Cron nurture | Relances dossier (template) |
| Funnel `funnel_*` | Mesure Détecter → Décider → Prouver |

## Pourquoi une entreprise paierait une IA « spéciale RWA »

1. **Desk interne** — questions MiCA / admission / Green RTMS sans saturer counsel  
2. **Preuves** — réponses sourcées + liens verify / Evidence Pack (pas de bullshit APY)  
3. **Nurture** — mails / next-step automatisés *sous contrôle* (HITL puis règles)  
4. **API** — intégrer le coach dans leur portail issuer / banque  
5. **RAG privé** — leurs playbooks + AUROS public (isolation)  
6. **Auditabilité** — logs, disclaimers, pas d’auto-mint CFU / scores  
7. **White-label** — assistant « énergie / eau » pour partenaires  
8. **Formation** — Academy + Copilot (sièges)  
9. **Comparateur assisté** — suggestions compare pour risk desk  
10. **Continuity / WELHR** — pack résilience data center pour corporate buyers  

## Phases

### A — live
RAG, Copilot, care drafts HITL, Green assistant **playbook** (suggestions + 3 CTAs + mail à copier), FAB Green, funnel events, **5 locales** (FR/EN/ES/AR/ZH) sur Assistant + Copilot UI/API.

### B — 90 jours (partiellement live)
Care lié dossiers réels ; **coach post-score** (CTA `/copilot?from=score`) — live ; A/B subjects ; **mémoire session consentie** (opt-in device `sessionStorage`, tours Copilot + brief Green) — live.

### C — fine-tune (si preuves)
Dataset drafts approuvés ; LoRA 7–8B ; citation RAG obligatoire ; critère go mesurable.

## Anti-patterns

- Auto-send mails IA sans revue  
- Fine-tune avant RAG/HITL mature  
- Modifier scores / CFU / attestations via chat  
- Claims 35 % / sans clic / fake partners  
