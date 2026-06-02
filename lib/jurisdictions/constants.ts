/** Public route — English slug for SEO */
export const JURISDICTIONS_ROUTE = "/jurisdictions";

export const JURISDICTIONS_STARTER_KIT_ROUTE = "/jurisdictions/starter-kit";

export const JURISDICTIONS_ANCHORS = {
  comparator: "#comparator",
  guide: "#guide",
  quote: "#devis",
  comparison: "#comparison",
  calculator: "#calculator",
  faq: "#faq",
} as const;

/** Google Forms embed URLs */
export const JURISDICTION_FORM_URLS = {
  guide:
    "https://docs.google.com/forms/d/e/1FAIpQLSeTtbUoWhiNvxgv5Ltmd8uNKruZsJTbPoCx9uOgAQux9670xQ/viewform?embedded=true",
  quote:
    "https://docs.google.com/forms/d/e/1FAIpQLSd_b0tC_rfuVw5QL8JplMDPUvx2oxfh6UZHGc9gxYkROqgIhg/viewform?embedded=true",
} as const;

export function isFormConfigured(url: string): boolean {
  return url.length > 0 && url.includes("google.com");
}
