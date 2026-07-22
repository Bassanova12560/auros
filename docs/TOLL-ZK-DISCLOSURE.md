# Toll Confidential Compute / ZK Layer — selective disclosure stub v0

**Surface :** `/green/toll/zk` · `POST /api/v1/toll/zk-disclosure`

Horizon-3 product shape, shippable today as a **demo stub**: prove eligibility / ratio / policy match without returning the full private payload. **No ZK circuits, no TEE.**

## Product rules

- Explicitly labeled **stub / demo** — not cryptographic proof production.
- Commitment = SHA-256 over canonical `{ publicInputs, salt }` (sorted keys).
- `verified` is always `false` on claims; HITL uses `verifyDisclosureStub` + recipe.
- `privateHints` are counted (`hiddenFieldCount`) and **never** returned in the claim body.
- Bearer + **research** credits on the HTTP route.

## Claim types

| `claimType` | Intent |
|-------------|--------|
| `eligibility` | Investor / op gate without full KYC blob |
| `ratio` | Bound check (e.g. LTV) without full sheet |
| `policy_match` | Rule fired without full decision tree |

## Lib (`lib/toll/zk-disclosure.ts`)

- `buildSelectiveDisclosure({ claimType, publicInputs, privateHints?, salt? })`
- `verifyDisclosureStub(commitment, publicInputs, salt)` — pure recomputation check
- `computeDisclosureCommitment` / `canonicalizeForCommitment` — shared hashing

### Result shape

| Field | Notes |
|-------|--------|
| `claimId` | `zkclaim_…` |
| `claimType` | see above |
| `commitment` | hex SHA-256 |
| `revealedFields` | sorted keys of `publicInputs` |
| `hiddenFieldCount` | `#` keys in `privateHints` |
| `verified` | always `false` |
| `salt` | echoed (generated if omitted) |
| `recipe` | HITL steps |
| `disclaimer` | stub wording |

## HTTP

```http
POST /api/v1/toll/zk-disclosure
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "claimType": "eligibility",
  "publicInputs": { "eligible": true, "jurisdiction": "FR" },
  "privateHints": { "wallet": "0x…" },
  "salt": "optional"
}
```

## Related

`AUROS-CASH-MACHINE-TOP20.md` #19 · Control Tower · Eligibility / Policy.
