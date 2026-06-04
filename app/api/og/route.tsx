import { ImageResponse } from "next/og";

import { OG_BG, OG_HEIGHT, OG_TAGLINE, OG_WIDTH } from "@/lib/seo/og-constants";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "AUROS").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: OG_BG,
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" }}>
          AUROS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 48 ? 48 : 56,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.4, color: "rgba(255,255,255,0.55)", maxWidth: 880 }}>
            {OG_TAGLINE}
          </div>
        </div>
        <div style={{ height: 3, width: 120, backgroundColor: "rgba(255,255,255,0.25)" }} />
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}
