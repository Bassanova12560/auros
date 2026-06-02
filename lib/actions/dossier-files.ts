"use server";

import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import {
  ALLOWED_DOSSIER_MIME,
  DOSSIER_FILES_BUCKET,
  MAX_DOSSIER_FILE_BYTES,
  sanitizeFileName,
} from "@/lib/dossier-files-config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";
import { ALL_RWA_DOCUMENT_IDS } from "@/lib/rwa-document-phases";

export type DossierFileRow = {
  id: string;
  documentId: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number;
  createdAt: string;
};

export type ListDossierFilesResult =
  | { ok: true; files: DossierFileRow[] }
  | { ok: false; error: "unauthenticated" | "invalid" | "not_found" | "database"; message?: string };

export type UploadDossierFileResult =
  | { ok: true; file: DossierFileRow }
  | { ok: false; error: "unauthenticated" | "invalid" | "not_found" | "file_type" | "file_size" | "storage" | "database"; message?: string };

export type DeleteDossierFileResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" | "invalid" | "not_found" | "database"; message?: string };

async function assertDossierOwner(
  dossierId: string,
  userId: string
): Promise<{ ok: true } | { ok: false; error: "not_found" | "database"; message?: string }> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("id")
    .eq("id", dossierId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, error: "database", message: error.message };
  if (!data) return { ok: false, error: "not_found" };
  return { ok: true };
}

export async function listDossierFilesAction(
  dossierId: string
): Promise<ListDossierFilesResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(dossierId)) return { ok: false, error: "invalid" };

  const owner = await assertDossierOwner(dossierId, userId);
  if (!owner.ok) return owner;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossier_files")
    .select("id, document_id, file_name, mime_type, size_bytes, created_at")
    .eq("dossier_id", dossierId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, error: "database", message: error.message };
  }

  return {
    ok: true,
    files: (data ?? []).map((row) => ({
      id: row.id as string,
      documentId: row.document_id as string,
      fileName: row.file_name as string,
      mimeType: (row.mime_type as string | null) ?? null,
      sizeBytes: Number(row.size_bytes ?? 0),
      createdAt: row.created_at as string,
    })),
  };
}

export async function uploadDossierFileAction(
  formData: FormData
): Promise<UploadDossierFileResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };

  const dossierId = String(formData.get("dossierId") ?? "");
  const documentId = String(formData.get("documentId") ?? "");
  const file = formData.get("file");

  if (!isUuid(dossierId)) return { ok: false, error: "invalid" };
  if (
    !ALL_RWA_DOCUMENT_IDS.includes(
      documentId as (typeof ALL_RWA_DOCUMENT_IDS)[number]
    )
  ) {
    return { ok: false, error: "invalid" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "invalid" };
  }
  if (file.size > MAX_DOSSIER_FILE_BYTES) {
    return { ok: false, error: "file_size" };
  }
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_DOSSIER_MIME.has(mime)) {
    return { ok: false, error: "file_type" };
  }

  const owner = await assertDossierOwner(dossierId, userId);
  if (!owner.ok) return owner;

  const safeName = sanitizeFileName(file.name);
  const storagePath = `${userId}/${dossierId}/${documentId}/${nanoid(8)}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from(DOSSIER_FILES_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadDossierFileAction] storage", uploadError);
    return {
      ok: false,
      error: "storage",
      message: uploadError.message,
    };
  }

  const { data: row, error: insertError } = await supabase
    .from("dossier_files")
    .insert({
      dossier_id: dossierId,
      user_id: userId,
      document_id: documentId,
      file_name: safeName,
      storage_path: storagePath,
      mime_type: mime,
      size_bytes: file.size,
    })
    .select("id, document_id, file_name, mime_type, size_bytes, created_at")
    .single();

  if (insertError || !row) {
    await supabase.storage.from(DOSSIER_FILES_BUCKET).remove([storagePath]);
    return {
      ok: false,
      error: "database",
      message: insertError?.message ?? "Insert failed",
    };
  }

  return {
    ok: true,
    file: {
      id: row.id as string,
      documentId: row.document_id as string,
      fileName: row.file_name as string,
      mimeType: (row.mime_type as string | null) ?? null,
      sizeBytes: Number(row.size_bytes ?? 0),
      createdAt: row.created_at as string,
    },
  };
}

export async function deleteDossierFileAction(
  fileId: string
): Promise<DeleteDossierFileResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(fileId)) return { ok: false, error: "invalid" };

  const supabase = getSupabaseServerClient();
  const { data: row, error: fetchError } = await supabase
    .from("dossier_files")
    .select("id, storage_path, dossier_id")
    .eq("id", fileId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "database", message: fetchError.message };
  }
  if (!row) return { ok: false, error: "not_found" };

  const path = row.storage_path as string;
  await supabase.storage.from(DOSSIER_FILES_BUCKET).remove([path]);

  const { error: delError } = await supabase
    .from("dossier_files")
    .delete()
    .eq("id", fileId)
    .eq("user_id", userId);

  if (delError) {
    return { ok: false, error: "database", message: delError.message };
  }

  return { ok: true };
}

export async function getDossierFileSignedUrlAction(
  fileId: string
): Promise<
  | { ok: true; url: string }
  | { ok: false; error: "unauthenticated" | "invalid" | "not_found" | "database"; message?: string }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthenticated" };
  if (!isUuid(fileId)) return { ok: false, error: "invalid" };

  const supabase = getSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("dossier_files")
    .select("storage_path")
    .eq("id", fileId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, error: "database", message: error.message };
  if (!row) return { ok: false, error: "not_found" };

  const { data: signed, error: signError } = await supabase.storage
    .from(DOSSIER_FILES_BUCKET)
    .createSignedUrl(row.storage_path as string, 3600);

  if (signError || !signed?.signedUrl) {
    return {
      ok: false,
      error: "database",
      message: signError?.message ?? "Signed URL failed",
    };
  }

  return { ok: true, url: signed.signedUrl };
}
