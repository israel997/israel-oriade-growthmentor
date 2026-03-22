import AddFavoriteButton from "@/components/add-favorite-button";
import TrackView from "@/components/track-view";
import { ebooks } from "@/lib/site-data";

export default function RessourcesPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Ressources" />
      <h1 className="text-2xl font-bold text-white">Ressources & Ebooks</h1>
      <p className="text-sm text-slate-300">Ressources rapides pour progresser immédiatement.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {ebooks.map((ebook) => (
          <article key={ebook.id} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-white">{ebook.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{ebook.preview}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-emerald-300">{ebook.type}{ebook.price ? ` • ${ebook.price}` : ""}</p>
              <AddFavoriteButton id={ebook.id} title={ebook.title} />
            </div>
            <button className="mt-4 rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-slate-950">
              {ebook.type === "Payant" ? "Acheter" : "Télécharger"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
