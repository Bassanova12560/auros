import { NextResponse } from "next/server";

import { getGreenIndexPayload } from "@/lib/green-index";

export const revalidate = 3600;

/** Public JSON feed for Green Index (press, API consumers). */
export async function GET() {
  const payload = await getGreenIndexPayload();
  return NextResponse.json({
    ok: true,
    payload,
    disclaimer: "Indicative — not investment advice.",
  });
}
