import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Auth posture for the AUROS MVP:
 *   - /wizard       — public (anonymous lead capture)
 *   - /sign-in/*    — public
 *   - /sign-up/*    — public
 *   - /              — public (marketing/landing)
 *   - /dashboard/*  — protected
 *   - /dossier/*    — public (localStorage preview)
 *   - /api/webhook/* — public (server-to-server, signed)
 *
 * Everything not whitelisted above stays public by default — auth is only
 * enforced on the explicitly-protected paths.
 */
/** Routes toujours publiques (RGPD : pages légales accessibles sans compte). */
const isPublicRoute = createRouteMatcher([
  "/",
  "/wizard(.*)",
  "/dossier(.*)",
  "/dossier/shared(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/legal(.*)",
  "/partners(.*)",
  "/starter(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (_auth, req) => {
  if (isPublicRoute(req)) return;
  /* Dashboard et autres routes : accès public (état invité sur /dashboard). */
});

export const config = {
  matcher: [
    /*
     * Next.js 16 proxy matcher — skip static assets and build output,
     * run on all pages and API routes (Clerk needs API for server auth).
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
