"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  deleteDossierFileAction,
  getDossierFileSignedUrlAction,
  listDossierFilesAction,
  uploadDossierFileAction,
  type DossierFileRow,
} from "@/lib/actions/dossier-files";
import { getDossierMessages } from "@/lib/dossier-i18n";
import type { RwaDocumentId } from "@/lib/rwa-document-phases";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";

export function DataRoomUpload({
  dossierId,
  documentId,
}: {
  dossierId: string;
  documentId: RwaDocumentId;
}) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const u = dm.dataRoom.upload;
  const [files, setFiles] = useState<DossierFileRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const res = await listDossierFilesAction(dossierId);
      if (res.ok) {
        setFiles(res.files.filter((f) => f.documentId === documentId));
      }
    });
  }, [dossierId, documentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("dossierId", dossierId);
    fd.set("documentId", documentId);
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadDossierFileAction(fd);
      if (!res.ok) {
        const msg =
          res.error === "file_type"
            ? u.errorType
            : res.error === "file_size"
              ? u.errorSize
              : res.error === "storage"
                ? u.errorStorage
                : u.errorGeneric;
        setError(msg);
        return;
      }
      refresh();
    });
  };

  const onDelete = (fileId: string) => {
    startTransition(async () => {
      await deleteDossierFileAction(fileId);
      refresh();
    });
  };

  const onDownload = (fileId: string) => {
    startTransition(async () => {
      const res = await getDossierFileSignedUrlAction(fileId);
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    });
  };

  const docLabel = wizardOptionLabel(locale, "documents", documentId);

  return (
    <div className="mt-2 border-t border-white/[0.04] pt-2">
      <p className="text-[10px] text-white/40">
        {u.hint.replace("{doc}", docLabel)}
      </p>
      <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-[11px] text-white/70 hover:text-white">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,application/pdf,image/*"
          className="sr-only"
          disabled={pending}
          onChange={onUpload}
        />
        <span className="rounded border border-white/15 px-2 py-1 font-mono uppercase tracking-wider">
          {pending ? u.uploading : u.addFile}
        </span>
      </label>
      {error ? (
        <p className="mt-1 text-[10px] text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {files.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-2 text-[11px] text-white/60"
            >
              <button
                type="button"
                className="truncate text-left hover:text-white"
                onClick={() => onDownload(f.id)}
              >
                {f.fileName}
              </button>
              <button
                type="button"
                className="shrink-0 text-white/40 hover:text-red-400"
                onClick={() => onDelete(f.id)}
                disabled={pending}
              >
                {u.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
