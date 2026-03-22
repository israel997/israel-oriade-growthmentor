import Link from "next/link";
import { notFound } from "next/navigation";
import TrackView from "@/components/track-view";
import { formations } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function FormationDetailPage({ params }: Props) {
  const { slug } = await params;
  const formation = formations.find((item) => item.slug === slug);
  if (!formation) return notFound();

  return (
    <section className="space-y-6">
      <TrackView label={`Formation: ${formation.title}`} />
      <Link href="/formations" className="text-xs text-emerald-300 hover:text-emerald-200">
        ← Retour aux formations
      </Link>
      <article className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs text-emerald-300">{formation.level}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">{formation.title}</h1>
        <p className="mt-3 text-slate-300">{formation.objective}</p>

        <h2 className="mt-6 font-semibold text-white">Contenu</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
          {formation.content.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-6 font-semibold text-white">Résultats</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
          {formation.results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3">
          <p className="text-lg font-semibold text-white">{formation.price}</p>
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Acheter / Accéder</button>
        </div>
      </article>
    </section>
  );
}
