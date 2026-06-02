import type { NextConfig } from "next";

import { LEGACY_COMPARATOR_REDIRECTS } from "./lib/comparators/constants";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  /** Avoid Turbopack chunk errors for Supabase sub-packages (common on WSL + /mnt/c). */
  serverExternalPackages: [
    "@supabase/supabase-js",
    "@supabase/postgrest-js",
    "@supabase/realtime-js",
    "@supabase/storage-js",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return LEGACY_COMPARATOR_REDIRECTS.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
