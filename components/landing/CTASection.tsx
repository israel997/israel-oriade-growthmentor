"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const BG = "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] px-8 py-16 text-center sm:px-16"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Halo or */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 70%)" }}
          />

          <div className="relative">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}>
              Évalue ton niveau
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#111] sm:text-4xl lg:text-5xl">
              Où en es-tu vraiment ?<br />
              <span style={{ background: "linear-gradient(90deg, #F5C200 0%, #F5C200 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                2 minutes pour le savoir.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base text-[#555]">
              Mon quiz intelligent analyse ton profil et te recommande le parcours exact adapté à ton niveau et tes objectifs.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/quiz"
                className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "#F5C200" }}
              >
                Faire le quiz maintenant
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/espace-membre"
                className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-8 py-4 text-sm font-semibold text-[#111] transition-all hover:bg-black/5"
              >
                Rejoindre l'espace membre
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#777]">Gratuit · 3 minutes · Résultat immédiat</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
