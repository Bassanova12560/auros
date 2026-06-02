import { createDiplomaCheckoutSession } from "@/lib/academy/diploma-checkout";
import type { DiplomaProductType } from "@/lib/academy/diploma-pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const diplomaType = o.diplomaType;
  if (diplomaType !== "individual" && diplomaType !== "institution") {
    return Response.json({ error: "invalid_product" }, { status: 400 });
  }

  const contactEmail = typeof o.contactEmail === "string" ? o.contactEmail : "";
  if (!contactEmail.trim()) {
    return Response.json({ error: "missing_email" }, { status: 400 });
  }

  try {
    const result = await createDiplomaCheckoutSession({
      diplomaType: diplomaType as DiplomaProductType,
      certToken: typeof o.certToken === "string" ? o.certToken : undefined,
      organizationName:
        typeof o.organizationName === "string" ? o.organizationName : undefined,
      contactEmail,
      contactName: typeof o.contactName === "string" ? o.contactName : undefined,
    });

    if ("error" in result) {
      const status =
        result.error === "stripe_unconfigured"
          ? 503
          : result.error === "invalid_cert" || result.error === "missing_cert"
            ? 422
            : 400;
      return Response.json({ error: result.error }, { status });
    }

    return Response.json({ ok: true, url: result.url });
  } catch (err) {
    console.error("[academy/diploma/checkout]", err);
    return Response.json({ error: "checkout_failed" }, { status: 500 });
  }
}
