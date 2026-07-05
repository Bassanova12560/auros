"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { EAU_EMBED_DOCS_ROUTE } from "@/lib/eau/constants";
import {
  buildEauCheckApiSnippet,
  buildEauEmbedIframeSnippet,
  buildEauEmbedScriptSnippet,
  buildEauEmbedUrl,
} from "@/lib/eau/embed";
import { getEauHubCopy } from "@/lib/eau/i18n";
import { siteOrigin } from "@/lib/emails/constants";

const DOCS_COPY = {
  fr: {
    title: "Widget H₂O Score — intégration partenaire",
    intro:
      "Intégrez le checker de readiness hydrique AUROS sur votre site (utilities, cabinets, family offices). Le preview est gratuit ; le Passeport Hydrique vérifiable redirige vers AUROS avec votre code partenaire.",
    partnerLabel: "Code partenaire (optionnel)",
    partnerPlaceholder: "UTILITIES_FR",
    iframeTitle: "Snippet iframe",
    scriptTitle: "Snippet JS (postMessage)",
    scriptNote:
      "Écoutez auros:h2o:score et auros:h2o:passport pour déclencher votre CRM ou analytics.",
    apiTitle: "API headless",
    preview: "Aperçu live",
    copy: "Copier",
    copied: "Copié",
  },
  en: {
    title: "H₂O Score widget — partner embed",
    intro:
      "Embed the AUROS hydrological readiness checker on your site. Preview is free; verifiable Hydrological Passport redirects to AUROS with your partner code.",
    partnerLabel: "Partner code (optional)",
    partnerPlaceholder: "UTILITIES_UK",
    iframeTitle: "Iframe snippet",
    scriptTitle: "JS snippet (postMessage)",
    scriptNote:
      "Listen for auros:h2o:score and auros:h2o:passport to wire your CRM or analytics.",
    apiTitle: "Headless API",
    preview: "Live preview",
    copy: "Copy",
    copied: "Copied",
  },
  es: {
    title: "Widget H₂O Score — integración partner",
    intro:
      "Integre el checker de readiness hídrico AUROS en su sitio. Preview gratuito; Pasaporte Hídrico verificable redirige a AUROS con su código partner.",
    partnerLabel: "Código partner (opcional)",
    partnerPlaceholder: "UTILITIES_ES",
    iframeTitle: "Snippet iframe",
    scriptTitle: "Snippet JS (postMessage)",
    scriptNote:
      "Escuche auros:h2o:score y auros:h2o:passport para conectar su CRM o analytics.",
    apiTitle: "API headless",
    preview: "Vista previa",
    copy: "Copiar",
    copied: "Copiado",
  },
} as const;

export default function EauEmbedDocsPage() {
  const { locale } = useLocale();
  const hub = getEauHubCopy(locale);
  const copy = DOCS_COPY[locale] ?? DOCS_COPY.fr;
  const [partner, setPartner] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const origin = siteOrigin();

  const iframeSnippet = useMemo(
    () => buildEauEmbedIframeSnippet({ partner: partner || null, origin }),
    [partner, origin]
  );
  const scriptSnippet = useMemo(
    () => buildEauEmbedScriptSnippet({ partner: partner || null, origin }),
    [partner, origin]
  );
  const embedUrl = useMemo(
    () => buildEauEmbedUrl({ partner: partner || null, locale, origin }),
    [partner, locale, origin]
  );
  const apiSnippet = useMemo(() => buildEauCheckApiSnippet(origin), [origin]);

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <FocusPageShell path={EAU_EMBED_DOCS_ROUTE} width="3xl">
      <Link href="/eau" className="text-sm text-white/45 hover:text-white">
        ← {hub.links.guide}
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-white md:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 text-lg text-white/55">{copy.intro}</p>

      <div className="mt-8">
        <label className="block text-xs uppercase tracking-[0.15em] text-white/40">
          {copy.partnerLabel}
        </label>
        <input
          value={partner}
          onChange={(e) => setPartner(e.target.value.toUpperCase())}
          placeholder={copy.partnerPlaceholder}
          className="mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white"
        />
      </div>

      <BezelCard className="mt-8" innerClassName="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.iframeTitle}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs text-cyan-100/80">
          {iframeSnippet}
        </pre>
        <PrimaryButton
          type="button"
          className="mt-4"
          onClick={() => void copyText("iframe", iframeSnippet)}
        >
          {copied === "iframe" ? copy.copied : copy.copy}
        </PrimaryButton>
      </BezelCard>

      <BezelCard className="mt-4" innerClassName="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.scriptTitle}
        </p>
        <p className="mt-2 text-xs text-white/45">{copy.scriptNote}</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs text-cyan-100/80">
          {scriptSnippet}
        </pre>
        <PrimaryButton
          type="button"
          className="mt-4"
          onClick={() => void copyText("script", scriptSnippet)}
        >
          {copied === "script" ? copy.copied : copy.copy}
        </PrimaryButton>
      </BezelCard>

      <BezelCard className="mt-4" innerClassName="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.apiTitle}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs text-cyan-100/80">
          {apiSnippet}
        </pre>
        <PrimaryButton
          type="button"
          className="mt-4"
          onClick={() => void copyText("api", apiSnippet)}
        >
          {copied === "api" ? copy.copied : copy.copy}
        </PrimaryButton>
        <p className="mt-4 text-xs text-white/40">
          Docs :{" "}
          <Link href="/developers/docs/endpoint-green-h2o" className="underline">
            /developers/docs/endpoint-green-h2o
          </Link>
        </p>
      </BezelCard>

      <BezelCard className="mt-8" innerClassName="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {copy.preview}
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <iframe
            src={embedUrl}
            title="AUROS H₂O embed preview"
            className="h-[580px] w-full max-w-[420px] bg-[#030303]"
            loading="lazy"
          />
        </div>
      </BezelCard>
    </FocusPageShell>
  );
}
