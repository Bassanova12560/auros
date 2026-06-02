import { buildTokenizationStudioPlan } from "@/lib/studio";
import { RWA_DOCUMENT_PHASES } from "@/lib/rwa-document-phases";
import type { Locale } from "@/lib/i18n";
import type { WizardData } from "@/lib/wizard-types";

const TITLES: Record<Locale, { pack: string; regulatory: string; roadmap: string; docs: string }> = {
  fr: {
    pack: "Pack juridique indicatif — AUROS",
    regulatory: "Cadre réglementaire (indicatif)",
    roadmap: "Rétroplanning",
    docs: "Plans de documents",
  },
  en: {
    pack: "Indicative legal pack — AUROS",
    regulatory: "Regulatory path (indicative)",
    roadmap: "Roadmap",
    docs: "Document blueprints",
  },
  es: {
    pack: "Pack jurídico indicativo — AUROS",
    regulatory: "Marco regulatorio (indicativo)",
    roadmap: "Hoja de ruta",
    docs: "Planos de documentos",
  },
};

export function buildLegalPackMarkdown(data: WizardData, locale: Locale): string {
  const t = TITLES[locale] ?? TITLES.fr;
  const plan = buildTokenizationStudioPlan(data);
  const lines: string[] = [
    `# ${t.pack}`,
    "",
    `**Actif:** ${data.assetType}`,
    `**Localisation:** ${[data.city, data.country].filter(Boolean).join(", ")}`,
    `**Plateforme cible:** ${data.platform || "—"}`,
    "",
    `> Non-conseil juridique. Faites valider par un cabinet avant émission.`,
    "",
    `## ${t.regulatory}`,
    "",
    `- Instrument: ${String(plan.instrument).replace(/_/g, " ")}`,
    `- Régime: ${plan.regulatory.regime}`,
    `- Structure: ${plan.regulatory.structureRecommendation}`,
    "",
    `## ${t.roadmap}`,
    "",
  ];

  for (const step of plan.roadmap) {
    lines.push(`### ${step.title}`, "", step.duration, "");
    for (const task of step.tasks) {
      lines.push(`- [${task.owner}] ${task.title} — ${task.description}`);
    }
    lines.push("");
  }

  lines.push(`## ${t.docs}`, "");
  for (const doc of plan.documents) {
    lines.push(`### ${doc.title}`, "", `*${doc.id}*`, "");
    for (const s of doc.outline) {
      lines.push(`- ${s}`);
    }
    if (doc.prefilled) {
      lines.push("", doc.prefilled);
    }
    lines.push("");
  }

  lines.push("## Data room — checklist", "");
  for (const phase of RWA_DOCUMENT_PHASES) {
    lines.push(`### ${phase.title}`);
    for (const d of phase.documents) {
      const held = data.documents.includes(d.id);
      lines.push(`- [${held ? "x" : " "}] ${d.label}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
