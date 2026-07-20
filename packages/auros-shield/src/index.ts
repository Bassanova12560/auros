export {
  SHIELD_VERSION,
  SHIELD_DISCLAIMER,
  CRYPTO_PROFILES,
  resolveShieldSigningKey,
  sha256Hex,
  isContentHash,
  sealLocal,
  verifyLocal,
  buildCbom,
  tapLocal,
} from "./core";
export type { CryptoProfile, ShieldSealKind, ShieldSeal } from "./core";
