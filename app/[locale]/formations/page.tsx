import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import FormationsPageClient from "@/components/FormationsPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.formations" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "fr" ? "https://israeloriade.com/formations" : `https://israeloriade.com/${locale}/formations`,
    },
  };
}

export default function FormationsPage() {
  return <FormationsPageClient />;
}
