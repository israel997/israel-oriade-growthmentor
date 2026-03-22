export type Level = "Débutant" | "Intermédiaire" | "Avancé";

export function resolveLevel(score: number): Level {
  if (score <= 2) return "Débutant";
  if (score <= 4) return "Intermédiaire";
  return "Avancé";
}

export function levelRecommendations(level: Level) {
  if (level === "Débutant") {
    return {
      formation: "Lancement Digital 30J",
      ebook: "Trouver ton positionnement rentable",
      accompagnement: "Session orientation 1:1"
    };
  }
  if (level === "Intermédiaire") {
    return {
      formation: "Croissance Système",
      ebook: "Tunnel intelligent en 7 étapes",
      accompagnement: "Audit acquisition + conversion"
    };
  }
  return {
    formation: "Mentorat Elite",
    ebook: "Tunnel intelligent en 7 étapes",
    accompagnement: "Accompagnement stratégique premium"
  };
}
