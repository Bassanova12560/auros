# Réduction des coûts IA — AUROS

## Qualité par défaut

Le mode **qualité** est actif sans variable d’environnement :

- **Gemini 2.0 Flash** en premier (bon rapport qualité / coût, quota gratuit)
- Secours **Groq 70B** puis **Mistral Small**
- Sections **140–200 mots**, 2 paragraphes, avec structure juridique, KYC, revenus, notes
- **Contrôle qualité** : réponse trop courte ou trop générique → provider suivant
- **Template** uniquement si tous les providers échouent (badge visible dans le dossier)

Pour couper les coûts au maximum (tests de charge) : `AI_ECONOMY_MODE=true` (8B, sections 80–120 mots).

## Ce qui ne coûte rien

| Fonctionnalité | Mécanisme |
|----------------|-----------|
| Score landing / widget | `lib/score.ts` — heuristiques locales |
| Score wizard (étape 10) | `lib/wizard-scoring.ts` — pas d’appel API |
| `/api/score` | Même logique locale (plus de Groq) |
| Dossier déjà généré | Le client ne rappelle pas `/api/generate` si `aiContent` existe |

## Génération dossier (`/api/generate`)

1. **Ordre des providers** : Gemini Flash (quota gratuit Google) → Groq `llama-3.1-8b-instant` → Mistral.
2. **Prompt structuré** : 140–200 mots / section (mode qualité).
3. **`max_tokens`** : 2800 par défaut en mode qualité (`AI_MAX_OUTPUT_TOKENS`).
4. **Cache mémoire** : même wizard + locale = réponse instantanée 24h (`AI_CACHE_TTL_MS`).
5. **Plafond journalier** : `AI_DAILY_GENERATION_CAP=200` (toutes instances Vercel confondues par processus — suffisant pour limiter les abus).
6. **Fallback template** : uniquement si tous les providers échouent (pas sur plafond journalier — dans ce cas on garde Gemini gratuit).
7. **Rate limit IP** : 10 générations / heure.

## Variables recommandées (Vercel)

```env
GEMINI_API_KEY=...          # Prioritaire — tier gratuit
GROQ_API_KEY=...            # Secours pas cher
AI_PROVIDER_ORDER=gemini,groq,mistral
AI_DAILY_GENERATION_CAP=200
AI_MAX_OUTPUT_TOKENS=1600
# Pour les tests massifs sans facture Groq/Mistral :
# AI_FREE_ONLY=true
```

## API IA gratuite supplémentaire

Si vous ajoutez une clé **OpenRouter** ou **Together** avec modèles gratuits, on peut ajouter un provider `openrouter` dans `lib/ai-router.ts` (même pattern que Groq). Indiquez la clé et le modèle souhaité.

## Estimation ordre de grandeur

- Avant : ~70B Groq, 4096 tokens sortie → **$0.05–0.15 / dossier**
- Après (Gemini free + prompt court) : **$0** tant que le quota Google tient ; sinon ~**$0.002–0.01** avec 8B Groq

## Rotation sécurité

Si une clé API a été exposée dans un chat, régénérez-la dans la console du fournisseur.
