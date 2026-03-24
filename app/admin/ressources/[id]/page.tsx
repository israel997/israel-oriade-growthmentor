import clientPromise from "@/lib/mongodb";
import RessourceForm from "../_RessourceForm";
import { notFound } from "next/navigation";

export default async function EditRessourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await clientPromise;
  const col = client.db().collection("ressources");
  const ressource = await col.findOne({ id });
  if (!ressource) return notFound();
  const { _id, ...data } = ressource;
  void _id;
  return <RessourceForm title={`Éditer — ${data.title}`} initial={data} />;
}
