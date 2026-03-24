import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

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
    <html lang="fr" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-white text-black antialiased">
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
      </body>
    </html>
  );
}
