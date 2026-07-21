import { NextResponse } from "next/server";

import { isValidAssetDnaId, resolveAssetDna } from "@/lib/asset-dna";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** Public read — Asset DNA record by id. */
export async function GET(_request: Request, { params }: Params) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`asset-dna-get:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const { id: raw } = await params;
  const id = decodeURIComponent(raw ?? "").trim();
  if (!isValidAssetDnaId(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const record = await resolveAssetDna(id);
  if (!record) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    dna: record,
    stream: `/api/v1/asset-dna/${encodeURIComponent(id)}/stream`,
  });
}
