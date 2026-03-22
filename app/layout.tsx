import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Israël Oriadé | Mentor Business Digital",
  description: "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-black antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
