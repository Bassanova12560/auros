/**
 * Institutional white-label branding tokens for embed + desk.
 * Configure via AUROS_INSTITUTIONAL_BRANDS JSON array.
 */

export type InstitutionalBrand = {
  partnerId: string;
  companyName: string;
  primaryColor: string;
  accentColor?: string;
  logoUrl?: string;
  hideAurosBranding?: boolean;
  productLabel?: string;
};

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const DEMO_BRANDS: InstitutionalBrand[] = [
  {
    partnerId: "demo",
    companyName: "AUROS Demo Desk",
    primaryColor: "#059669",
    accentColor: "#34d399",
    productLabel: "Portfolio",
    hideAurosBranding: false,
  },
];

export function isSafeBrandHex(color: string): boolean {
  return HEX.test(color.trim());
}

export function normalizePartnerId(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 40);
}

function parseBrandsJson(raw: string | undefined): InstitutionalBrand[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: InstitutionalBrand[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const partnerId = normalizePartnerId(String(r.partnerId ?? r.id ?? ""));
      const companyName = String(r.companyName ?? r.company_name ?? "").trim();
      const primaryColor = String(r.primaryColor ?? r.primary_color ?? "").trim();
      if (!partnerId || !companyName || !isSafeBrandHex(primaryColor)) continue;
      const accent = String(r.accentColor ?? r.accent_color ?? "").trim();
      const logoUrl = String(r.logoUrl ?? r.logo_url ?? "").trim();
      out.push({
        partnerId,
        companyName: companyName.slice(0, 80),
        primaryColor,
        accentColor: isSafeBrandHex(accent) ? accent : undefined,
        logoUrl:
          logoUrl.startsWith("https://") && logoUrl.length < 300
            ? logoUrl
            : undefined,
        hideAurosBranding: Boolean(
          r.hideAurosBranding ?? r.hide_auros_branding
        ),
        productLabel: String(r.productLabel ?? r.product_label ?? "Portfolio")
          .trim()
          .slice(0, 40) || "Portfolio",
      });
    }
    return out;
  } catch {
    return [];
  }
}

export function listInstitutionalBrands(
  envJson = process.env.AUROS_INSTITUTIONAL_BRANDS
): InstitutionalBrand[] {
  const fromEnv = parseBrandsJson(envJson);
  if (fromEnv.length) return fromEnv;
  return DEMO_BRANDS;
}

export function resolveInstitutionalBrand(
  partnerId: string | null | undefined,
  brands = listInstitutionalBrands()
): InstitutionalBrand | null {
  if (!partnerId) return null;
  const id = normalizePartnerId(partnerId);
  return brands.find((b) => b.partnerId === id) ?? null;
}

export function brandCssVars(brand: InstitutionalBrand): Record<string, string> {
  return {
    ["--auros-brand-primary"]: brand.primaryColor,
    ["--auros-brand-accent"]: brand.accentColor ?? brand.primaryColor,
  };
}

export function embedIframeSnippet(input: {
  origin: string;
  partnerId: string;
  theme?: "dark" | "light";
}): string {
  const theme = input.theme ?? "dark";
  const src = `${input.origin.replace(/\/$/, "")}/embed/portfolio?partner=${encodeURIComponent(input.partnerId)}&theme=${theme}`;
  return `<iframe src="${src}" width="360" height="180" style="border:0;border-radius:0" title="AUROS Portfolio" loading="lazy"></iframe>`;
}
