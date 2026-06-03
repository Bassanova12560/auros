import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { GreenLabelApplicationStatus } from "./label-applications";

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type UpdateGreenLabelStatusInput = {
  applicationId: string;
  status: Exclude<GreenLabelApplicationStatus, "approved">;
};

export type UpdateGreenLabelStatusResult =
  | {
      ok: true;
      previousStatus: GreenLabelApplicationStatus;
      status: GreenLabelApplicationStatus;
      email: string;
      contactName: string;
      projectName: string;
      changed: boolean;
    }
  | { ok: false; error: "not_found" | "invalid_transition" | "database" };

const ALLOWED: Record<
  GreenLabelApplicationStatus,
  GreenLabelApplicationStatus[]
> = {
  pending: ["in_review", "rejected"],
  in_review: ["rejected"],
  approved: [],
  rejected: [],
};

export async function updateGreenLabelApplicationStatus(
  input: UpdateGreenLabelStatusInput
): Promise<UpdateGreenLabelStatusResult> {
  const supabase = getAdminClient();
  if (!supabase) return { ok: false, error: "database" };

  const { data: app, error: fetchErr } = await supabase
    .from("green_label_applications")
    .select("id,status,email,contact_name,project_name")
    .eq("id", input.applicationId)
    .maybeSingle();

  if (fetchErr || !app) return { ok: false, error: "not_found" };

  const previousStatus = app.status as GreenLabelApplicationStatus;
  const nextStatus = input.status;

  if (previousStatus === nextStatus) {
    return {
      ok: true,
      previousStatus,
      status: nextStatus,
      email: String(app.email),
      contactName: String(app.contact_name),
      projectName: String(app.project_name),
      changed: false,
    };
  }

  if (!ALLOWED[previousStatus]?.includes(nextStatus)) {
    return { ok: false, error: "invalid_transition" };
  }

  const now = new Date().toISOString();
  const patch: Record<string, string> = { status: nextStatus };
  if (nextStatus === "in_review" || nextStatus === "rejected") {
    patch.reviewed_at = now;
  }

  const { error: updateErr } = await supabase
    .from("green_label_applications")
    .update(patch)
    .eq("id", input.applicationId);

  if (updateErr) {
    console.error("[updateGreenLabelApplicationStatus]", updateErr);
    return { ok: false, error: "database" };
  }

  return {
    ok: true,
    previousStatus,
    status: nextStatus,
    email: String(app.email),
    contactName: String(app.contact_name),
    projectName: String(app.project_name),
    changed: true,
  };
}
