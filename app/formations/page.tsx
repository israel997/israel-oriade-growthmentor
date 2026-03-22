import Link from "next/link";
import AddFavoriteButton from "@/components/add-favorite-button";
import TrackView from "@/components/track-view";
import { formations } from "@/lib/site-data";

export default function FormationsPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Formations" />
      <h1 className="text-2xl font-bold text-white">Formations</h1>
      <p className="text-sm text-slate-300">Choisis ton parcours selon ton niveau.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {formations.map((formation) => (
          <article key={formation.slug} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-xs text-emerald-300">{formation.level}</p>
            <h2 className="mt-1 font-semibold text-white">{formation.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{formation.objective}</p>
            <p className="mt-3 text-sm font-semibold text-white">{formation.price}</p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <Link href={`/formations/${formation.slug}`} className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
                Voir détail
              </Link>
              <AddFavoriteButton id={formation.slug} title={formation.title} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
