import type { NextConfig } from "next";

import { LEGACY_COMPARATOR_REDIRECTS } from "./lib/comparators/constants";
import { GREEN_LEGACY_REDIRECTS } from "./lib/green/constants";
import {
  EMBED_SECURITY_HEADERS,
  MAIN_SECURITY_HEADERS,
} from "./lib/security/headers";
import { AUROS_LEGACY_REDIRECTS } from "./lib/site/redirects";

const nextConfig: NextConfig = {
  /** Avoid Turbopack chunk errors for Supabase sub-packages (common on WSL + /mnt/c). */
  serverExternalPackages: [
    "@supabase/supabase-js",
    "@supabase/postgrest-js",
    "@supabase/realtime-js",
    "@supabase/storage-js",
    "pdf-parse",
  ],
  async headers() {
    return [
      {
        source: "/eau/embed/:path*",
        headers: EMBED_SECURITY_HEADERS,
      },
      {
        source: "/embed/:path*",
        headers: EMBED_SECURITY_HEADERS,
      },
      {
        source: "/(.*)",
        headers: MAIN_SECURITY_HEADERS,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "api.getauros.com" }],
          destination: "/api/:path*",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "api.getauros.com" }],
        destination: "https://getauros.com/developers",
        permanent: false,
      },
      ...LEGACY_COMPARATOR_REDIRECTS.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
      ...GREEN_LEGACY_REDIRECTS.map(({ source, destination, permanent }) => ({
        source,
        destination,
        permanent,
      })),
      ...AUROS_LEGACY_REDIRECTS.map(({ source, destination, permanent }) => ({
        source,
        destination,
        permanent,
      })),
    ];
  },
};

export default nextConfig;
