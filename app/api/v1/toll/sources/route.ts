import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  enrollSourceAttestation,
  listSourceAttestations,
  type SourceAttestationKind,
} from "@/lib/toll/source-attestation";

export const runtime = "nodejs";

const KINDS = new Set<SourceAttestationKind>([
  "utility",
  "erp",
  "bank",
  "notary",
  "registry",
  "sensor",
  "auditor",
  "other",
]);

/** GET — list pending/active sources (public read, limited) */
export async function GET() {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll-sources-get:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const rows = listSourceAttestations().slice(0, 50).map((r) => ({
    id: r.id,
    name: r.name,
    kind: r.kind,
    status: r.status,
    reliability: r.reliability,
    createdAt: r.createdAt,
  }));
  return NextResponse.json({ ok: true, sources: rows });
}

/** POST — enroll source (HITL pending) */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll-sources-post:${ip}`, 8, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contactEmail =
    typeof body.contactEmail === "string"
      ? body.contactEmail.trim().toLowerCase()
      : "";
  const kind = String(body.kind ?? "other") as SourceAttestationKind;
  if (!name || !contactEmail.includes("@")) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }
  const row = enrollSourceAttestation({
    name,
    kind,
    contactEmail,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  return NextResponse.json({
    ok: true,
    source: row,
    message: "Enrolled as pending — ops HITL activates reliability.",
  });
}
