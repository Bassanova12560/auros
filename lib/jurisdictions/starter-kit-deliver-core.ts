import { nanoid } from "nanoid";
import type { SupabaseClient } from "@supabase/supabase-js";

import { sendStarterKitDelivery, sendStarterKitTechIntro } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { isLocale, type Locale } from "@/lib/i18n";

import { generateStarterKit } from "./starter-kit-generate";
import type { StarterKitLeadContext } from "./starter-kit-types";

type LeadRow = {
  id: string;
  first_name: string;
  email: string;
  project_type: string | null;
  project_value: string | null;
  jurisdictions: string[];
  locale: string;
  ai_brief: string | null;
  ai_quote: string | null;
  paid_tier: string | null;
  deliverable_token: string | null;
  delivery_status: string | null;
};

export async function deliverStarterKitForLead(
  supabase: SupabaseClient,
  leadId: string,
  options: { sendEmails?: boolean } = {}
): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const sendEmails = options.sendEmails !== false;

  const { data: row, error: fetchErr } = await supabase
    .from("jurisdiction_leads")
    .select(
      "id, first_name, email, project_type, project_value, jurisdictions, locale, ai_brief, ai_quote, paid_tier, deliverable_token, delivery_status"
    )
    .eq("id", leadId)
    .maybeSingle();

  if (fetchErr || !row) {
    return { ok: false, error: fetchErr?.message ?? "lead_not_found" };
  }

  const lead = row as LeadRow;

  if (lead.deliverable_token && lead.delivery_status === "ready") {
    return { ok: true, token: lead.deliverable_token };
  }

  await supabase
    .from("jurisdiction_leads")
    .update({ delivery_status: "pending" })
    .eq("id", leadId);

  const locale: Locale = isLocale(lead.locale) ? lead.locale : "fr";
  const ctx: StarterKitLeadContext = {
    leadId: lead.id,
    firstName: lead.first_name,
    email: lead.email,
    projectType: lead.project_type ?? "other",
    projectValue: lead.project_value,
    jurisdictions: lead.jurisdictions ?? [],
    locale,
    aiBrief: lead.ai_brief,
    aiQuote: lead.ai_quote,
    paidTier: lead.paid_tier ?? "starter",
  };

  try {
    const { content, plain, provider } = await generateStarterKit(ctx);
    const token = lead.deliverable_token ?? nanoid(16);
    const now = new Date().toISOString();
    const portalUrl = `${siteOrigin()}/starter/${token}`;

    const { error: updateErr } = await supabase
      .from("jurisdiction_leads")
      .update({
        deliverable_token: token,
        starter_kit: content,
        starter_kit_plain: plain,
        starter_kit_provider: provider,
        delivered_at: now,
        delivery_status: "ready",
      })
      .eq("id", leadId);

    if (updateErr) {
      await supabase
        .from("jurisdiction_leads")
        .update({ delivery_status: "failed" })
        .eq("id", leadId);
      return { ok: false, error: updateErr.message };
    }

    if (sendEmails) {
      void sendStarterKitDelivery(lead.email, {
        firstName: lead.first_name,
        locale,
        portalUrl,
        paidTier: lead.paid_tier ?? "starter",
      });

      if (content.techProviders.length > 0) {
        void sendStarterKitTechIntro(lead.email, {
          firstName: lead.first_name,
          locale,
          portalUrl,
          providers: content.techProviders.map((p) => ({
            name: p.name,
            fit: p.fit,
          })),
        });
      }
    }

    return { ok: true, token };
  } catch (err) {
    await supabase
      .from("jurisdiction_leads")
      .update({ delivery_status: "failed" })
      .eq("id", leadId);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "generation_failed",
    };
  }
}
