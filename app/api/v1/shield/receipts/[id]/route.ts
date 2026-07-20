import { protocolError, protocolJson, protocolRoute } from "@/lib/protocol";
import { getReceiptAsync, toPublicVerify } from "@/lib/shield";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Public receipt lookup — free, no auth, no payload. */
export const GET = protocolRoute(async (_req: Request, ctx: Ctx) => {
  const { id } = await ctx.params;
  const receipt = await getReceiptAsync(id);
  if (!receipt) {
    return protocolError("not_found", "Receipt not found", 404);
  }
  return protocolJson({
    ...toPublicVerify(receipt),
    freemium: "public_verify_free",
  });
});
