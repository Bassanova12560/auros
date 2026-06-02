import {
  fulfillAcademyDiplomaPayment,
} from "@/lib/academy/fulfill-diploma-payment";
import {
  getPurchaseByStripeSession,
} from "@/lib/academy/diploma-purchase";
import { retrievePaidCheckoutSession } from "@/lib/academy/diploma-checkout";
import { diplomaProduct } from "@/lib/academy/diploma-pricing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return Response.json({ error: "missing_session" }, { status: 400 });
  }

  const session = await retrievePaidCheckoutSession(sessionId);
  if (!session) {
    return Response.json({ error: "payment_pending" }, { status: 402 });
  }

  let purchase = await getPurchaseByStripeSession(sessionId);
  if (!purchase) {
    const fulfilled = await fulfillAcademyDiplomaPayment(session);
    if (!fulfilled.ok) {
      return Response.json({ error: fulfilled.reason }, { status: 503 });
    }
    purchase = await getPurchaseByStripeSession(sessionId);
  }

  if (!purchase) {
    return Response.json({ error: "purchase_not_found" }, { status: 404 });
  }

  const product = diplomaProduct(purchase.productType);

  return Response.json({
    ok: true,
    purchase: {
      id: purchase.id,
      productType: purchase.productType,
      certId: purchase.certId,
      organizationName: purchase.organizationName,
      priceLabel: product.priceLabel,
    },
  });
}
