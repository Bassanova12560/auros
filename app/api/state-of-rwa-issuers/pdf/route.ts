import {
  CURRENT_EDITION,
  generateStateOfRwaIssuersPdf,
  getStateOfRwaIssuersPayload,
  suggestedReportFilename,
  verifyReportDownloadToken,
} from "@/lib/state-of-rwa-issuers";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  const edition = url.searchParams.get("edition")?.trim() || CURRENT_EDITION;
  const localeParam = url.searchParams.get("locale")?.trim() ?? DEFAULT_LOCALE;
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  if (!token) {
    return Response.json({ error: "token_required" }, { status: 401 });
  }

  const verified = verifyReportDownloadToken(token, edition);
  if (!verified) {
    return Response.json({ error: "invalid_token" }, { status: 403 });
  }

  try {
    const payload = await getStateOfRwaIssuersPayload();
    const blob = await generateStateOfRwaIssuersPdf(payload, locale);
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${suggestedReportFilename(edition)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[state-of-rwa-issuers/pdf]", err);
    return Response.json({ error: "pdf_failed" }, { status: 500 });
  }
}
