import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import CommunautePageClient from "@/components/CommunautePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.communaute" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "fr" ? "https://israeloriade.com/communaute" : `https://israeloriade.com/${locale}/communaute`,
    },
  };
}

export default function CommunautePage() {
  return <CommunautePageClient />;
}
