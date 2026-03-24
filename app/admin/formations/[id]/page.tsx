import clientPromise from "@/lib/mongodb";
import FormationForm from "../_FormationForm";
import { notFound } from "next/navigation";

export default async function EditFormationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await clientPromise;
  const col = client.db().collection("formations");
  const formation = await col.findOne({ id });
  if (!formation) return notFound();
  const { _id, ...data } = formation;
  void _id;
  return <FormationForm title={`Éditer — ${data.title}`} initial={data} />;
}
