import { NextResponse } from "next/server";

import { continuityPlaybookPdfBlob } from "@/lib/resilience/continuity-playbook-pdf";
import type { ContinuityPlaybook } from "@/lib/wets/continuity-playbook";

export const runtime = "nodejs";

/** POST { playbook: ContinuityPlaybook } → PDF one-pager */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { playbook?: ContinuityPlaybook };
    if (!body.playbook?.scenarios?.length) {
      return NextResponse.json({ error: "playbook required" }, { status: 400 });
    }
    const blob = await continuityPlaybookPdfBlob(body.playbook);
    const buf = new Uint8Array(await blob.arrayBuffer());
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="auros-continuity-playbook.pdf"',
      },
    });
  } catch (err) {
    console.error("[continuity-playbook/pdf]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PDF failed" },
      { status: 500 }
    );
  }
}
