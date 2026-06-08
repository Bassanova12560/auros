import { AUROS_RESOURCES_ROUTE } from "../green/constants";

/** Legacy AUROS URLs → canonical routes (French site spelling). */
export const AUROS_LEGACY_REDIRECTS = [
  { source: "/resources", destination: AUROS_RESOURCES_ROUTE, permanent: true },
  {
    source: "/resources/:path*",
    destination: `${AUROS_RESOURCES_ROUTE}/:path*`,
    permanent: true,
  },
] as const;
