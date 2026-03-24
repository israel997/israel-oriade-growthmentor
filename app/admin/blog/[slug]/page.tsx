import clientPromise from "@/lib/mongodb";
import BlogForm from "../_BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await clientPromise;
  const col = client.db().collection("blog");
  const post = await col.findOne({ slug });
  if (!post) return notFound();
  const { _id, ...data } = post;
  void _id;
  return <BlogForm title={`Éditer — ${data.title}`} initial={data} />;
}
