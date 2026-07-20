"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  applyEnergyAndPqcToCriteria,
  enrichDescriptionWithEnergyFields,
} from "@/lib/wets/energy-fields";
import { assistWetsScore } from "@/lib/wets/assist";
import {
  WETS_CATEGORIES,
  WETS_CONSOLE_ROUTE,
  WETS_CRITERIA,
  WETS_PQC_QUESTIONS,
  type WetsCategory,
  type WetsCriterionScore,
} from "@/lib/wets/constants";
import {
  type PqcEvidence,
} from "@/lib/wets/pqc-evidence";
import { resolveWetsShieldBridge } from "@/lib/wets/shield-bridge";
import {
  buildPublicReportMarkdown,
  createWetsProject,
  createWetsRiskEvent,
  listWetsCriteria,
  listWetsRiskEvents,
  publishWetsProject,
  upsertWetsCriteria,
  getWetsProject,
} from "@/lib/wets/store";

function parsePqcFromForm(formData: FormData): {
  pqc_checklist: {
    offchain_register: boolean;
    key_compromise_remedy: boolean;
    token_vs_title: boolean;
    crypto_agility: boolean;
  };
  pqc_evidence: PqcEvidence;
  shield_receipt_id: string | null;
} {
  const shield_receipt_id =
    String(formData.get("shield_receipt_id") ?? "").trim() || null;
  const pqc_checklist = {
    offchain_register: formData.get("pqc_offchain_register") === "on",
    key_compromise_remedy: formData.get("pqc_key_compromise_remedy") === "on",
    token_vs_title: formData.get("pqc_token_vs_title") === "on",
    crypto_agility: formData.get("pqc_crypto_agility") === "on",
  };
  const pqc_evidence: PqcEvidence = {};
  for (const q of WETS_PQC_QUESTIONS) {
    const url = String(formData.get(`pqc_evidence_url_${q.id}`) ?? "").trim();
    const excerpt = String(
      formData.get(`pqc_evidence_excerpt_${q.id}`) ?? ""
    ).trim();
    if (!url && !excerpt) continue;
    pqc_evidence[q.id] = {
      ...(url ? { url } : {}),
      ...(excerpt ? { excerpt } : {}),
    };
  }
  if (shield_receipt_id) {
    pqc_evidence.crypto_agility = {
      ...pqc_evidence.crypto_agility,
      receipt_id: shield_receipt_id,
    };
  }
  return { pqc_checklist, pqc_evidence, shield_receipt_id };
}

