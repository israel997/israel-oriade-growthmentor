import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TrackView from "@/components/track-view";
import { blogPosts } from "@/lib/site-data";
import { ArticleJsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};

  const canonicalBase = locale === "fr" ? "https://israeloriade.com" : `https://israeloriade.com/${locale}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${canonicalBase}/blog/${slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${canonicalBase}/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFound();

  return (
    <section className="space-y-6">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
      />
      <TrackView label={`Article: ${post.title}`} />
      <Link href="/blog" className="text-xs text-emerald-300 hover:text-emerald-200">
        ← Retour aux articles
      </Link>
      <article className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs text-emerald-300">{post.date}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">{post.title}</h1>
        <p className="mt-4 leading-relaxed text-slate-200">{post.body}</p>
      </article>
    </section>
  );
}
