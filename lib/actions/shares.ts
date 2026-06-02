"use server";

import { nanoid } from "nanoid";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isShareToken } from "@/lib/validation";

export type CreateShareInput = {
  dossierData: Record<string, unknown>;
  assetType?: string | null;
  score?: number | null;
};

export type CreateShareResult =
  | { ok: true; token: string }
  | { ok: false; error: "database"; message: string };

export type GetShareResult =
  | {
      ok: true;
      dossierData: Record<string, unknown>;
      assetType: string | null;
      score: number | null;
      views: number;
    }
  | { ok: false; error: "not_found" }
  | { ok: false; error: "expired" }
  | { ok: false; error: "database"; message: string };

export async function createShareAction(
  input: CreateShareInput
): Promise<CreateShareResult> {
  const token = nanoid(12);
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("dossier_shares").insert({
    token,
    dossier_data: input.dossierData,
    asset_type: input.assetType?.trim() || null,
    score:
      typeof input.score === "number" && Number.isFinite(input.score)
        ? Math.round(input.score)
        : null,
  });

  if (error) {
    console.error("[createShareAction]", error);
    return {
      ok: false,
      error: "database",
      message: error.message,
    };
  }

  return { ok: true, token };
}

export async function getShareAction(token: string): Promise<GetShareResult> {
  const trimmed = token.trim();
  if (!trimmed || !isShareToken(trimmed)) {
    return { ok: false, error: "not_found" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossier_shares")
    .select("dossier_data, asset_type, score, views, expires_at")
    .eq("token", trimmed)
    .maybeSingle();

  if (error) {
    console.error("[getShareAction]", error);
    return {
      ok: false,
      error: "database",
      message: error.message,
    };
  }

  if (!data) return { ok: false, error: "not_found" };

  const expiresAt = data.expires_at as string | null;
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "expired" };
  }

  const views = (data.views as number) ?? 0;
  const { error: viewError } = await supabase
    .from("dossier_shares")
    .update({ views: views + 1 })
    .eq("token", trimmed);

  if (viewError) {
    console.error("[getShareAction] views increment", viewError);
  }

  return {
    ok: true,
    dossierData: (data.dossier_data as Record<string, unknown>) ?? {},
    assetType: (data.asset_type as string | null) ?? null,
    score: typeof data.score === "number" ? data.score : null,
    views: views + 1,
  };
}
