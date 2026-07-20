import "server-only";

import { getReceiptAsync, type ShieldReceipt } from "@/lib/shield/tap";
import { SHIELD_SLA } from "@/lib/shield/audit";

export type WetsShieldBridge = {
  receipt_id: string;
  found: boolean;
  profile: string | null;
  hybrid_ready: boolean;
  created_at: string | null;
  verify_url: string | null;
  retention_years_min: number;
  label: string;
};

export async function resolveWetsShieldBridge(
  receiptId: string | null | undefined
): Promise<WetsShieldBridge | null> {
  const id = receiptId?.trim();
  if (!id) return null;

  let receipt: ShieldReceipt | null = null;
  try {
    receipt = await getReceiptAsync(id);
  } catch {
    receipt = null;
  }

  if (!receipt) {
    return {
      receipt_id: id,
      found: false,
      profile: null,
      hybrid_ready: false,
      created_at: null,
      verify_url: null,
      retention_years_min: SHIELD_SLA.receipt_retention_years_min,
      label: "Shield receipt introuvable — vérifier l’id",
    };
  }

  const hybrid_ready = receipt.profile === "hybrid_pqc_ready_v1";
  return {
    receipt_id: receipt.id,
    found: true,
    profile: receipt.profile,
    hybrid_ready,
    created_at: receipt.created_at,
    verify_url: receipt.verify_url || `/verify?id=${receipt.id}`,
    retention_years_min: SHIELD_SLA.receipt_retention_years_min,
    label: hybrid_ready
      ? "Shield · hybrid_pqc_ready (crypto-agility scheduled)"
      : `Shield · ${receipt.profile} — reseal hybrid recommandé`,
  };
}
