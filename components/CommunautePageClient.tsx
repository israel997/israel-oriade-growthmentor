"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Hex Grid bg ─────────────────────────────────────────────────────────────
function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let lastTs = 0;
    const FRAME_MS = 1000 / 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastTs = 0;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const hexagons = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseR: 24 + Math.random() * 90,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      deformSpeed: 0.8 + Math.random() * 0.7,
      baseAlpha: 0.04 + Math.random() * 0.09,
      color: ["96,165,250", "99,102,241", "59,130,246", "139,92,246"][
        Math.floor(Math.random() * 4)
      ],
    }));

    const drawHex = (
      x: number, y: number, baseR: number,
      phase: number, t: number,
      deformSpeed: number, alpha: number, color: string
    ) => {
      ctx.beginPath();
      for (let v = 0; v < 6; v++) {
        const angle = (Math.PI / 3) * v - Math.PI / 6;
        const deform = 1 + 0.18 * Math.sin(t * deformSpeed + phase + v * 1.05);
        const r = baseR * deform;
        const vx = x + r * Math.cos(angle);
        const vy = y + r * Math.sin(angle);
        v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = (t: number) => {
      ctx.fillStyle = "#03071A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const h of hexagons) {
        const alpha = h.baseAlpha * (0.45 + 0.55 * Math.sin(t * h.speed + h.phase));
        drawHex(h.x, h.y, h.baseR, h.phase, t, h.deformSpeed, alpha, h.color);
      }
    };

    const loop = (ts: number) => {
      rafId = requestAnimationFrame(loop);
      if (ts - lastTs < FRAME_MS) return;
      lastTs = ts;
      draw(ts / 1000);
    };
    rafId = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastTs = 0;
        rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}

// ── Fade-in helper ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const networks = [
  {
    name: "Facebook",
    stat: "+13 000",
    label: "Followers",
    href: "https://www.facebook.com/profile.php?id=100005386759461",
    action: "Suivre",
    color: "#1877F2",
    icon: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    stat: "+1 000",
    label: "Followers",
    href: "https://www.linkedin.com/in/isra%C3%ABl-oriad%C3%A9/",
    action: "Suivre",
    color: "#0A66C2",
    icon: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    stat: "+500",
    label: "Membres",
    href: "https://t.me/israel_oriade_growth_mentor",
    action: "Rejoindre",
    color: "#26A5E4",
    icon: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    stat: "+100",
    label: "Membres",
    href: "https://chat.whatsapp.com/EjDItII1qJ1EPbP31S25sU",
    action: "Rejoindre",
    color: "#25D366",
    icon: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
];

const benefits = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-4.5-4.5-4.5 4.5-4.5-4.5-4.5 4.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
      </svg>
    ),
    title: "Réductions exclusives",
    desc: "En tant que membre, tu bénéficies de réductions sur toutes mes formations et programmes d'accompagnement.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Masterclasses gratuites",
    desc: "Accès aux masterclasses live et replays sur le business digital, le marketing et la monétisation en ligne.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
    title: "Accompagnement poussé",
    desc: "Conseils personnalisés, retours directs sur tes projets et accès prioritaire à mes sessions de questions/réponses.",
  },
];

const testimonials = [
  {
    name: "Kofi A.",
    role: "Membre Telegram",
    text: "Grâce à la communauté, j'ai pu lancer mon premier produit digital en moins d'un mois. Les masterclasses gratuites m'ont donné une longueur d'avance.",
    avatar: "K",
  },
  {
    name: "Aminata D.",
    role: "Membre WhatsApp",
    text: "Israel répond toujours aux questions. J'ai eu une réduction sur la formation Croissance Système et j'ai doublé mes revenus en 3 mois.",
    avatar: "A",
  },
  {
    name: "Séraphin M.",
    role: "Membre Facebook",
    text: "La qualité du contenu partagé dans la communauté est exceptionnelle. Des stratégies concrètes, pas du blabla théorique.",
    avatar: "S",
  },
];

// ── Network Card ────────────────────────────────────────────────────────────
function NetworkCard({ n, i }: { n: typeof networks[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={i * 0.08}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl p-7 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${hovered ? n.color + "70" : "rgba(255,255,255,0.08)"}`,
          backdropFilter: "blur(16px)",
          boxShadow: hovered
            ? `0 0 32px ${n.color}35, 0 8px 40px ${n.color}18`
            : "none",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Radial glow overlay en haut de la card */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${n.color}28 0%, transparent 70%)`,
          }}
        />

        <span style={{ color: n.color }}>{n.icon}</span>
        <div>
          <p className="text-3xl font-bold text-white">{n.stat}</p>
          <p className="text-xs text-white/40 mt-0.5">{n.label}</p>
          <p className="text-sm font-semibold text-white/70 mt-1">{n.name}</p>
        </div>
        <Link
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: n.color }}
        >
          {n.action}
        </Link>
      </motion.div>
    </FadeIn>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CommunautePage() {
  return (
    <div className="min-h-screen" style={{ background: "#03071A" }}>

      <HexGrid />

      {/* ── HERO ── */}
      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <FadeIn>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Communauté
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Une communauté qui <span style={{ color: "#F5C200" }}>avance ensemble</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-white/50">
            Rejoins des centaines d'entrepreneurs digitaux francophones qui construisent leur business, partagent leurs victoires et s'entraident au quotidien. Présent sur Telegram, WhatsApp, Facebook et LinkedIn.
          </p>
        </FadeIn>

        {/* Total membres */}
        <FadeIn delay={0.15}>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full px-6 py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
            <span className="text-sm font-medium text-white/70">
              <span className="font-bold text-white">+14 600</span> membres actifs sur tous les réseaux
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ── RÉSEAUX ── */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <FadeIn>
          <h2 className="text-2xl font-bold text-white mb-10 text-center">Rejoins-moi sur mes réseaux</h2>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {networks.map((n, i) => (
            <NetworkCard key={n.name} n={n} i={i} />
          ))}
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="relative py-24" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(245,194,0,0.12)", color: "#F5C200" }}>
              Avantages membres
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Ce que tu gagnes en rejoignant</h2>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-7 h-full"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(245,194,0,0.12)", color: "#F5C200" }}>
                    {b.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="relative py-24 mx-auto max-w-5xl px-6">
        <FadeIn>
          <h2 className="text-3xl font-bold text-white sm:text-4xl text-center mb-12">Ce que disent les membres</h2>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div
                className="flex flex-col gap-4 rounded-2xl p-6 h-full"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <svg key={k} className="h-4 w-4" fill="#F5C200" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/70 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/6">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black" style={{ background: "#F5C200" }}>
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="relative py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
              Contact direct
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Tu as une question ?</h2>
            <p className="mt-4 text-white/50">
              Je réponds personnellement à chaque message. Clique ci-dessous pour m'écrire directement sur WhatsApp.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="mt-10 inline-block"
            >
              <Link
                href="https://kloo.me/whatsapp-israel-oriade"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold border border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white transition-all duration-200 hover:scale-[1.02]"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22C55E" }} />
                  <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: "#22C55E" }} />
                </span>
                Je suis actuellement {/*  */}en ligne
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
