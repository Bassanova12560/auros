import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  enforceSensitiveApiBurst,
  newRequestId,
} from "@/lib/security/request-guard";
import { isBlockedProbePath } from "@/lib/security/paths";

/**
 * Auth posture: open by default (wizard, Green hub, APIs with own keys).
 * Explicit Clerk gates: dashboards, ops UI, developer/partner spaces.
 * Users-first: block probe paths, rate-limit sensitive APIs, request IDs.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/green/my(.*)",
  "/green/admin(.*)",
  "/developers/dashboard(.*)",
  "/partners/dashboard(.*)",
  "/platforms/dashboard(.*)",
  "/ops(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const requestId = newRequestId();
  const pathname = req.nextUrl.pathname;

  if (isBlockedProbePath(pathname)) {
    return new NextResponse(null, {
      status: 404,
      headers: { "X-Request-Id": requestId },
    });
  }

  const burst = await enforceSensitiveApiBurst(req, pathname);
  if (burst) {
    burst.headers.set("X-Request-Id", requestId);
    return burst;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const res = NextResponse.next();
  res.headers.set("X-Request-Id", requestId);
  return res;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
