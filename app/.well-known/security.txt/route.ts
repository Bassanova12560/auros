import { NextResponse } from "next/server";

/** Minimal RFC 9116 — contact only (no attack-surface detail). */
export function GET() {
  const body = [
    "Contact: mailto:security@getauros.com",
    "Expires: 2027-07-21T00:00:00.000Z",
    "Preferred-Languages: fr, en",
    "Canonical: https://getauros.com/.well-known/security.txt",
    "Policy: https://getauros.com/security",
    "",
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
