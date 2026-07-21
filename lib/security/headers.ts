/**
 * Shared HTTP security headers for AUROS (users-first posture).
 * Embed routes keep frame-ancestors *; main site stays SAMEORIGIN.
 */

export const HSTS_VALUE =
  "max-age=63072000; includeSubDomains; preload";

/** Pragmatic CSP: Clerk, Stripe, Vercel Analytics, Supabase, maps tiles. */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://*.clerk.com https://*.clerk.accounts.dev",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://js.stripe.com",
    "https://va.vercel-scripts.com",
    "https://vercel.live",
  ].join(" "),
  [
    "connect-src 'self'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.stripe.com",
    "https://*.stripe.com",
    "https://vitals.vercel-insights.com",
    "https://vercel.live",
    "https://*.basemaps.cartocdn.com",
  ].join(" "),
  [
    "frame-src 'self'",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://js.stripe.com",
    "https://hooks.stripe.com",
    "https://vercel.live",
  ].join(" "),
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

export const EMBED_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors *",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com",
  "upgrade-insecure-requests",
].join("; ");

export const BASE_SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=()",
  },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Strict-Transport-Security", value: HSTS_VALUE },
];

export const MAIN_SECURITY_HEADERS: { key: string; value: string }[] = [
  ...BASE_SECURITY_HEADERS,
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

export const EMBED_SECURITY_HEADERS: { key: string; value: string }[] = [
  ...BASE_SECURITY_HEADERS,
  { key: "Content-Security-Policy", value: EMBED_CONTENT_SECURITY_POLICY },
];
