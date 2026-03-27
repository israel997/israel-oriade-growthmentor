import Link from "next/link";
import TrackView from "@/components/track-view";
import { blogPosts } from "@/lib/site-data";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "fr" ? "https://israeloriade.com/blog" : `https://israeloriade.com/${locale}/blog`,
    },
  };
}

export default function BlogPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Blog" />
      <h1 className="text-2xl font-bold text-white">Actualité</h1>
      <p className="text-sm text-slate-300">Articles SEO pour attirer du trafic organique.</p>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-xs text-emerald-300">{post.date}</p>
            <h2 className="mt-1 font-semibold text-white">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-emerald-300 hover:text-emerald-200">
              Lire l'article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
