import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/connexion", req.url));
    if (token.role !== "admin") return NextResponse.redirect(new URL("/espace-membre", req.url));
  }

  if (pathname.startsWith("/espace-membre")) {
    if (!token) return NextResponse.redirect(new URL("/connexion", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/espace-membre/:path*"],
};
