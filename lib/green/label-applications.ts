import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { GreenProjectType } from "./constants";

export type GreenLabelApplicationStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected";

export type GreenLabelApplicationRow = {
  id: string;
  projectName: string;
  projectType: GreenProjectType;
  status: GreenLabelApplicationStatus;
  createdAt: string;
  hasDocument: boolean;
};

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function listGreenLabelApplicationsByEmail(
  email: string
): Promise<GreenLabelApplicationRow[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];

  const supabase = getAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("green_label_applications")
    .select("id,project_name,project_type,status,created_at,document_path")
    .eq("email", normalized)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[listGreenLabelApplicationsByEmail]", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    projectName: String(row.project_name),
    projectType: row.project_type as GreenProjectType,
    status: row.status as GreenLabelApplicationStatus,
    createdAt: String(row.created_at),
    hasDocument: Boolean(row.document_path),
  }));
}
