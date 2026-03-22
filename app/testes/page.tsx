import Link from "next/link";
import TrackView from "@/components/track-view";
import { testedTools } from "@/lib/site-data";

export default function TestesPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Outils testés" />
      <h1 className="text-2xl font-bold text-white">Outils testés</h1>
      <p className="text-sm text-slate-300">Sélection d’outils validés pour accélérer l’exécution.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {testedTools.map((tool) => (
          <article key={tool.name} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-white">{tool.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{tool.review}</p>
            <p className="mt-2 text-xs text-emerald-300">Note: {tool.rating}/5</p>
            <Link href={tool.link} target="_blank" className="mt-4 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
              Voir l’outil
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
