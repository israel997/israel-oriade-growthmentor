"use client";

import { useEffect, useState } from "react";

export type Handedness = "right" | "left";

const KEY = "gm_handedness";

export function useHandedness() {
  const [handedness, setHandednessState] = useState<Handedness | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Handedness | null;
    setHandednessState(stored);
  }, []);

  const setHandedness = (value: Handedness) => {
    localStorage.setItem(KEY, value);
    setHandednessState(value);
  };

  return { handedness, setHandedness };
}
