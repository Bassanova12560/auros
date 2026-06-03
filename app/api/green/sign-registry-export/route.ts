import { NextRequest, NextResponse } from "next/server";

import {
  isRegistryExportContentHash,
  resolveRegistryExportSigningKey,
  signRegistryExportHash,
} from "@/lib/green/registry-export-signing";

export const runtime = "nodejs";

/** GET — sign registry PDF content hash for server-stamped export footer. */
export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get("hash")?.trim() ?? "";
  if (!isRegistryExportContentHash(hash)) {
    return NextResponse.json({ ok: false, error: "invalid_hash" }, { status: 400 });
  }

  if (!resolveRegistryExportSigningKey()) {
    return NextResponse.json({ ok: false, error: "no_signing_key" }, { status: 503 });
  }

  const sig = signRegistryExportHash(hash);
  if (!sig) {
    return NextResponse.json({ ok: false, error: "sign_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, hash: hash.toLowerCase(), sig });
}
