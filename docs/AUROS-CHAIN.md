# Auros Chain — Phase 4 architecture scaffold

**Status:** design + Solidity bonding stub only. Not a production L1.

## Goal

Move from “financial layer on Ethereum-class VMs” to a **resource-native settlement environment** where:

1. Block producers are **energy / compute operators** (Proof-of-Resource),
2. **WATT** is the machine-economy unit of account,
3. Grid / VPP connectors stay **HITL** until licensed.

## Recommended stack (decision pending)

| Option | Pros | Cons |
|--------|------|------|
| **OP Stack L2** | Fast to ship, Ethereum liquidity | Weaker “sovereign resource” narrative |
| **Cosmos SDK app-chain** | Custom consensus modules | Heavier ops |
| **Avalanche Subnet** | Permissioned validators | Business / AVAX coupling |

**MVP recommendation:** start as **OP Stack L2** (or L3) with a custom precompile / oracle for PoR receipts; migrate consensus story later if needed.

## Repo layout (scaffold)

```
chain/
  README.md                 # this pointer
  config/genesis.example.json
  modules/
    por/                    # Proof-of-Resource module (stub)
    watt-reserve/           # physical reserve accounting (stub)
  scripts/
    local-dev.sh
protocol/contracts/
  EnergyValidatorStaking.sol  # AUR bond + declared kW capacity
```

## Validator economics (stub)

`EnergyValidatorStaking`:

- Stake **AUR** (≥ `minStake`)
- Declare **capacityKw** (self-attested MVP; later DeviceRegistry + IoT proofs)
- Future: slash on missed PoR windows; rewards from ARL fees + block rewards

## Non-goals for this scaffold

- No mainnet validators, no RTE/ERCOT live control, no MiCA license claims
- No automatic “central bank reserve” marketing

## Next engineering slices

1. Hardhat tests for `EnergyValidatorStaking`
2. `chain/modules/por` TypeScript state machine simulating block proposals weighted by capacity
3. Bridge design: WATT & ResourceToken canonical on L1 ↔ Auros Chain
4. HITL ops runbook for grid connectors

See also: [ARL-README.md](../ARL-README.md), [WHITEPAPER.md](./WHITEOBER.md) (update when Phase 4 lands in product).
