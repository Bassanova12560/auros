import { NextResponse } from "next/server";

/**
 * RFC 9116 security.txt — responsible disclosure for AUROS users & researchers.
 */
export function GET() {
  const body = [
    "Contact: mailto:security@getauros.com",
    "Contact: mailto:privacy@auros.app",
    "Expires: 2027-07-21T00:00:00.000Z",
    "Preferred-Languages: fr, en",
    "Canonical: https://getauros.com/.well-known/security.txt",
    "Policy: https://getauros.com/security",
    "Acknowledgments: https://getauros.com/security",
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
