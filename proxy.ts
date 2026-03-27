import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedPrefixes = ["/espace-membre", "/en/espace-membre"];
const adminPrefixes = ["/admin", "/en/admin"];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip for API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check auth for protected routes
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAdmin = adminPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected || isAdmin) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/connexion", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin && (session.user as { role?: string })?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|sw.js|workbox-.*|manifest.webmanifest).*)",
  ],
};
