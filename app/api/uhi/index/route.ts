import { NextResponse } from "next/server";

import { getUhiIndexPayload } from "@/lib/uhi-index";

export const revalidate = 3600;

export async function GET() {
  const payload = await getUhiIndexPayload();
  return NextResponse.json({
    ok: true,
    ...payload,
    disclaimer:
      "Indicative AUROS UHI Index — not investment advice. MoM/YTD illustrative on early editions.",
  });
}
