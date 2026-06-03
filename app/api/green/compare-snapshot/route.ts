import { NextRequest, NextResponse } from "next/server";

import {
  createGreenCompareSnapshot,
  getGreenCompareSnapshot,
  normalizeCompareSnapshotPayload,
} from "@/lib/green/compare-snapshot";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const CREATE_LIMIT = 30;
const CREATE_WINDOW_MS = 3_600_000;

/** POST — create snapshot. GET ?id= — fetch snapshot payload */
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(
    `green-compare-snapshot:${ip}`,
    CREATE_LIMIT,
    CREATE_WINDOW_MS
  );
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const payload = normalizeCompareSnapshotPayload(body);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = await createGreenCompareSnapshot(payload);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    expiresAt: result.expiresAt,
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const snapshot = await getGreenCompareSnapshot(id);
  if (!snapshot) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    id: snapshot.id,
    payload: snapshot.payload,
    createdAt: snapshot.createdAt,
    expiresAt: snapshot.expiresAt,
  });
}
