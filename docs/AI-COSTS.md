# Réduction des coûts IA — AUROS

## Qualité par défaut

Le mode **qualité** est actif sans variable d’environnement :

- **Gemini 2.0 Flash** en premier (bon rapport qualité / coût, quota gratuit)
- Secours **Groq** puis **Mistral**, puis **OpenRouter** (`:free`)
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

1. **Ordre des providers** : Gemini Flash → Groq → Mistral → OpenRouter free.
2. **Prompt structuré** : 140–200 mots / section (mode qualité).
3. **`max_tokens`** : 2800 par défaut en mode qualité (`AI_MAX_OUTPUT_TOKENS`).
4. **Cache mémoire** : même wizard + locale = réponse instantanée 24h (`AI_CACHE_TTL_MS`).
5. **Plafond journalier** : `AI_DAILY_GENERATION_CAP=200` (toutes instances Vercel confondues par processus — suffisant pour limiter les abus).
6. **Fallback template** : uniquement si tous les providers échouent (pas sur plafond journalier — dans ce cas on garde Gemini gratuit).
7. **Rate limit IP** : 10 générations / heure.

## Variables recommandées (Vercel)

```env
GEMINI_API_KEY=...          # Prioritaire — tier gratuit Google AI Studio
GROQ_API_KEY=...            # Secours (souvent gratuit / très bas coût)
MISTRAL_API_KEY=...         # Secours
OPENROUTER_API_KEY=...      # Quota free supplémentaire (modèles :free)
# OPENROUTER_MODEL=google/gemma-2-9b-it:free
AI_PROVIDER_ORDER=gemini,groq,mistral,openrouter
AI_DAILY_GENERATION_CAP=200
AI_MAX_OUTPUT_TOKENS=1600
# Zéro spend payant (Gemini + OpenRouter free seulement) :
# AI_FREE_ONLY=true
```

## Empiler le gratuit (recommandé)

| Clé | Où | Rôle |
|-----|-----|------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) | Prioritaire, bon rapport qualité |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | Secours rapide |
| `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai) | Secours |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) | Filet `:free` (Gemma, etc.) |

Optionnel plus tard : 2e projet Gemini (autre quota), Together free models. Copilot (`/copilot`) + agent contenu ops utilisent la même chaîne.

## Estimation ordre de grandeur

- Avant : ~70B Groq, 4096 tokens sortie → **$0.05–0.15 / dossier**
- Après (Gemini free + prompt court) : **$0** tant que le quota Google tient ; sinon ~**$0.002–0.01** avec 8B Groq

## Rotation sécurité

Si une clé API a été exposée dans un chat, régénérez-la dans la console du fournisseur.
