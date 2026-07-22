import { NextResponse } from "next/server";

import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import {
  activateSourceAttestation,
  enrollSourceAttestation,
  listSourceAttestations,
  signSourceDataPacket,
  verifySourcePacket,
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

/** GET — list pending/active sources */
export async function GET(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimitAsync(
    `toll-sources-get:${ip}`,
    30,
    60_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const rows = listSourceAttestations()
    .slice(0, 50)
    .map((r) => ({
      id: r.id,
      name: r.name,
      kind: r.kind,
      status: r.status,
      reliability: r.reliability,
      createdAt: r.createdAt,
      signed: Boolean(r.signature),
      lastVerifiedAt: r.lastVerifiedAt,
    }));
  return NextResponse.json({ ok: true, sources: rows });
}

/**
 * POST
 * - enroll (default): { name, kind, contactEmail, notes? }
 * - activate: { action: "activate", id }
 * - sign_packet: { action: "sign_packet", sourceId, eventType, payload }
 * - verify_packet: { action: "verify_packet", contentHash, signature }
 */
export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimitAsync(
    `toll-sources-post:${ip}`,
    12,
    3_600_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const action = String(body.action ?? "enroll").trim();

  if (action === "activate") {
    const row = activateSourceAttestation(String(body.id ?? ""));
    if ("error" in row) {
      return NextResponse.json(row, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      source: row,
      message: "Activated after signature verify (HITL).",
    });
  }

  if (action === "sign_packet") {
    const packet = signSourceDataPacket({
      sourceId: String(body.sourceId ?? ""),
      eventType: String(body.eventType ?? "data_point"),
      payload:
        body.payload && typeof body.payload === "object"
          ? (body.payload as Record<string, unknown>)
          : {},
      occurredAt:
        typeof body.occurredAt === "string" ? body.occurredAt : undefined,
    });
    if ("error" in packet) {
      return NextResponse.json(packet, { status: 400 });
    }
    return NextResponse.json({ ok: true, packet });
  }

  if (action === "verify_packet") {
    const ok = verifySourcePacket({
      contentHash: String(body.contentHash ?? ""),
      signature: String(body.signature ?? ""),
    });
    return NextResponse.json({ ok: true, verified: ok });
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
    message: row.signature
      ? "Enrolled + enrollment HMAC signed — HITL activate to raise reliability."
      : "Enrolled as pending — set ATTEST_SIGNING_KEY for signed packets.",
  });
}
