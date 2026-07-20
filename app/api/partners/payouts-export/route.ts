import { auth, currentUser } from "@clerk/nextjs/server";

import { normalizePartnerCode } from "@/lib/partner-attribution";
import {
  getPartnerStats,
  resolvePartnerForClerkUser,
} from "@/lib/partners/registry";
import { listPartnerReferrals } from "@/lib/partners/referral-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Phase D lite — accounting CSV export (estimated commissions).
 * Not a payout engine — ops/legal still settle offline.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;
  const partner = await resolvePartnerForClerkUser(userId, email);
  if (!partner || partner.status !== "active") {
    return new Response("Forbidden", { status: 403 });
  }

  const code =
    normalizePartnerCode(partner.code) ?? partner.code.toUpperCase();
  const rows = await listPartnerReferrals(code);
  const stats = await getPartnerStats(code);
  const exportedAt = new Date().toISOString();

  const lines = [
    "partner_code,kind,ref_id,email,created_at,commission_status,export_note",
  ];
  for (const r of rows) {
    const emailCell = (r.email ?? "").replace(/"/g, '""');
    lines.push(
      [
        code,
        r.recordType,
        r.id,
        `"${emailCell}"`,
        r.createdAt,
        "estimated",
        "phase_d_export_not_paid",
      ].join(",")
    );
  }
  lines.push(
    `# summary leads=${stats.leads} dossiers=${stats.dossiers} total=${stats.total} exported_at=${exportedAt}`
  );

  return new Response(`${lines.join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="auros-partner-${code}-payouts.csv"`,
    },
  });
}
