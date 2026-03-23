"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  { label: "Mon offre",      prompt: "Je veux affiner mon offre. Comment la rendre plus claire et attractive ?" },
  { label: "Mon contenu",    prompt: "Je ne sais pas quoi publier régulièrement. Aide-moi à créer une stratégie de contenu." },
  { label: "Mes ventes",     prompt: "Je n'arrive pas à convertir mes prospects. Qu'est-ce qui cloche dans mon tunnel de vente ?" },
  { label: "Lancer mon biz", prompt: "Je veux lancer mon activité digitale mais je ne sais pas par où commencer." },
  { label: "Mon audience",   prompt: "Comment développer mon audience et ma liste email rapidement ?" },
  { label: "Ma niche",       prompt: "J'ai du mal à me différencier. Comment trouver et valider ma niche ?" },
];

export default function IzzyPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/izzy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text || "Désolé, je n'ai pas pu répondre." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Une erreur est survenue. Réessaie." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl" style={{ height: "calc(100vh - 4rem)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 shrink-0 rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
        <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
          <img src="/images/P2.webp" alt="Izzy" className="h-full w-full object-cover object-top" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white">Izzy</p>
          <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Consultant business IA · Growth Mentor</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#34D399" }} />
          <span className="text-sm font-medium" style={{ color: "#34D399" }}>En ligne</span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(124,58,237,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <p className="text-sm font-semibold text-white mb-1">Bonjour ! Je suis Izzy</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Ton consultant business IA. Pose-moi n&apos;importe quelle question sur ton activité digitale, ta stratégie de contenu, tes ventes ou ton positionnement.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Commence par :</p>
            <div className="grid grid-cols-2 gap-2">
              {STARTERS.map((s) => (
                <button key={s.label} onClick={() => send(s.prompt)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-left transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.12)", color: "rgba(255,255,255,0.7)" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="h-7 w-7 rounded-full shrink-0 overflow-hidden mr-2 mt-0.5">
                <img src="/images/P2.webp" alt="Izzy" className="h-full w-full object-cover object-top" />
            </div>
            )}
            <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: m.role === "user" ? "linear-gradient(135deg,#1A3FD8,#3B82F6)" : "rgba(255,255,255,0.05)",
                color: "white",
                borderBottomRightRadius: m.role === "user" ? 4 : undefined,
                borderBottomLeftRadius: m.role === "assistant" ? 4 : undefined,
                border: m.role === "assistant" ? "1px solid rgba(96,165,250,0.12)" : "none",
              }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="h-7 w-7 rounded-full shrink-0 overflow-hidden mr-2">
              <img src="/images/P2.webp" alt="Izzy" className="h-full w-full object-cover object-top" />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(96,165,250,0.12)" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "#A78BFA", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 mt-4">
        <div className="flex gap-3 rounded-2xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.15)" }}>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Pose ta question à Izzy..."
            className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
            Envoyer
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Izzy peut se tromper — vérifie les informations importantes.
        </p>
      </div>
    </div>
  );
}
