"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { isShareToken } from "@/lib/validation";

import type { StarterKitContent } from "@/lib/jurisdictions/starter-kit-types";
import { wizardPrefillFromLead, wizardSeedFromLead } from "@/lib/jurisdictions/wizard-from-lead";
import type { WizardPrefill } from "@/lib/wizard-prefill";

export type StarterKitPortalData = {
  firstName: string;
  email: string;
  locale: Locale;
  paidTier: string;
  deliveredAt: string;
  provider: string | null;
  content: StarterKitContent;
  jurisdictions: string[];
  projectType: string;
  projectValue: string | null;
  wizardPrefill: WizardPrefill;
  wizardSeed: ReturnType<typeof wizardSeedFromLead>;
};

export type GetStarterKitResult =
  | { ok: true; data: StarterKitPortalData }
  | { ok: false; error: "not_found" | "not_ready" | "database"; message?: string };

export type StarterPortalBySessionResult =
  | { ok: true; status: "ready"; token: string }
  | { ok: true; status: "pending" | "failed" }
  | { ok: false; error: "not_found" | "database"; message?: string };

async function mapRow(row: Record<string, unknown>): Promise<StarterKitPortalData> {
  const locale: Locale = isLocale(String(row.locale)) ? (row.locale as Locale) : "fr";
  const jurisdictions = (row.jurisdictions as string[]) ?? [];

  return {
    firstName: String(row.first_name),
    email: String(row.email),
    locale,
    paidTier: String(row.paid_tier ?? "starter"),
    deliveredAt: String(row.delivered_at ?? new Date().toISOString()),
    provider: (row.starter_kit_provider as string | null) ?? null,
    content: row.starter_kit as StarterKitContent,
    jurisdictions,
    projectType: String(row.project_type ?? "other"),
    projectValue: (row.project_value as string | null) ?? null,
    wizardPrefill: wizardPrefillFromLead({
      projectType: String(row.project_type ?? "other"),
      projectValue: (row.project_value as string | null) ?? null,
      jurisdictions,
      firstName: String(row.first_name),
      email: String(row.email),
    }),
    wizardSeed: wizardSeedFromLead({
      projectType: String(row.project_type ?? "other"),
      projectValue: (row.project_value as string | null) ?? null,
      jurisdictions,
      firstName: String(row.first_name),
      email: String(row.email),
      locale,
    }),
  };
}

export async function getStarterKitByTokenAction(
  token: string
): Promise<GetStarterKitResult> {
  const trimmed = token.trim();
  if (!trimmed || !isShareToken(trimmed)) {
    return { ok: false, error: "not_found" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("jurisdiction_leads")
    .select(
      "first_name, email, locale, paid_tier, delivered_at, starter_kit, starter_kit_provider, delivery_status, project_type, project_value, jurisdictions"
    )
    .eq("deliverable_token", trimmed)
    .maybeSingle();

  if (error) {
    console.error("[getStarterKitByToken]", error);
    return { ok: false, error: "database", message: error.message };
  }
  if (!data) return { ok: false, error: "not_found" };
  if (data.delivery_status !== "ready" || !data.starter_kit) {
    return { ok: false, error: "not_ready" };
  }

  return { ok: true, data: await mapRow(data as Record<string, unknown>) };
}

export async function getStarterPortalBySessionAction(
  sessionId: string
): Promise<StarterPortalBySessionResult> {
  const trimmed = sessionId.trim();
  if (!trimmed.startsWith("cs_")) {
    return { ok: false, error: "not_found" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("jurisdiction_leads")
    .select("deliverable_token, delivery_status")
    .eq("stripe_session_id", trimmed)
    .maybeSingle();

  if (error) {
    return { ok: false, error: "database", message: error.message };
  }
  if (!data) return { ok: false, error: "not_found" };

  const status = String(data.delivery_status ?? "pending");
  if (status === "ready" && data.deliverable_token) {
    return {
      ok: true,
      status: "ready",
      token: data.deliverable_token as string,
    };
  }
  if (status === "failed") {
    return { ok: true, status: "failed" };
  }
  return { ok: true, status: "pending" };
}

export async function getStarterKitPdfPayloadAction(
  token: string
): Promise<
  | { ok: true; firstName: string; content: StarterKitContent; deliveredAt: string }
  | { ok: false; error: string }
> {
  const result = await getStarterKitByTokenAction(token);
  if (!result.ok) return { ok: false, error: result.error };
  return {
    ok: true,
    firstName: result.data.firstName,
    content: result.data.content,
    deliveredAt: result.data.deliveredAt,
  };
}
