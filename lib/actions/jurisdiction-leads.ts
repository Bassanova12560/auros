"use server";



import { headers } from "next/headers";



import { generateJurisdictionBrief } from "@/lib/jurisdictions/ai-brief";

import { generateJurisdictionQuote } from "@/lib/jurisdictions/ai-quote";

import { checkoutUrlForLead } from "@/lib/jurisdictions/checkout-url";

import { JURISDICTIONS } from "@/lib/jurisdictions/data";

import { getJurisdictionMessages } from "@/lib/jurisdictions/i18n";

import { scoreGuideLead, scoreQuoteLead } from "@/lib/jurisdictions/lead-score";

import { notifyJurisdictionWebhook } from "@/lib/jurisdictions/webhook-notify";

import { insertJurisdictionLead } from "@/lib/jurisdictions/lead-persistence";

import { isValidCaptureEmail } from "@/lib/email-capture";

import {

  sendJurisdictionGuideConfirmation,

  sendJurisdictionGuideInternal,

  sendJurisdictionQuoteConfirmation,

  sendJurisdictionQuoteInternal,

} from "@/lib/emails/send";

import { isLocale, type Locale } from "@/lib/i18n";

import { checkRateLimit } from "@/lib/rate-limit";

import { getSupabaseServerClient } from "@/lib/supabase/server";



const VALID_IDS = new Set(JURISDICTIONS.map((j) => j.id));



const PROJECT_TYPES = new Set([

  "real_estate",

  "bonds",

  "private_credit",

  "funds",

  "other",

]);



const PROJECT_VALUES = new Set(["under1m", "1to5m", "5to20m", "over20m"]);



async function clientIp(): Promise<string> {

  const h = await headers();

  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

}



function normalizeLocale(raw: string | undefined): Locale {

  return raw && isLocale(raw) ? raw : "fr";

}



function filterJurisdictionIds(ids: string[]): string[] {

  return [...new Set(ids.filter((id) => VALID_IDS.has(id)))];

}



export type JurisdictionLeadResult =

  | {

      ok: true;

      id: string;

      aiBrief?: string;

      aiQuote?: string;

      aiProvider?: string;

      leadScore?: number;

      leadTier?: string;

      checkoutUrl?: string;

    }

  | { ok: false; error: "invalid" | "rate_limit" | "database"; message?: string };



export async function submitJurisdictionGuideAction(input: {

  firstName: string;

  email: string;

  projectType: string;

  jurisdictionIds: string[];

  locale?: string;

}): Promise<JurisdictionLeadResult> {

  const ip = await clientIp();

  const { allowed } = checkRateLimit(`jurisdiction-guide:${ip}`, 5, 3_600_000);

  if (!allowed) return { ok: false, error: "rate_limit" };



  const firstName = input.firstName.trim();

  const email = input.email.trim().toLowerCase();

  const projectType = input.projectType.trim();

  const jurisdictionIds = filterJurisdictionIds(input.jurisdictionIds);

  const locale = normalizeLocale(input.locale);



  if (

    !firstName ||

    !isValidCaptureEmail(email) ||

    !PROJECT_TYPES.has(projectType) ||

    jurisdictionIds.length === 0

  ) {

    return { ok: false, error: "invalid" };

  }



  const messages = getJurisdictionMessages(locale);

  const { score, tier } = scoreGuideLead({

    projectType,

    jurisdictionCount: jurisdictionIds.length,

  });



  const { brief, provider } = await generateJurisdictionBrief(

    { firstName, projectType, jurisdictionIds },

    messages,

    locale

  );



  const supabase = getSupabaseServerClient();

  const inserted = await insertJurisdictionLead(supabase, {
    kind: "guide",
    first_name: firstName,
    email,
    project_type: projectType,
    jurisdictions: jurisdictionIds,
    ai_brief: brief,
    locale,
    lead_score: score,
    lead_tier: tier,
  });

  if ("error" in inserted) {
    console.error("[submitJurisdictionGuideAction]", inserted.error);

    return {
      ok: false,
      error: "database",
      message: inserted.error.message ?? "Insert failed",
    };
  }

  const leadId = inserted.id;

  const checkoutUrl = await checkoutUrlForLead(

    leadId,

    locale,

    email,

    firstName

  );



  void sendJurisdictionGuideConfirmation(email, {

    firstName,

    brief,

    locale,

    checkoutUrl,

  });

  void sendJurisdictionGuideInternal({

    firstName,

    email,

    projectType,

    jurisdictionIds,

    brief,

    provider,

    leadScore: score,

    leadTier: tier,

  });



  void notifyJurisdictionWebhook({

    event: "jurisdiction.lead.guide",

    leadId,

    kind: "guide",

    email,

    firstName,

    leadScore: score,

    leadTier: tier,

    projectType,

    jurisdictions: jurisdictionIds,

  });



  return {

    ok: true,

    id: leadId,

    aiBrief: brief,

    aiProvider: provider,

    leadScore: score,

    leadTier: tier,

    checkoutUrl,

  };

}



