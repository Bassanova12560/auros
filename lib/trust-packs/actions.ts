"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { questionsForPack } from "@/lib/trust-packs/definitions";
import {
  createTrustPackAssessment,
  getTrustPackAssessment,
  publishTrustPackAssessment,
} from "@/lib/trust-packs/store";
import {
  TRUST_PACK_IDS,
  TRUST_PACKS_ROUTE,
  type TrustPackId,
} from "@/lib/trust-packs/taxonomy";
import type { PackChecklist, PackEvidence } from "@/lib/trust-packs/score";

function parseForm(formData: FormData): {
  packId: TrustPackId;
  name: string;
  jurisdiction: string | null;
  description: string | null;
  website_url: string | null;
  checklist: PackChecklist;
  evidence: PackEvidence;
  shield_receipt_id: string | null;
} | null {
  const packRaw = String(formData.get("pack_id") ?? "");
  if (!(TRUST_PACK_IDS as readonly string[]).includes(packRaw)) return null;
  const packId = packRaw as TrustPackId;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return null;

  const questions = questionsForPack(packId);
  const checklist: PackChecklist = {};
  const evidence: PackEvidence = {};
  for (const q of questions) {
    checklist[q.id] = formData.get(`q_${q.id}`) === "on";
    const url = String(formData.get(`ev_url_${q.id}`) ?? "").trim();
    const excerpt = String(formData.get(`ev_excerpt_${q.id}`) ?? "").trim();
    if (url || excerpt) {
      evidence[q.id] = {
        ...(url ? { url } : {}),
        ...(excerpt ? { excerpt } : {}),
      };
    }
  }
  const shield_receipt_id =
    String(formData.get("shield_receipt_id") ?? "").trim() || null;
  if (shield_receipt_id) {
    const last = questions[questions.length - 1];
    if (last) {
      evidence[last.id] = {
        ...evidence[last.id],
        receipt_id: shield_receipt_id,
      };
    }
  }

  return {
    packId,
    name,
    jurisdiction: String(formData.get("jurisdiction") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    website_url: String(formData.get("website_url") ?? "").trim() || null,
    checklist,
    evidence,
    shield_receipt_id,
  };
}

export async function createTrustPackAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: "auth_required" };

  const parsed = parseForm(formData);
  if (!parsed) return { ok: false as const, error: "invalid_input" };

  const created = await createTrustPackAssessment({
    ownerUserId: userId,
    packId: parsed.packId,
    name: parsed.name,
    jurisdiction: parsed.jurisdiction,
    description: parsed.description,
    website_url: parsed.website_url,
    checklist: parsed.checklist,
    evidence: parsed.evidence,
    shield_receipt_id: parsed.shield_receipt_id,
  });
  if (!created.assessment) {
    return { ok: false as const, error: created.error ?? "create_failed" };
  }

  revalidatePath(TRUST_PACKS_ROUTE);
  return { ok: true as const, id: created.assessment.id };
}

export async function publishTrustPackAction(id: string) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: "auth_required" };

  const { assessment } = await getTrustPackAssessment(id);
  if (!assessment || assessment.owner_user_id !== userId) {
    return { ok: false as const, error: "forbidden" };
  }

  const pub = await publishTrustPackAssessment(id);
  revalidatePath(TRUST_PACKS_ROUTE);
  if (pub.slug) {
    revalidatePath(`${TRUST_PACKS_ROUTE}/report/${pub.slug}`);
  }
  return pub.error
    ? { ok: false as const, error: pub.error }
    : { ok: true as const, slug: pub.slug! };
}
