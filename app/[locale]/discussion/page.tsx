import Link from "next/link";
import TrackView from "@/components/track-view";

const channels = [
  {
    title: "WhatsApp",
    description: "Support rapide et réponses ciblées.",
    href: "https://wa.me/0000000000"
  },
  {
    title: "Telegram",
    description: "Canal de discussion et updates.",
    href: "https://t.me"
  },
  {
    title: "Chat direct",
    description: "Option avancée à brancher ensuite (Tawk, Crisp, Intercom).",
    href: "/espace-membre"
  }
];

export default function DiscussionPage() {
  return (
    <section className="space-y-6">
      <TrackView label="Discussion" />
      <h1 className="text-2xl font-bold text-white">Discussion</h1>
      <p className="text-sm text-slate-300">Choisis ton canal de contact.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.title} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-white">{channel.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{channel.description}</p>
            <Link href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} className="mt-4 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
              Ouvrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
