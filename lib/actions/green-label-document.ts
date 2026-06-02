"use server";

import { nanoid } from "nanoid";

import {
  ALLOWED_GREEN_LABEL_DOCUMENT_MIME,
  GREEN_LABEL_DOCUMENTS_BUCKET,
  MAX_GREEN_LABEL_DOCUMENT_BYTES,
  sanitizeGreenLabelFileName,
} from "@/lib/green/green-label-files-config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";

export type UploadGreenLabelDocumentResult =
  | { ok: true; path: string }
  | {
      ok: false;
      error: "invalid" | "file_type" | "file_size" | "storage" | "database";
      message?: string;
    };

export async function uploadGreenLabelDocumentAction(
  formData: FormData
): Promise<UploadGreenLabelDocumentResult> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const file = formData.get("file");

  if (!isUuid(applicationId)) return { ok: false, error: "invalid" };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "invalid" };
  }
  if (file.size > MAX_GREEN_LABEL_DOCUMENT_BYTES) {
    return { ok: false, error: "file_size" };
  }
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_GREEN_LABEL_DOCUMENT_MIME.has(mime)) {
    return { ok: false, error: "file_type" };
  }

  const safeName = sanitizeGreenLabelFileName(file.name);
  const storagePath = `${applicationId}/${nanoid(8)}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from(GREEN_LABEL_DOCUMENTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadGreenLabelDocumentAction] storage", uploadError);
    return { ok: false, error: "storage", message: uploadError.message };
  }

  const { error: updateError } = await supabase
    .from("green_label_applications")
    .update({ document_path: storagePath })
    .eq("id", applicationId);

  if (updateError) {
    await supabase.storage.from(GREEN_LABEL_DOCUMENTS_BUCKET).remove([storagePath]);
    console.error("[uploadGreenLabelDocumentAction] update", updateError);
    return { ok: false, error: "database", message: updateError.message };
  }

  return { ok: true, path: storagePath };
}
