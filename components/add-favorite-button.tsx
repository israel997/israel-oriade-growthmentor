"use client";

import { useMemo, useState } from "react";

type Props = {
  id: string;
  title: string;
};

export default function AddFavoriteButton({ id, title }: Props) {
  const [saved, setSaved] = useState(false);

  const key = useMemo(() => `fav:${id}:${title}`, [id, title]);

  const save = () => {
    const existing = localStorage.getItem("gm_favorites");
    const favorites = existing ? (JSON.parse(existing) as string[]) : [];
    if (!favorites.includes(key)) {
      localStorage.setItem("gm_favorites", JSON.stringify([key, ...favorites]));
    }
    setSaved(true);
  };

  return (
    <button
      onClick={save}
      className="rounded-full border border-emerald-300/50 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-400/10"
    >
      {saved ? "Ajouté ✓" : "Ajouter favoris"}
    </button>
  );
}
