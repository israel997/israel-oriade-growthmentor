"use client";

import { useEffect, useRef } from "react";

// Reduced grid — 22×14 = 308 dots (vs 504 before)
const COLS = 22;
const ROWS = 14;
const GAP = 46;
const BG = "#03071A";

export default function WaveGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // alpha: false → browser skips transparency compositing, ~20% faster
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let lastTs = 0;
    const FRAME_MS = 1000 / 30; // cap at 30 fps

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastTs = 0; // force immediate redraw after resize
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = (t: number) => {
      // Paint solid bg instead of clearRect (faster with alpha:false)
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const offsetX = (canvas.width - (COLS - 1) * GAP) / 2;
      const offsetY = (canvas.height - (ROWS - 1) * GAP) / 2;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const wave = Math.sin(col * 0.5 + row * 0.4 + t * 0.9) * 0.5 + 0.5;
          const alpha = 0.06 + wave * 0.22;
          const radius = 1.2 + wave * 1.4;
          ctx.beginPath();
          ctx.arc(offsetX + col * GAP, offsetY + row * GAP, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96,165,250,${alpha.toFixed(2)})`;
          ctx.fill();
        }
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
