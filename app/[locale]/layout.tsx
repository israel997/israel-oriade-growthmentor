import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AppShell from "@/components/app-shell";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://israeloriade.com"),
  title: {
    default: "Israël Oriadé | Mentor Business Digital",
    template: "%s | Israël Oriadé",
  },
  description:
    "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
  openGraph: {
    type: "website",
    url: "https://israeloriade.com",
    siteName: "Israël Oriadé — GrowthMentor",
    title: "Israël Oriadé | Mentor Business Digital",
    description:
      "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Israël Oriadé — Mentor Business Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Israël Oriadé | Mentor Business Digital",
    description:
      "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://israeloriade.com",
    languages: {
      fr: "https://israeloriade.com",
      en: "https://israeloriade.com/en",
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-white text-black antialiased">
        <PersonJsonLd />
        <WebSiteJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <AppShell>{children}</AppShell>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  border: "1px solid rgba(96,165,250,0.2)",
                  color: "#fff",
                },
              }}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
