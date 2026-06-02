import { searchRag, type RagQueryInput } from "@/lib/ai-first/rag";

export const revalidate = 3600;

function parseLimit(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseMinScore(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

function parseContentTypes(raw: string | null): string[] | undefined {
  if (!raw) return undefined;
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}

function parseBody(body: unknown): RagQueryInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (typeof o.query !== "string" || !o.query.trim()) return null;

  return {
    query: o.query.trim(),
    limit: typeof o.limit === "number" ? o.limit : undefined,
    minScore: typeof o.minScore === "number" ? o.minScore : undefined,
    contentTypes: Array.isArray(o.contentTypes)
      ? o.contentTypes.filter((x): x is string => typeof x === "string")
      : undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? searchParams.get("query");

  if (!query?.trim()) {
    return Response.json(
      {
        error: "missing_query",
        hint: "GET ?q=starter+kit+luxembourg or POST { \"query\": \"...\" }",
        examples: [
          "/ai-first/rag?q=où+structurer+émission+RWA+DIFC",
          "/ai-first/rag?q=starter+kit+prix",
          "/ai-first/rag?q=tokenisation+immobilier+luxembourg",
        ],
      },
      { status: 400 }
    );
  }

  const result = searchRag({
    query: query.trim(),
    limit: parseLimit(searchParams.get("limit")),
    minScore: parseMinScore(searchParams.get("minScore")),
    contentTypes: parseContentTypes(searchParams.get("contentTypes")),
  });

  return Response.json(result, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-AUROS-RAG-Version": result.catalogVersion,
    },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const input = parseBody(body);
  if (!input) {
    return Response.json(
      {
        error: "missing_query",
        hint: 'Body: { "query": "coût starter kit luxembourg", "limit": 5 }',
      },
      { status: 400 }
    );
  }

  const result = searchRag(input);

  return Response.json(result, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-AUROS-RAG-Version": result.catalogVersion,
    },
  });
}
