"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MemberSidebar from "@/components/member/MemberSidebar";

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const COUNT = 70;
    const MAX_DIST = 140;
    const DOT_RADIUS = 1.5;

    type Dot = { x: number; y: number; vx: number; vy: number };
    let dots: Dot[] = [];
    let raf: number;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Move dots
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
      }

      // Draw lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148,189,250,0.6)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 1, opacity: 0.7 }}
    />
  );
}

function AuroraBg() {
  return (
    <>
      <style>{`
        @keyframes aurora-1 {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(8%, -12%) scale(1.15); }
          66%  { transform: translate(-6%, 8%) scale(0.92); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora-2 {
          0%   { transform: translate(0%, 0%) scale(1.1); }
          40%  { transform: translate(-10%, 10%) scale(0.95); }
          70%  { transform: translate(12%, -6%) scale(1.2); }
          100% { transform: translate(0%, 0%) scale(1.1); }
        }
        @keyframes aurora-3 {
          0%   { transform: translate(0%, 0%) scale(0.95); }
          30%  { transform: translate(6%, 14%) scale(1.1); }
          65%  { transform: translate(-8%, -8%) scale(1.0); }
          100% { transform: translate(0%, 0%) scale(0.95); }
        }
        @keyframes aurora-4 {
          0%   { transform: translate(0%, 0%) scale(1.05); }
          50%  { transform: translate(-14%, 6%) scale(0.9); }
          100% { transform: translate(0%, 0%) scale(1.05); }
        }
        @keyframes aurora-mesh {
          0%   { opacity: 0.45; }
          50%  { opacity: 0.65; }
          100% { opacity: 0.45; }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ background: "#03071A" }}>

        {/* Orbe 1 — bleu roi, centre-gauche */}
        <div style={{
          position: "absolute",
          width: "70vw", height: "70vw",
          maxWidth: 700, maxHeight: 700,
          left: "5%", top: "10%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, rgba(26,63,216,0.55) 0%, rgba(59,130,246,0.2) 45%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-1 18s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Orbe 2 — violet, haut-droite */}
        <div style={{
          position: "absolute",
          width: "55vw", height: "55vw",
          maxWidth: 580, maxHeight: 580,
          right: "-5%", top: "-10%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 35%, rgba(139,92,246,0.5) 0%, rgba(167,139,250,0.18) 50%, transparent 70%)",
          filter: "blur(55px)",
          animation: "aurora-2 22s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Orbe 3 — teal / cyan, bas-gauche */}
        <div style={{
          position: "absolute",
          width: "50vw", height: "50vw",
          maxWidth: 520, maxHeight: 520,
          left: "-8%", bottom: "0%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 65%, rgba(20,184,166,0.4) 0%, rgba(6,182,212,0.15) 50%, transparent 70%)",
          filter: "blur(50px)",
          animation: "aurora-3 26s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Orbe 4 — or/ambre, bas-droite */}
        <div style={{
          position: "absolute",
          width: "45vw", height: "45vw",
          maxWidth: 460, maxHeight: 460,
          right: "2%", bottom: "5%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 65% 60%, rgba(245,194,0,0.25) 0%, rgba(249,115,22,0.12) 50%, transparent 70%)",
          filter: "blur(55px)",
          animation: "aurora-4 30s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Mesh overlay — grille de points subtile */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(96,165,250,0.15) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
          animation: "aurora-mesh 8s ease-in-out infinite",
        }} />

        {/* Vignette finale */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 40%, rgba(3,7,26,0.75) 100%)",
        }} />
      </div>
    </>
  );
}

export default function EspaceMembreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const session = localStorage.getItem("gm_member_session");
    if (!session && pathname !== "/connexion") {
      router.push("/connexion");
    } else {
      setReady(true);
      try {
        const notifs = JSON.parse(localStorage.getItem("gm_notifications") || "[]");
        const count = notifs.filter((n: { read: boolean }) => !n.read).length;
        setUnread(count > 0 ? count : 3);
      } catch { setUnread(3); }
    }
  }, [pathname, router]);

  if (!ready) return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#03071A" }}>
      <div className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: "#60A5FA", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#03071A" }}>
      <AuroraBg />
      <ConstellationCanvas />
      <div className="relative z-10 flex w-full h-full">
        <MemberSidebar unreadCount={unread} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
