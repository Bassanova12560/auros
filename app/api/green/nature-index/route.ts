import { NextResponse } from "next/server";

import {
  authenticateGreenPublicRequest,
  greenApiJson,
  greenApiOptions,
} from "@/lib/green/api";
import { getNatureIndexPayload } from "@/lib/green/nature-index";

export const revalidate = 3600;

export function OPTIONS() {
  return greenApiOptions();
}

export async function GET(req: Request) {
  const authResult = await authenticateGreenPublicRequest(req);
  if (!authResult.ok) return authResult.response;

  const payload = await getNatureIndexPayload();
  return greenApiJson(
    {
      ok: true,
      payload,
      tier: authResult.auth.tier,
      docs: "/data/nature-score",
    },
    { auth: authResult.auth }
  );
}
