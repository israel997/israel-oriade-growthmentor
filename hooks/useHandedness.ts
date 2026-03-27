"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export type Handedness = "right" | "left";

const KEY = "gm_handedness";
const EVENT = "gm_handedness_change";

// useLayoutEffect runs synchronously before paint on client — avoids SSR flash
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useHandedness() {
  const [handedness, setHandednessState] = useState<Handedness | null>(null);

  useIsomorphicLayoutEffect(() => {
    setHandednessState(localStorage.getItem(KEY) as Handedness | null);

    const handler = () => {
      setHandednessState(localStorage.getItem(KEY) as Handedness | null);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const setHandedness = (value: Handedness) => {
    localStorage.setItem(KEY, value);
    setHandednessState(value);
    window.dispatchEvent(new Event(EVENT));
  };

  return { handedness, setHandedness };
}
