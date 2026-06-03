import type { GreenLabelReminderStats } from "./label-reminder-stats";
import type { GreenLabelExportFilter } from "./label-applications-export";

export function buildGreenLabelWeeklyExportEmailHtml(input: {
  filter: GreenLabelExportFilter;
  rowCount: number;
  filename: string;
  date: string;
  stats: GreenLabelReminderStats | null;
}): string {
  const { filter, rowCount, filename, date, stats } = input;

  const statsBlock = stats
    ? `
      <h3 style="margin:16px 0 8px;font-size:14px;">Relances dossiers incomplets</h3>
      <table style="border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:4px 12px 4px 0;">Incomplet sans relance</td><td><strong>${stats.pendingIncomplete}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;">Relance 1 envoyée</td><td><strong>${stats.remindedOnce}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;">Relance 2 envoyée</td><td><strong>${stats.remindedTwice}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;">Dossier complet</td><td><strong>${stats.complete}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;">Total candidatures</td><td><strong>${stats.total}</strong></td></tr>
      </table>
    `
    : `<p style="font-size:13px;color:#666;">Stats relances indisponibles (base non synchronisée).</p>`;

  return `
    <p>Export hebdomadaire des candidatures label AUROS Green — ${date}.</p>
    <p>Filtre : <strong>${filter}</strong> · ${rowCount} ligne(s) dans le CSV.</p>
    ${statsBlock}
    <p>Pièce jointe : ${filename}</p>
  `.trim();
}
