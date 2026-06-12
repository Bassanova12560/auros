import {
  attachRecommendedPlatforms,
  authenticateProtocolRequest,
  computeProtocolScore,
  parseDescription,
  protocolError,
  protocolJson,
  protocolRoute,
  scoreRequestSchema,
} from "@/lib/protocol";
import { topPlatformsForAsset } from "@/lib/protocol/products/adapter";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = scoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = computeProtocolScore(parsed.data);
  const assetType =
    parsed.data.asset_type ??
    (parsed.data.description
      ? parseDescription(parsed.data.description).assetType
      : "other");
  const platforms = await topPlatformsForAsset(assetType);
  const enriched = await attachRecommendedPlatforms(result, platforms);

  return protocolJson(enriched);
});
