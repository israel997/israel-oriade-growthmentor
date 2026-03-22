import Link from "next/link";
import TrackView from "@/components/track-view";
import { contentLinks } from "@/lib/site-data";

export default function ContenusPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Contenus" />
      <h1 className="text-2xl font-bold text-white">Contenus</h1>
      <p className="text-sm text-slate-300">Retrouve tous les contenus par plateforme.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {contentLinks.map((content) => (
          <article key={content.platform} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-white">{content.platform}</h2>
            <p className="mt-2 text-sm text-slate-300">{content.description}</p>
            <Link href={content.url} target="_blank" className="mt-4 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
              Ouvrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
