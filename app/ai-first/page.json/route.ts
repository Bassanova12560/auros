import {
  getAiFirstPageByPath,
  toPageExport,
} from "@/lib/ai-first";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return Response.json(
      {
        error: "missing_path",
        hint: "Use ?path=/jurisdictions or see /ai-first/index.json",
      },
      { status: 400 }
    );
  }

  const page = getAiFirstPageByPath(path);
  if (!page) {
    return Response.json({ error: "not_found", path }, { status: 404 });
  }

  return Response.json(toPageExport(page), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      Link: `<${page.canonicalUrl}>; rel="canonical"`,
    },
  });
}
