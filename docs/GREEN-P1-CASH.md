# Green P1+ cash — Fast Track · Investor Room · Index Pack · Readiness

| Offre | Prix | Surface |
|-------|------|---------|
| Fast Track 24h | **499 €** one-shot | `/green/fast-track` |
| Investor Room | **199 €** / 30 j | `/green/investors` → room token |
| Index Pack | **99 €/mo** | `/data/licence` + kit `/api/green/index-pack/kit` |
| Readiness MRR | **149 €/mo** | `/green/readiness` |

Checkout: `POST /api/green/p1/checkout` `{ product, email, company?, notes?, locale? }`  
Fulfillment: Stripe webhook → HITL e-mail ops (pas d’auto-certification / pas de courtage).

## Anti-patterns

- Badge Verified / certification auto au paiement  
- Broker / exécution de deals dans Investor Room  
- Redistribution plein marché via Index Pack (réservé partenaires)  
