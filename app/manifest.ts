import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Israël Oriadé — GrowthMentor",
    short_name: "GrowthMentor",
    description: "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
    start_url: "/",
    display: "standalone",
    background_color: "#060B2E",
    theme_color: "#060B2E",
    orientation: "portrait",
    categories: ["education", "business"],
    lang: "fr",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
