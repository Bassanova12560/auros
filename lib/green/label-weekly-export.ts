import { internalNotifyEmail, resendFrom } from "@/lib/emails/constants";
import {
  greenLabelApplicationsToCsv,
  suggestedGreenLabelApplicationsCsvFilename,
} from "@/lib/green/label-applications-csv";
import {
  listGreenLabelApplicationsForExport,
  type GreenLabelExportFilter,
} from "@/lib/green/label-applications-export";
import { getGreenLabelReminderStats } from "@/lib/green/label-reminder-stats";
import { buildGreenLabelWeeklyExportEmailHtml } from "@/lib/green/label-weekly-export-email";
import { Resend } from "resend";

export type GreenLabelWeeklyExportResult = {
  sent: boolean;
  rowCount: number;
  filter: GreenLabelExportFilter;
  reason?: string;
};

function resolveOpsEmail(): string | null {
  const ops = process.env.OPS_EMAIL?.trim();
  if (ops && ops.includes("@")) return ops;
  return internalNotifyEmail();
}

function resolveWeeklyExportFilter(): GreenLabelExportFilter {
  const raw = process.env.GREEN_LABEL_WEEKLY_EXPORT_FILTER?.trim()?.toLowerCase();
  if (raw === "incomplete") return "incomplete";
  return "all";
}

/** Weekly cron — e-mail label applications CSV to ops inbox. */
export async function runGreenLabelWeeklyExportCron(): Promise<GreenLabelWeeklyExportResult> {
  const filter = resolveWeeklyExportFilter();
  const to = resolveOpsEmail();
  if (!to) {
    return { sent: false, rowCount: 0, filter, reason: "no_ops_email" };
  }

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { sent: false, rowCount: 0, filter, reason: "no_resend_key" };
  }

  const rows = await listGreenLabelApplicationsForExport(filter);
  const stats = await getGreenLabelReminderStats();
  const csv = greenLabelApplicationsToCsv(rows);
  const filename = suggestedGreenLabelApplicationsCsvFilename(filter);
  const date = new Date().toISOString().slice(0, 10);

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to: [to],
    subject: `[AUROS Green] Export candidatures label — ${date} (${filter})`,
    html: buildGreenLabelWeeklyExportEmailHtml({
      filter,
      rowCount: rows.length,
      filename,
      date,
      stats,
    }),
    attachments: [
      {
        filename,
        content: Buffer.from(csv, "utf-8"),
      },
    ],
  });

  if (error) {
    console.error("[green/label-weekly-export]", error);
    return { sent: false, rowCount: rows.length, filter, reason: "send_failed" };
  }

  return { sent: true, rowCount: rows.length, filter };
}