export async function createWetsProjectAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: "auth_required" };

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as WetsCategory;
  if (!name || !WETS_CATEGORIES.includes(category)) {
    return { ok: false as const, error: "invalid_input" };
  }

  const permitsRaw = String(formData.get("permits_status") ?? "unknown");
  const permits_status =
    permitsRaw === "none" ||
    permitsRaw === "filed" ||
    permitsRaw === "obtained" ||
    permitsRaw === "unknown"
      ? permitsRaw
      : "unknown";
  const behind_the_meter = formData.get("behind_the_meter") === "on";
  const interconnection_queue_position =
    String(formData.get("interconnection_queue_position") ?? "").trim() || null;
  const { pqc_checklist, pqc_evidence, shield_receipt_id } =
    parsePqcFromForm(formData);

  const description = enrichDescriptionWithEnergyFields({
    description: String(formData.get("description") ?? "").trim() || null,
    interconnection_queue_position,
    permits_status,
    behind_the_meter,
    pqc_checklist,
    pqc_evidence,
    shield_receipt_id,
  });

  const created = await createWetsProject({
    ownerUserId: userId,
    name,
    ticker: String(formData.get("ticker") ?? "").trim() || null,
    category,
    website_url: String(formData.get("website_url") ?? "").trim() || null,
    description,
    legal_structure: String(formData.get("legal_structure") ?? "").trim() || null,
    jurisdiction: String(formData.get("jurisdiction") ?? "").trim() || null,
    interconnection_queue_position,
    permits_status,
    behind_the_meter,
    pqc_checklist,
    pqc_evidence,
    shield_receipt_id,
  });
  if (!created.project) {
    return { ok: false as const, error: created.error ?? "create_failed" };
  }

  const events = await listWetsRiskEvents({
    region: created.project.jurisdiction ?? undefined,
  });
  const riskCtx = events.events
    .slice(0, 8)
    .map(
      (e) =>
        `- [${e.severity}] ${e.region} ${e.event_type}: ${e.description ?? ""} (${e.source_url ?? ""})`
    )
    .join("\n");

  const assisted = await assistWetsScore({
    name: created.project.name,
    ticker: created.project.ticker,
    category: created.project.category,
    website_url: created.project.website_url,
    description: created.project.description,
    legal_structure: created.project.legal_structure,
    jurisdiction: created.project.jurisdiction,
    risk_events_context: riskCtx || undefined,
  });

  const shield = await resolveWetsShieldBridge(shield_receipt_id);
  const criteria = applyEnergyAndPqcToCriteria(
    created.project.category,
    assisted.criteria,
    {
      behind_the_meter,
      permits_status,
      interconnection_queue_position,
      pqc_checklist,
      pqc_evidence,
      shield_hybrid_ready: Boolean(shield?.hybrid_ready),
      shield_receipt_id,
    }
  );

  await upsertWetsCriteria(created.project.id, criteria);
  revalidatePath(WETS_CONSOLE_ROUTE);
  revalidatePath("/trust/quantum");
  return {
    ok: true as const,
    id: created.project.id,
    provider: assisted.provider,
  };
}

export async function saveWetsCriteriaAction(
  projectId: string,
  criteria: WetsCriterionScore[]
) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: "auth_required" };

  const { project } = await getWetsProject(projectId);
  if (!project || project.owner_user_id !== userId) {
    return { ok: false as const, error: "forbidden" };
  }

  const { error } = await upsertWetsCriteria(projectId, criteria);
  revalidatePath(`${WETS_CONSOLE_ROUTE}/projects/${projectId}`);
  return error
    ? { ok: false as const, error }
    : { ok: true as const };
}

export async function publishWetsReportAction(projectId: string) {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, error: "auth_required" };

  const { project } = await getWetsProject(projectId);
  if (!project || project.owner_user_id !== userId) {
    return { ok: false as const, error: "forbidden" };
  }
  const { criteria } = await listWetsCriteria(projectId);
  if (criteria.length < WETS_CRITERIA.length) {
    return { ok: false as const, error: "incomplete_scores" };
  }
  const report = buildPublicReportMarkdown({ project, criteria });
  const pub = await publishWetsProject(
    projectId,
    report.markdown,
    report.html
  );
  revalidatePath(WETS_CONSOLE_ROUTE);
  revalidatePath(`/report/${pub.slug}`);
  revalidatePath(`${WETS_CONSOLE_ROUTE}/reports`);
  revalidatePath(`/trust/quantum/report/${pub.slug}`);
  return pub.error
    ? { ok: false as const, error: pub.error }
    : { ok: true as const, slug: pub.slug!, grade: report.grade, score: report.final_score };
}

export async function createWetsRiskEventAction(formData: FormData): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;

  const region = String(formData.get("region") ?? "").trim();
  const event_type = String(formData.get("event_type") ?? "").trim();
  if (!region || !event_type) return;

  await createWetsRiskEvent({
    region,
    event_type,
    description: String(formData.get("description") ?? "").trim() || undefined,
    source_url: String(formData.get("source_url") ?? "").trim() || undefined,
    event_date: String(formData.get("event_date") ?? "").trim() || undefined,
    severity:
      (String(formData.get("severity") ?? "medium") as
        | "low"
        | "medium"
        | "high") || "medium",
    related_project_id:
      String(formData.get("related_project_id") ?? "").trim() || undefined,
  });
  revalidatePath(`${WETS_CONSOLE_ROUTE}/risk-events`);
}
