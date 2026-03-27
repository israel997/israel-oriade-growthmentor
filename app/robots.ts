import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/espace-membre/",
          "/en/admin/",
          "/en/espace-membre/",
          "/auth/",
          "/connexion",
          "/mot-de-passe-oublie",
          "/reinitialiser-mot-de-passe",
        ],
      },
    ],
    sitemap: "https://israeloriade.com/sitemap.xml",
  };
}
