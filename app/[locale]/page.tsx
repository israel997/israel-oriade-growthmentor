import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import HomeClient from "@/components/home-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "fr" ? "https://israeloriade.com" : `https://israeloriade.com/${locale}`,
      languages: {
        fr: "https://israeloriade.com",
        en: "https://israeloriade.com/en",
      },
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
