import type { MetadataRoute } from "next";
import { blogPosts, formations } from "@/lib/site-data";

const BASE_URL = "https://israeloriade.com";
const locales = ["fr", "en"] as const;

function url(path: string, locale: string) {
  return locale === "fr" ? `${BASE_URL}${path}` : `${BASE_URL}/en${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/mentor", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/formations", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ressources", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/communaute", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/diagnostic", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contenus", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/testes", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages — both locales
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: url(page.path, locale),
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Blog posts — both locales
  for (const post of blogPosts) {
    for (const locale of locales) {
      entries.push({
        url: url(`/blog/${post.slug}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Formations — both locales
  for (const formation of formations) {
    for (const locale of locales) {
      entries.push({
        url: url(`/formations/${formation.slug}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
