"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "section-carousel", label: "A la UNE" },
  { id: "section-results", label: "Mes Résultats" },
  { id: "section-story", label: "Certifications" },
  { id: "section-benefits", label: "Ce dont tu profites" },
  { id: "section-features", label: "Mes Offres" },
  { id: "section-testimonials", label: "Témoignages" },
  { id: "section-cta", label: "Évaluer mon niveau" },
];

export default function SectionSidebar() {
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Section active au scroll
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => sectionObserver.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed right-0 top-1/2 z-50 flex flex-col items-end"
      style={{ transform: "translate(0, -50%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex flex-col gap-1 py-3 px-2 rounded-l-2xl"
        style={{
          background: "rgba(6,11,46,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRight: "none",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.3)",
          width: hovered ? "180px" : "40px",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-all w-full"
            style={{ minWidth: "164px" }}
          >
            <span
              className="shrink-0 rounded-full transition-all duration-300"
              style={{
                width: active === id ? "10px" : "6px",
                height: active === id ? "10px" : "6px",
                background: active === id ? "#F5C200" : "rgba(255,255,255,0.35)",
                boxShadow: active === id ? "0 0 8px rgba(245,194,0,0.6)" : "none",
              }}
            />
            <span
              className="text-xs font-medium whitespace-nowrap transition-all duration-300"
              style={{
                color: active === id ? "#F5C200" : "rgba(255,255,255,0.6)",
                opacity: hovered ? 1 : 0,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
