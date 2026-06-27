import { buildGreenApiOpenApiSpec } from "@/lib/green/api";

export const revalidate = 86400;

export function GET() {
  return Response.json(buildGreenApiOpenApiSpec(), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
