import clientPromise from "@/lib/mongodb";
import OutilForm from "../_OutilForm";
import { notFound } from "next/navigation";

export default async function EditOutilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await clientPromise;
  const col = client.db().collection("outils");
  const tool = await col.findOne({ slug });
  if (!tool) return notFound();
  const { _id, ...data } = tool;
  void _id;
  return <OutilForm title={`Éditer — ${data.name}`} initial={data} />;
}
