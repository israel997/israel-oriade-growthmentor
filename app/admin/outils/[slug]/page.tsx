import { tools } from "@/lib/tools-data";
import OutilForm from "../_OutilForm";
import { notFound } from "next/navigation";

export default async function EditOutilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return notFound();
  return <OutilForm title={`Éditer — ${tool.name}`} initial={tool} />;
}
