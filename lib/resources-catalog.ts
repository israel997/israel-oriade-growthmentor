export type ResourceCategory =
  | "offre"
  | "contenu"
  | "vente"
  | "audience"
  | "positionnement"
  | "analyse"
  | "mindset"
  | "digital";

export type Resource = {
  id: string;
  label: string;
  description: string;
  categories: ResourceCategory[];
  lien: string; // URL interne /ressources/[slug] ou externe
  externe: boolean;
  active: boolean;
};

export const RESOURCES_CATALOG: Resource[] = [
  {
    id: "guide-niche-rentable",
    label: "Guide : Trouver sa niche rentable",
    description: "Les 5 critères pour valider qu'une niche est exploitable avant de s'y lancer.",
    categories: ["positionnement", "offre"],
    lien: "/ressources/guide-niche-rentable",
    externe: false,
    active: true,
  },
  {
    id: "template-offre",
    label: "Template : Construire son offre en 1 page",
    description: "Un canvas simple pour définir ta cible, ton résultat, ton prix et ta promesse.",
    categories: ["offre"],
    lien: "/ressources/template-offre",
    externe: false,
    active: true,
  },
  {
    id: "calendrier-editorial",
    label: "Template : Calendrier éditorial 30 jours",
    description: "Un planning clé en main pour publier du contenu régulier sans se creuser la tête.",
    categories: ["contenu"],
    lien: "/ressources/calendrier-editorial",
    externe: false,
    active: true,
  },
  {
    id: "script-appel-vente",
    label: "Script : Appel de vente en 7 étapes",
    description: "Le déroulé exact d'un appel découverte qui convertit, du bonjour au closing.",
    categories: ["vente"],
    lien: "/ressources/script-appel-vente",
    externe: false,
    active: true,
  },
  {
    id: "checklist-tunnel",
    label: "Checklist : Tunnel de vente minimal viable",
    description: "Les 8 éléments indispensables pour avoir un tunnel qui vend sans être un expert tech.",
    categories: ["vente", "digital"],
    lien: "/ressources/checklist-tunnel",
    externe: false,
    active: true,
  },
  {
    id: "guide-temoignages",
    label: "Guide : Collecter des témoignages qui vendent",
    description: "Comment demander, structurer et utiliser les avis clients pour convaincre plus facilement.",
    categories: ["vente", "audience"],
    lien: "/ressources/guide-temoignages",
    externe: false,
    active: true,
  },
  {
    id: "tableau-bord-kpi",
    label: "Template : Tableau de bord KPI business",
    description: "Suivi hebdomadaire de tes indicateurs clés — CA, leads, conversion, panier moyen.",
    categories: ["analyse"],
    lien: "/ressources/tableau-bord-kpi",
    externe: false,
    active: true,
  },
  {
    id: "guide-lead-magnet",
    label: "Guide : Créer un lead magnet irrésistible",
    description: "Les types de lead magnets qui convertissent le mieux et comment les créer en 1 journée.",
    categories: ["audience", "digital"],
    lien: "/ressources/guide-lead-magnet",
    externe: false,
    active: true,
  },
  {
    id: "guide-positionnement",
    label: "Guide : Affiner son positionnement en 3 questions",
    description: "Une méthode simple pour se différencier clairement de la concurrence et attirer les bons clients.",
    categories: ["positionnement"],
    lien: "/ressources/guide-positionnement",
    externe: false,
    active: true,
  },
  {
    id: "guide-prospection",
    label: "Guide : Prospection directe pour les débutants",
    description: "Comment contacter des prospects froid sans être rejeté — messages, plateformes, suivi.",
    categories: ["vente", "audience"],
    lien: "/ressources/guide-prospection",
    externe: false,
    active: true,
  },
  {
    id: "guide-email-bienvenue",
    label: "Template : Séquence email de bienvenue (3 emails)",
    description: "Les 3 premiers emails à envoyer à un nouvel abonné pour créer la relation et vendre naturellement.",
    categories: ["audience", "digital"],
    lien: "/ressources/guide-email-bienvenue",
    externe: false,
    active: true,
  },
  {
    id: "guide-prix",
    label: "Guide : Fixer le bon prix pour son offre",
    description: "Comment calculer son prix, éviter de se sous-évaluer et justifier sa valeur avec confiance.",
    categories: ["offre", "vente"],
    lien: "/ressources/guide-prix",
    externe: false,
    active: true,
  },
  {
    id: "routine-entrepreneur",
    label: "Guide : La routine de l'entrepreneur digital",
    description: "Les habitudes quotidiennes pour avancer sur son business sans sacrifier sa santé mentale.",
    categories: ["mindset"],
    lien: "/ressources/routine-entrepreneur",
    externe: false,
    active: true,
  },
];

export function getResourceById(id: string): Resource | undefined {
  return RESOURCES_CATALOG.find((r) => r.id === id);
}

export function getResourcesByIds(ids: string[]): Resource[] {
  return ids
    .map(getResourceById)
    .filter((r): r is Resource => !!r && r.active);
}
