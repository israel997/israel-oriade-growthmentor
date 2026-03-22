"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG = "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)";

const testimonials = [
  { name: "Sarah M.", role: "Créatrice de contenu", text: "J'ai arrêté de tourner en rond. J'ai un plan clair et mes premières ventes en moins de 3 semaines.", stars: 5 },
  { name: "Yanis B.", role: "Consultant freelance", text: "Le quiz m'a orienté vers la bonne offre dès le départ. Gain de temps énorme, résultats concrets.", stars: 5 },
  { name: "Mireille K.", role: "Coach bien-être", text: "Le suivi est concret, humain et orienté résultats. Ce n'est pas du tout du coaching vague.", stars: 5 },
  { name: "Thomas R.", role: "Développeur indie", text: "La méthode est claire, actionnable. J'ai structuré mon offre et doublé mon taux de conversion.", stars: 5 },
  { name: "Aïda N.", role: "E-commerçante", text: "Enfin une formation qui va à l'essentiel. Pas de blabla, juste ce qui fonctionne vraiment.", stars: 5 },
  { name: "Karim D.", role: "Formateur digital", text: "Le mentorat elite a transformé ma façon d'aborder mon business. ROI en moins d'un mois.", stars: 5 },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="#F5C200">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}>
            Témoignages
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Ils ont fait le saut. Et ça a marché.</h2>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col rounded-[24px] p-6"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.65)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                <Stars count={t.stars} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#333]">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-black" style={{ background: "#F5C200" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{t.name}</p>
                    <p className="text-xs text-[#777]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
