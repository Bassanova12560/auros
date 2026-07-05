import {
  buildEauEmbedIframeSnippet,
  buildEauEmbedScriptSnippet,
  buildEauEmbedUrl,
  buildHydrologicalPassportUrl,
} from "@/lib/eau/embed";
import { normalizePartnerCode } from "@/lib/partner-attribution";
import { siteOrigin } from "@/lib/emails/constants";

export type PartnerPilotKit = {
  partnerCode: string;
  origin: string;
  wizardUrl: string;
  embedUrl: string;
  embedDocsUrl: string;
  eauGuideUrl: string;
  portalUrl: string;
  h2oApiSample: string;
  iframeSnippet: string;
  scriptSnippet: string;
  smokeChecks: { label: string; command: string }[];
};

export function buildPartnerPilotKit(
  partnerCode: string,
  origin = siteOrigin(),
): PartnerPilotKit | null {
  const code = normalizePartnerCode(partnerCode);
  if (!code || code.length < 2) return null;

  const base = origin.replace(/\/$/, "");
  const eauGuide = new URL("/comment-tokeniser/eau", base);
  eauGuide.searchParams.set("partner", code);

  const embedOpts = { partner: code, origin: base };

  return {
    partnerCode: code,
    origin: base,
    wizardUrl: buildHydrologicalPassportUrl(embedOpts),
    embedUrl: buildEauEmbedUrl(embedOpts),
    embedDocsUrl: `${base}/eau/embed/docs`,
    eauGuideUrl: eauGuide.toString(),
    portalUrl: `${base}/partners/portal`,
    h2oApiSample: `curl -sS -X POST ${base}/api/eau/check -H "Content-Type: application/json" -d '{"text":"Concession eau potable 15 ans 2 Mm³/an SPV France audit hydrologique"}'`,
    iframeSnippet: buildEauEmbedIframeSnippet(embedOpts),
    scriptSnippet: buildEauEmbedScriptSnippet(embedOpts),
    smokeChecks: [
      {
        label: "H₂O public catalog",
        command: `curl -sS ${base}/api/green/h2o/pilot-concession-france | head -c 200`,
      },
      {
        label: "Embed page",
        command: `curl -sS -o /dev/null -w "%{http_code}" "${buildEauEmbedUrl(embedOpts)}"`,
      },
      {
        label: "Partner portal",
        command: `curl -sS -o /dev/null -w "%{http_code}" ${base}/partners/portal`,
      },
    ],
  };
}

export function formatPartnerPilotKitMarkdown(kit: PartnerPilotKit): string {
  const lines = [
    `# Kit pilote partenaire — ${kit.partnerCode}`,
    "",
    `**Origine :** ${kit.origin}`,
    "",
    "## Liens à partager",
    "",
    `- Wizard (Passeport Hydrique) : ${kit.wizardUrl}`,
    `- Guide tokenisation eau : ${kit.eauGuideUrl}`,
    `- Widget embed : ${kit.embedUrl}`,
    `- Docs intégration : ${kit.embedDocsUrl}`,
    `- Portail partenaire : ${kit.portalUrl}`,
    "",
    "## Snippet iframe",
    "",
    "```html",
    kit.iframeSnippet,
    "```",
    "",
    "## Snippet JS (postMessage)",
    "",
    "```html",
    kit.scriptSnippet,
    "```",
    "",
    "## Événements postMessage",
    "",
    "- `auros:h2o:ready` — widget chargé",
    "- `auros:h2o:score` — preview calculé (`passport_required: true`)",
    "- `auros:h2o:passport` — clic CTA Passeport Hydrique",
    "",
    "Filtrer : `event.data.source === \"auros-embed\"`.",
    "",
    "## API headless",
    "",
    "```bash",
    kit.h2oApiSample,
    "```",
    "",
    "## Smoke tests",
    "",
    ...kit.smokeChecks.map((c) => `- **${c.label}** : \`${c.command}\``),
    "",
    "## Checklist attribution",
    "",
    "1. Partager un lien avec `?partner=" + kit.partnerCode + "`",
    "2. Compléter un lead ou dossier test",
    "3. Vérifier dans `/partners/portal` avec le code",
    "4. Export CSV ops : `GET /api/admin/partner-referrals` (Bearer CRON_SECRET)",
    "",
  ];
  return lines.join("\n");
}
