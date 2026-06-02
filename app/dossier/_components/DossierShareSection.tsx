"use client";

import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { createShareAction } from "@/lib/actions/shares";
import {
  buildSharedDossierUrl,
  type SharedDossierPayload,
} from "@/lib/dossier-share";
import { getDossierMessages } from "@/lib/dossier-i18n";
import {
  buildScoreShareUrlFromAssetType,
  copyToClipboard,
} from "@/lib/referral";

type DossierShareSectionProps = {
  dossier: SharedDossierPayload;
  score: number;
  assetType: string;
};

export function DossierShareSection({
  dossier,
  score,
  assetType,
}: DossierShareSectionProps) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const [copiedScore, setCopiedScore] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const flashCopied = useCallback((setter: (v: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 2400);
  }, []);

  const shareScore = useCallback(async () => {
    setShareError(null);
    const url = buildScoreShareUrlFromAssetType(assetType || "asset", score);
    const ok = await copyToClipboard(url);
    if (ok) flashCopied(setCopiedScore);
  }, [assetType, score, flashCopied]);

  const shareDossier = useCallback(async () => {
    setShareError(null);
    const result = await createShareAction({
      dossierData: dossier,
      assetType: assetType || null,
      score,
    });
    if (!result.ok) {
      setShareError(dm.share.error);
      return;
    }
    const url = buildSharedDossierUrl(result.token);
    const ok = await copyToClipboard(url);
    if (ok) flashCopied(setCopiedDossier);
  }, [dossier, assetType, score, flashCopied, dm.share.error]);

  return (
    <section className="mt-8 border-t border-white/10 pt-8">
      <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-secondary">
        {dm.share.title}
      </p>

      {shareError ? (
        <p className="mb-4 text-sm text-red-400" role="alert">
          {shareError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <ShareOption
          title={dm.share.scoreTitle}
          description={dm.share.scoreDesc}
          actionLabel={dm.share.scoreCta}
          copiedLabel={dm.share.copied}
          copied={copiedScore}
          onCopy={shareScore}
        />
        <ShareOption
          title={dm.share.dossierTitle}
          description={dm.share.dossierDesc}
          actionLabel={dm.share.dossierCta}
          copiedLabel={dm.share.copied}
          copied={copiedDossier}
          onCopy={shareDossier}
        />
      </div>
    </section>
  );
}

function ShareOption({
  title,
  description,
  actionLabel,
  copiedLabel,
  copied,
  onCopy,
}: {
  title: string;
  description: string;
  actionLabel: string;
  copiedLabel: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-secondary">{description}</p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-4 rounded-full border border-white/10 px-5 py-2 text-sm text-white transition hover:border-white/40 hover:text-white"
      >
        {copied ? copiedLabel : actionLabel}
      </button>
    </article>
  );
}
