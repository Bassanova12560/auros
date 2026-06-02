import { buildAiFirstCatalog } from "@/lib/ai-first";

export const revalidate = 3600;

export async function GET() {
  const catalog = buildAiFirstCatalog();
  return Response.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-AUROS-AI-First-Version": catalog.version,
    },
  });
}
