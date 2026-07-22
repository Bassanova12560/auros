/**
 * Institutional HITL requests — branding activation + IdP metadata.
 * Local file + ops email. No auto-apply to production env.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

import { isValidCaptureEmail } from "@/lib/email-capture";
import {
  isSafeBrandHex,
  normalizePartnerId,
} from "@/lib/green/institutional-branding";
import { sendInstitutionalRequestInternal } from "@/lib/emails/send";

export type InstitutionalRequestKind = "branding" | "idp";

export type InstitutionalRequest = {
  id: string;
  kind: InstitutionalRequestKind;
  email: string;
  companyName: string;
  partnerId?: string;
  primaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  hideAurosBranding?: boolean;
  productLabel?: string;
  idpProtocol?: "saml" | "oidc";
  metadataUrl?: string;
  metadataXmlSnippet?: string;
  notes?: string;
  status: "pending_hitl";
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "institutional-requests.json");

function load(): InstitutionalRequest[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as InstitutionalRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: InstitutionalRequest[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-500), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export type SubmitInstitutionalRequestInput = {
  kind: InstitutionalRequestKind;
  email: string;
  companyName: string;
  partnerId?: string;
  primaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  hideAurosBranding?: boolean;
  productLabel?: string;
  idpProtocol?: "saml" | "oidc";
  metadataUrl?: string;
  metadataXmlSnippet?: string;
  notes?: string;
};

export async function submitInstitutionalRequest(
  input: SubmitInstitutionalRequestInput
): Promise<
  | { ok: true; id: string; previewUrl?: string }
  | { ok: false; error: string }
> {
  const email = input.email.trim().toLowerCase();
  if (!isValidCaptureEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }
  const companyName = input.companyName.trim().slice(0, 80);
  if (companyName.length < 2) {
    return { ok: false, error: "invalid_company" };
  }

  if (input.kind === "branding") {
    const partnerId = normalizePartnerId(input.partnerId ?? companyName);
    const primaryColor = (input.primaryColor ?? "#059669").trim();
    if (!partnerId || !isSafeBrandHex(primaryColor)) {
      return { ok: false, error: "invalid_branding" };
    }
    const accent = input.accentColor?.trim();
    if (accent && !isSafeBrandHex(accent)) {
      return { ok: false, error: "invalid_accent" };
    }
    const logoUrl = input.logoUrl?.trim();
    if (logoUrl && !logoUrl.startsWith("https://")) {
      return { ok: false, error: "invalid_logo" };
    }

    const row: InstitutionalRequest = {
      id: `ir_${randomBytes(8).toString("hex")}`,
      kind: "branding",
      email,
      companyName,
      partnerId,
      primaryColor,
      accentColor: accent && isSafeBrandHex(accent) ? accent : undefined,
      logoUrl: logoUrl?.slice(0, 300),
      hideAurosBranding: Boolean(input.hideAurosBranding),
      productLabel: (input.productLabel ?? "Portfolio").trim().slice(0, 40),
      notes: input.notes?.trim().slice(0, 500),
      status: "pending_hitl",
      createdAt: new Date().toISOString(),
    };
    const all = load();
    all.push(row);
    save(all);
    await sendInstitutionalRequestInternal(row);
    return {
      ok: true,
      id: row.id,
      previewUrl: `/embed/portfolio?partner=${encodeURIComponent(partnerId)}&theme=dark`,
    };
  }

  // idp
  const metadataUrl = input.metadataUrl?.trim();
  const snippet = input.metadataXmlSnippet?.trim();
  if (!metadataUrl && !snippet) {
    return { ok: false, error: "missing_metadata" };
  }
  if (metadataUrl && !/^https:\/\//i.test(metadataUrl)) {
    return { ok: false, error: "invalid_metadata_url" };
  }

  const row: InstitutionalRequest = {
    id: `ir_${randomBytes(8).toString("hex")}`,
    kind: "idp",
    email,
    companyName,
    idpProtocol: input.idpProtocol === "oidc" ? "oidc" : "saml",
    metadataUrl: metadataUrl?.slice(0, 500),
    metadataXmlSnippet: snippet?.slice(0, 4000),
    notes: input.notes?.trim().slice(0, 500),
    status: "pending_hitl",
    createdAt: new Date().toISOString(),
  };
  const all = load();
  all.push(row);
  save(all);
  await sendInstitutionalRequestInternal(row);
  return { ok: true, id: row.id };
}
