import RessourceForm from "../_RessourceForm";
export default async function EditRessourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RessourceForm title={`Éditer — ${id}`} initial={{ title: id }} />;
}
