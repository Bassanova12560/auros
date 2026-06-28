import { buildGreenIndexChangelog } from "@/lib/green/api/changelog";
import { absoluteUrl } from "@/lib/comparators/site";

export const revalidate = 3600;

/** Atom RSS feed for Green Index monthly movers (press / aggregators). */
export async function GET() {
  const changelog = buildGreenIndexChangelog();
  const base = absoluteUrl("");
  const feedUrl = `${base}/api/green/changelog/rss`;
  const updated = changelog.generated_at;

  const items = changelog.top_movers
    .map((m) => {
      const pct = m.mom_pct != null ? `${m.mom_pct > 0 ? "+" : ""}${m.mom_pct}%` : "n/a";
      return `    <item>
      <title>${escapeXml(m.name)} — rank #${m.rank} (${pct} MoM)</title>
      <link>${base}/api/green/score/${encodeURIComponent(m.id)}</link>
      <guid isPermaLink="true">${base}/api/green/score/${encodeURIComponent(m.id)}</guid>
      <pubDate>${new Date(updated).toUTCString()}</pubDate>
      <description>AUROS Green Index mover — composite score change ${pct}. Edition ${changelog.edition}.</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AUROS Green Index Changelog</title>
    <link>${base}/data/green-index</link>
    <description>Monthly movers — AUROS Green RWA Index (CQS + Watt)</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
