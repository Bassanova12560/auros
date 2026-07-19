"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  sendPartnerConfirmation,
  sendPartnerInternal,
} from "@/lib/emails/send";
import { createPendingPartner } from "@/lib/partners/registry";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SavePartnerInput = {
  company: string;
  contactName: string;
  email: string;
  platformType: string;
  volume: string;
  message?: string;
};

export type SavePartnerResult =
  | { ok: true; id: string; partnerId?: string }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "database"; message: string };

export async function savePartnerAction(
  input: SavePartnerInput
): Promise<SavePartnerResult> {
  const email = input.email.trim().toLowerCase();
  if (
    !input.company.trim() ||
    !input.contactName.trim() ||
    !isValidCaptureEmail(email) ||
    !input.platformType ||
    !input.volume
  ) {
    return { ok: false, error: "invalid" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("partner_requests")
    .insert({
      company: input.company.trim(),
      contact_name: input.contactName.trim(),
      email,
      platform_type: input.platformType,
      volume: input.volume,
      message: input.message?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[savePartnerAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Insert failed",
    };
  }

  const requestId = data.id as string;
  const pending = await createPendingPartner({
    company: input.company.trim(),
    email,
    contactName: input.contactName.trim(),
    requestId,
  });
  if (!pending.ok) {
    console.error("[savePartnerAction/registry]", pending.message);
  }

  void sendPartnerConfirmation(email, {
    company: input.company.trim(),
    contactName: input.contactName.trim(),
    platformType: input.platformType,
    volume: input.volume,
  });

  void sendPartnerInternal({
    company: input.company.trim(),
    contactName: input.contactName.trim(),
    email,
    platformType: input.platformType,
    volume: input.volume,
    message: input.message,
  });

  return {
    ok: true,
    id: requestId,
    partnerId: pending.ok ? pending.partner.id : undefined,
  };
}
