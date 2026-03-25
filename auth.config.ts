import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/connexion" },
  callbacks: {
    // Reconstruit le role depuis le JWT pour que le middleware y ait accès
    session({ session, token }) {
      if (token?.role)
        (session.user as { role?: string }).role = token.role as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string })?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) {
        if (isLoggedIn && role === "admin") return true;
        // Connecté mais pas admin → espace membre
        if (isLoggedIn)
          return Response.redirect(new URL("/espace-membre", nextUrl));
        // Non connecté → page de connexion
        return false;
      }

      if (pathname.startsWith("/espace-membre")) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  providers: [],
};
