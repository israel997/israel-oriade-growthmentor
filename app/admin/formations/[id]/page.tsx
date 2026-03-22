import { formationCards } from "@/lib/site-data";
import FormationForm from "../_FormationForm";
import { notFound } from "next/navigation";

export default async function EditFormationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formation = formationCards.find((f) => f.id === id);
  if (!formation) return notFound();
  return <FormationForm title={`Éditer — ${formation.title}`} initial={formation} />;
}
