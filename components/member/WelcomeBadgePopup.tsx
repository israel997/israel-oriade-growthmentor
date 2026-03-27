"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WELCOME_KEY = "gm_welcome_shown";
const POPUP_DURATION = 7000;

export default function WelcomeBadgePopup() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    try {
      if (localStorage.getItem(WELCOME_KEY)) return;
      localStorage.setItem(WELCOME_KEY, "1");
      setVisible(true);

      // Animate progress bar down to 0 over POPUP_DURATION ms
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / POPUP_DURATION) * 100);
        setProgress(remaining);
        if (remaining === 0) clearInterval(interval);
      }, 50);

      const timer = setTimeout(() => setVisible(false), POPUP_DURATION);
      return () => { clearTimeout(timer); clearInterval(interval); };
    } catch {}
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.94 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-[9999] w-full max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: "#08123A",
            border: "1px solid rgba(148,163,184,0.35)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(148,163,184,0.15)",
          }}
        >
          {/* Content */}
          <div className="flex items-center gap-4 p-5">
            {/* Badge icon */}
            <div className="relative shrink-0">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #475569 0%, #94A3B8 100%)",
                  boxShadow: "0 4px 20px rgba(148,163,184,0.4)",
                }}
              >
                {/* Badge shield icon */}
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </motion.div>
              {/* Sparkle */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                transition={{ delay: 0.6, duration: 0.8, repeat: 2, repeatDelay: 1.5 }}
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center"
                style={{ color: "#F5C200" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>
                Badge débloqué
              </p>
              <p className="text-base font-bold text-white leading-tight">Bienvenue ! 🎉</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                Tu as débloqué le badge <span className="font-semibold" style={{ color: "#94A3B8" }}>Mentee</span>
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white/30 hover:text-white/60 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #475569, #94A3B8)",
                transition: "width 0.05s linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
