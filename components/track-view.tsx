"use client";

import { useEffect } from "react";

type Props = {
  label: string;
};

export default function TrackView({ label }: Props) {
  useEffect(() => {
    const existing = localStorage.getItem("gm_history");
    const history = existing ? (JSON.parse(existing) as Array<{ label: string; date: string }>) : [];
    const next = [{ label, date: new Date().toISOString() }, ...history].slice(0, 20);
    localStorage.setItem("gm_history", JSON.stringify(next));
  }, [label]);

  return null;
}