export async function submitJurisdictionQuoteAction(input: {

  name: string;

  email: string;

  projectType: string;

  projectValue: string;

  jurisdictionId: string;

  message?: string;

  locale?: string;

}): Promise<JurisdictionLeadResult> {

  const ip = await clientIp();

  const { allowed } = checkRateLimit(`jurisdiction-quote:${ip}`, 5, 3_600_000);

  if (!allowed) return { ok: false, error: "rate_limit" };



  const name = input.name.trim();

  const email = input.email.trim().toLowerCase();

  const projectType = input.projectType.trim();

  const projectValue = input.projectValue.trim();

  const jurisdictionId = input.jurisdictionId.trim();

  const locale = normalizeLocale(input.locale);



  const jurisdictions =

    jurisdictionId === "unsure"

      ? ["unsure"]

      : VALID_IDS.has(jurisdictionId)

        ? [jurisdictionId]

        : [];



  if (

    !name ||

    !isValidCaptureEmail(email) ||

    !PROJECT_TYPES.has(projectType) ||

    !PROJECT_VALUES.has(projectValue) ||

    jurisdictions.length === 0

  ) {

    return { ok: false, error: "invalid" };

  }



  const messages = getJurisdictionMessages(locale);

  const { score, tier } = scoreQuoteLead({ projectValue, projectType });



  const { quote, provider } = await generateJurisdictionQuote(

    {

      name,

      projectType,

      projectValue,

      jurisdictionId,

      message: input.message?.trim(),

    },

    messages,

    locale

  );



  const supabase = getSupabaseServerClient();

  const inserted = await insertJurisdictionLead(supabase, {
    kind: "quote",
    first_name: name,
    email,
    project_type: projectType,
    jurisdictions,
    project_value: projectValue,
    message: input.message?.trim() || null,
    locale,
    ai_quote: quote,
    ai_quote_provider: provider,
    lead_score: score,
    lead_tier: tier,
  });

  if ("error" in inserted) {
    console.error("[submitJurisdictionQuoteAction]", inserted.error);

    return {
      ok: false,
      error: "database",
      message: inserted.error.message ?? "Insert failed",
    };
  }

  const leadId = inserted.id;

  const checkoutUrl = await checkoutUrlForLead(leadId, locale, email, name);



  void sendJurisdictionQuoteConfirmation(email, {

    name,

    locale,

    quote,

    checkoutUrl,

  });

  void sendJurisdictionQuoteInternal({

    name,

    email,

    projectType,

    projectValue,

    jurisdictionId,

    message: input.message?.trim(),

    leadScore: score,

    leadTier: tier,

    quote,

  });



  void notifyJurisdictionWebhook({

    event: "jurisdiction.lead.quote",

    leadId,

    kind: "quote",

    email,

    firstName: name,

    leadScore: score,

    leadTier: tier,

    projectType,

    projectValue,

    jurisdictions,

  });



  return {

    ok: true,

    id: leadId,

    aiQuote: quote,

    aiProvider: provider,

    leadScore: score,

    leadTier: tier,

    checkoutUrl,

  };

}


