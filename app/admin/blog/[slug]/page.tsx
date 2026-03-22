import { blogPosts } from "@/lib/site-data";
import BlogForm from "../_BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();
  return <BlogForm title={`Éditer — ${post.title}`} initial={post} />;
}
