import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import DiagnosticPageClient from "@/components/DiagnosticPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.diagnostic" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "fr" ? "https://israeloriade.com/diagnostic" : `https://israeloriade.com/${locale}/diagnostic`,
    },
  };
}

export default function DiagnosticPage() {
  return <DiagnosticPageClient />;
}
