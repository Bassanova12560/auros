import { NextRequest, NextResponse } from "next/server";

import {
  isRegistryExportContentHash,
  resolveRegistryExportSigningKey,
  verifyRegistryExportSignature,
} from "@/lib/green/registry-export-signing";

export const runtime = "nodejs";

/** GET — verify registry PDF export HMAC (`hash` + `sig` from footer). */
export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get("hash")?.trim() ?? "";
  const sig = req.nextUrl.searchParams.get("sig")?.trim() ?? "";

  if (!isRegistryExportContentHash(hash)) {
    return NextResponse.json({ ok: false, error: "invalid_hash" }, { status: 400 });
  }
  if (!sig) {
    return NextResponse.json({ ok: false, error: "missing_sig" }, { status: 400 });
  }

  if (!resolveRegistryExportSigningKey()) {
    return NextResponse.json(
      { ok: true, valid: false, reason: "no_signing_key" },
      { status: 200 }
    );
  }

  const valid = verifyRegistryExportSignature(hash, sig);
  return NextResponse.json({ ok: true, valid, hash: hash.toLowerCase() });
}
