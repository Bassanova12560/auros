/**
 * Solo operator — change dossier status in Supabase + optional status email.
 *
 * Usage:
 *   npx tsx scripts/ops-set-dossier-status.ts <dossier-uuid> <status> [fr|en|es]
 *
 * Status: submitted | in_review | needs_info | approved
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_* for email
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import {
  DOSSIER_STATUSES,
  normalizeDossierStatus,
  type DossierStatus,
} from "../lib/dossier-status";
import { sendDossierStatusUpdate } from "../lib/emails/send";
import { isLocale, type Locale } from "../lib/i18n";
import { splitDossierDataBlob } from "../lib/dossier-data";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnv();
  const [dossierId, rawStatus, rawLocale] = process.argv.slice(2);
  if (!dossierId || !rawStatus) {
    console.error(
      "Usage: npx tsx scripts/ops-set-dossier-status.ts <uuid> <status> [fr|en|es]"
    );
    process.exit(1);
  }

  const status = normalizeDossierStatus(rawStatus) as DossierStatus;
  if (!DOSSIER_STATUSES.includes(status)) {
    console.error("Invalid status:", rawStatus);
    process.exit(1);
  }

  const locale: Locale =
    rawLocale && isLocale(rawLocale) ? rawLocale : "fr";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("Missing Supabase env");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data: row, error } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, status")
    .eq("id", dossierId)
    .maybeSingle();

  if (error || !row) {
    console.error("Dossier not found:", error?.message);
    process.exit(1);
  }

  const { error: upd } = await supabase
    .from("dossiers")
    .update({ status })
    .eq("id", dossierId);

  if (upd) {
    console.error("Update failed:", upd.message);
    process.exit(1);
  }

  console.log(`OK status=${status} dossier=${dossierId}`);

  const { wizard } = splitDossierDataBlob(
    (row.data as Record<string, unknown>) ?? {}
  );
  const email =
    typeof wizard.email === "string" ? wizard.email.trim() : "";
  const firstName =
    typeof wizard.firstName === "string" ? wizard.firstName : "";
  const assetType =
    (row.asset_type as string) ||
    (typeof wizard.assetType === "string" ? wizard.assetType : "Asset");

  if (
    email &&
    (status === "in_review" ||
      status === "needs_info" ||
      status === "approved")
  ) {
    const sent = await sendDossierStatusUpdate(
      email,
      status,
      locale,
      firstName,
      assetType
    );
    console.log(sent ? "Email sent" : "Email skipped (Resend?)");
  }
}

main();
