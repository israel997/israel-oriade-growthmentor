"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useHandedness, type Handedness } from "@/hooks/useHandedness";

export default function HandednessModal() {
  const { status } = useSession();
  const { handedness, setHandedness } = useHandedness();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Handedness | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (handedness !== null) return;

    const timer = setTimeout(() => setVisible(true), 10_000);
    return () => clearTimeout(timer);
  }, [status, handedness]);

  const handleConfirm = () => {
    if (!selected) return;
    setHandedness(selected);
    setVisible(false);
  };

  if (!visible) return null;

  const userName = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,46,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 space-y-5"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="space-y-1">
          <p className="text-lg font-bold text-white">
            Personnalisons ton expérience 👋
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Pour adapter l&apos;interface à ta façon de naviguer.
          </p>
        </div>

        <p className="text-sm font-semibold text-white">
          Tu es plutôt…
        </p>

        {/* Options */}
        <div className="flex gap-3">
          {(["right", "left"] as Handedness[]).map((val) => {
            const isRight = val === "right";
            const isSelected = selected === val;
            return (
              <button
                key={val}
                onClick={() => setSelected(val)}
                className="flex-1 flex flex-col items-center gap-3 rounded-2xl py-5 transition-all"
                style={{
                  background: isSelected
                    ? "rgba(26,63,216,0.18)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSelected ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {/* Hand icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isSelected ? "#60A5FA" : "rgba(255,255,255,0.4)"}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                  style={{ transform: isRight ? "none" : "scaleX(-1)" }}
                >
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
                <span
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? "#60A5FA" : "rgba(255,255,255,0.6)" }}
                >
                  {isRight ? "Droitier" : "Gaucher"}
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full rounded-2xl py-3 text-sm font-bold text-white transition-all disabled:opacity-40"
          style={{
            background: selected
              ? "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)"
              : "rgba(255,255,255,0.08)",
          }}
        >
          Confirmer mon choix
        </button>

        <button
          onClick={() => setVisible(false)}
          className="w-full text-xs text-center"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Ignorer pour l&apos;instant
        </button>
      </div>
    </div>
  );
}
