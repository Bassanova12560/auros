"use client";

import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { useProtocolPremiumKey } from "@/app/developers/shield/_components/useProtocolPremiumKey";
import { createShareAction } from "@/lib/actions/shares";
import {
  buildSharedDossierUrl,
  type SharedDossierPayload,
} from "@/lib/dossier-share";
import { wizardAssetToProtocolType } from "@/lib/dossier-seal";
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
  const { apiKey, setApiKey } = useProtocolPremiumKey();
  const [copiedScore, setCopiedScore] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [copiedSeal, setCopiedSeal] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [sealing, setSealing] = useState(false);
  const [showKey, setShowKey] = useState(false);

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

  const shareSealed = useCallback(async () => {
    setShareError(null);
    const key = apiKey.trim();
    if (!key) {
      setShowKey(true);
      setShareError(
        locale === "en"
          ? "Premium API key required to seal."
          : locale === "es"
            ? "Clave Premium requerida para sellar."
            : "Clé Premium requise pour sceller."
      );
      return;
    }
    setSealing(true);
    try {
      const data = dossier.data as Record<string, unknown> | undefined;
      const description =
        (typeof data?.description === "string" && data.description.trim()) ||
        `${assetType || "asset"} — AUROS dossier score ${score}`;
      const value =
        typeof data?.estimatedValue === "number"
          ? data.estimatedValue
          : undefined;
      const country =
        typeof data?.country === "string" ? data.country : undefined;
      const docs = Array.isArray(data?.documents) ? data.documents.length : 0;

      const attestRes = await fetch("/api/v1/attest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: locale === "es" || locale === "en" ? locale : "fr",
          score: {
            description: description.slice(0, 4000),
            asset_type: wizardAssetToProtocolType(
              typeof data?.assetType === "string" ? data.assetType : assetType
            ),
            value_eur: value && value > 0 ? value : undefined,
            jurisdiction: country,
            has_data_room: docs > 0,
            documents_count: docs,
          },
        }),
      });
      const attestJson = (await attestRes.json()) as {
        id?: string;
        verify_url?: string;
        content_hash?: string;
        error?: { message?: string };
      };
      if (!attestRes.ok || !attestJson.id || !attestJson.verify_url) {
        setShareError(
          attestJson.error?.message ??
            (attestRes.status === 403
              ? locale === "en"
                ? "Sealing requires Protocol Premium."
                : "Scellage réservé Protocol Premium."
              : dm.share.error)
        );
        return;
      }

      const sealedPayload: SharedDossierPayload = {
        ...dossier,
        _auros_seal: {
          attest_id: attestJson.id,
          verify_url: attestJson.verify_url,
          content_hash: attestJson.content_hash,
          sealed_at: new Date().toISOString(),
        },
      };

      const result = await createShareAction({
        dossierData: sealedPayload,
        assetType: assetType || null,
        score,
      });
      if (!result.ok) {
        setShareError(dm.share.error);
        return;
      }
      const url = buildSharedDossierUrl(result.token);
      const ok = await copyToClipboard(url);
      if (ok) flashCopied(setCopiedSeal);
    } catch {
      setShareError(dm.share.error);
    } finally {
      setSealing(false);
    }
  }, [
    apiKey,
    dossier,
    assetType,
    score,
    locale,
    flashCopied,
    dm.share.error,
  ]);

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

      {showKey ? (
        <label className="mb-4 block max-w-md space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Clé Premium (scellage)
          </span>
          <input
            type="password"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="auros_…"
            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/25"
          />
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
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
        <ShareOption
          title={
            locale === "en"
              ? "Sealed share"
              : locale === "es"
                ? "Compartir sellado"
                : "Partage scellé"
          }
          description={
            locale === "en"
              ? "HMAC attestation + public verify URL for the bank."
              : locale === "es"
                ? "Attestation HMAC + URL verify pública para el banco."
                : "Attestation HMAC + URL verify publique pour la banque."
          }
          actionLabel={
            sealing
              ? "…"
              : locale === "en"
                ? "Copy sealed link"
                : locale === "es"
                  ? "Copiar enlace sellado"
                  : "Copier le lien scellé"
          }
          copiedLabel={dm.share.copied}
          copied={copiedSeal}
          onCopy={() => {
            setShowKey(true);
            void shareSealed();
          }}
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
