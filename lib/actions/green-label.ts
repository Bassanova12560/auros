"use server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  sendGreenLabelInternal,
  sendGreenLabelReceived,
} from "@/lib/emails/send";
import type { GreenProjectType } from "@/lib/green/constants";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const VALID_TYPES: GreenProjectType[] = [
  "solar",
  "wind",
  "rec",
  "carbon",
  "ppa",
  "other",
];

export type SaveGreenLabelInput = {
  projectName: string;
  projectType: GreenProjectType;
  contactName: string;
  email: string;
  website: string;
  country: string;
  description: string;
};

export type SaveGreenLabelResult =
  | { ok: true; id: string }
  | { ok: false; error: "invalid" }
  | { ok: false; error: "database"; message: string };

export async function saveGreenLabelAction(
  input: SaveGreenLabelInput
): Promise<SaveGreenLabelResult> {
  const email = input.email.trim().toLowerCase();
  if (
    !input.projectName.trim() ||
    !input.contactName.trim() ||
    !isValidCaptureEmail(email) ||
    !VALID_TYPES.includes(input.projectType) ||
    !input.website.trim() ||
    !input.country.trim() ||
    input.description.trim().length < 20
  ) {
    return { ok: false, error: "invalid" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("green_label_applications")
    .insert({
      project_name: input.projectName.trim(),
      project_type: input.projectType,
      contact_name: input.contactName.trim(),
      email,
      website: input.website.trim(),
      country: input.country.trim(),
      description: input.description.trim(),
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[saveGreenLabelAction]", error);
    return {
      ok: false,
      error: "database",
      message: error?.message ?? "Insert failed",
    };
  }

  const id = data.id as string;
  void sendGreenLabelReceived(email, {
    contactName: input.contactName.trim(),
    projectName: input.projectName.trim(),
    locale: "fr",
  });
  void sendGreenLabelInternal({
    id,
    email,
    projectName: input.projectName.trim(),
    projectType: input.projectType,
  });

  return { ok: true, id };
}
