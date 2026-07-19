import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Auth posture: open by default (wizard, Green hub, APIs with own keys).
 * Explicit Clerk gates: dashboard, Green actor space, developer key dashboard.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/green/my(.*)",
  "/developers/dashboard(.*)",
  "/partners/dashboard(.*)",
  "/platforms/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
