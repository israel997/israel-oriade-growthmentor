export type FormationLevel = "apprenti" | "intermediaire" | "avance";
export type FormationCategory =
  | "offre"
  | "contenu"
  | "vente"
  | "audience"
  | "positionnement"
  | "analyse"
  | "mindset"
  | "digital";

export type Formation = {
  id: string;
  label: string;
  description: string;
  niveau: FormationLevel;
  categories: FormationCategory[];
  prix: string; // ex: "Gratuit", "1500F", "2000F"
  lien: string; // URL interne /formations/[slug] ou externe
  externe: boolean;
  active: boolean;
};

export const FORMATIONS_CATALOG: Formation[] = [
  // ── APPRENTI ───────────────────────────────────────────────────────────────
  {
    id: "lancer-activite-digitale",
    label: "Lancer son activité digitale de zéro",
    description: "Les bases pour créer ton offre, trouver ta niche et attirer tes premiers clients sans audience.",
    niveau: "apprenti",
    categories: ["offre", "positionnement", "mindset"],
    prix: "Gratuit",
    lien: "/formations/lancer-activite-digitale",
    externe: false,
    active: true,
  },
  {
    id: "trouver-niche",
    label: "Trouver ta niche en 7 jours",
    description: "Méthode étape par étape pour identifier une niche rentable et un positionnement différenciant.",
    niveau: "apprenti",
    categories: ["positionnement", "offre"],
    prix: "Gratuit",
    lien: "/formations/trouver-niche",
    externe: false,
    active: true,
  },
  {
    id: "creer-contenu-zero",
    label: "Créer du contenu quand on part de zéro",
    description: "Comment produire du contenu régulier sans inspiration ni expérience — formats, rythme, outils gratuits.",
    niveau: "apprenti",
    categories: ["contenu"],
    prix: "Gratuit",
    lien: "/formations/creer-contenu-zero",
    externe: false,
    active: true,
  },
  {
    id: "premiere-offre",
    label: "Créer ta première offre payante",
    description: "Construire une offre simple, la fixer au bon prix et la vendre à ses premiers clients.",
    niveau: "apprenti",
    categories: ["offre", "vente"],
    prix: "1500F",
    lien: "/formations/premiere-offre",
    externe: false,
    active: true,
  },
  {
    id: "mindset-entrepreneur",
    label: "Développer son mindset entrepreneurial",
    description: "Les croyances et habitudes qui séparent ceux qui avancent de ceux qui procrastinent.",
    niveau: "apprenti",
    categories: ["mindset"],
    prix: "Gratuit",
    lien: "/formations/mindset-entrepreneur",
    externe: false,
    active: true,
  },
  {
    id: "instagram-debutant",
    label: "Instagram pour débutants — Compte pro de 0 à 1000 abonnés",
    description: "Créer un profil optimisé, publier du contenu engageant et attirer ses premiers abonnés qualifiés.",
    niveau: "apprenti",
    categories: ["contenu", "audience"],
    prix: "Gratuit",
    lien: "/formations/instagram-debutant",
    externe: false,
    active: true,
  },
  {
    id: "premiers-clients-sans-audience",
    label: "Trouver ses 3 premiers clients sans audience",
    description: "Techniques de prospection directe pour obtenir des clients même avec 0 follower.",
    niveau: "apprenti",
    categories: ["vente", "audience"],
    prix: "1500F",
    lien: "/formations/premiers-clients-sans-audience",
    externe: false,
    active: true,
  },

  // ── INTERMÉDIAIRE ──────────────────────────────────────────────────────────
  {
    id: "strategie-contenu",
    label: "Stratégie de contenu 90 jours",
    description: "Planifier, créer et distribuer du contenu sur 3 mois pour construire une audience engagée.",
    niveau: "intermediaire",
    categories: ["contenu", "audience"],
    prix: "2000F",
    lien: "/formations/strategie-contenu",
    externe: false,
    active: true,
  },
  {
    id: "tunnel-vente-simple",
    label: "Créer un tunnel de vente simple qui convertit",
    description: "Page de capture + séquence email + page de vente : le minimum viable pour vendre en automatique.",
    niveau: "intermediaire",
    categories: ["vente", "digital"],
    prix: "2000F",
    lien: "/formations/tunnel-vente-simple",
    externe: false,
    active: true,
  },
  {
    id: "appels-vente",
    label: "Maîtriser l'appel de vente — Du découverte au closing",
    description: "Script complet, gestion des objections et techniques de closing pour convertir en appel.",
    niveau: "intermediaire",
    categories: ["vente"],
    prix: "1500F",
    lien: "/formations/appels-vente",
    externe: false,
    active: true,
  },
  {
    id: "email-marketing",
    label: "Email marketing — Construire et monétiser sa liste",
    description: "Lead magnet, séquences automatisées et newsletters qui vendent sans être agressif.",
    niveau: "intermediaire",
    categories: ["audience", "digital"],
    prix: "2000F",
    lien: "/formations/email-marketing",
    externe: false,
    active: true,
  },
  {
    id: "personal-branding",
    label: "Personal branding — Devenir la référence dans ta niche",
    description: "Positionner son expertise, sa différence et son histoire pour attirer naturellement des clients.",
    niveau: "intermediaire",
    categories: ["positionnement", "contenu"],
    prix: "2000F",
    lien: "/formations/personal-branding",
    externe: false,
    active: true,
  },
  {
    id: "analyser-chiffres",
    label: "Analyser ses chiffres business sans être comptable",
    description: "Les KPIs essentiels à suivre, comment les lire et les décisions à prendre selon les résultats.",
    niveau: "intermediaire",
    categories: ["analyse"],
    prix: "Gratuit",
    lien: "/formations/analyser-chiffres",
    externe: false,
    active: true,
  },
  {
    id: "offre-premium",
    label: "Créer une offre premium et justifier son prix",
    description: "Comment passer de l'offre basique à l'offre haut de gamme et vendre sans complexe.",
    niveau: "intermediaire",
    categories: ["offre", "vente"],
    prix: "2000F",
    lien: "/formations/offre-premium",
    externe: false,
    active: true,
  },

  // ── AVANCÉ ─────────────────────────────────────────────────────────────────
  {
    id: "scale-contenu",
    label: "Scaler son contenu — Déléguer et automatiser",
    description: "Créer des systèmes pour produire plus de contenu sans y passer plus de temps.",
    niveau: "avance",
    categories: ["contenu", "digital"],
    prix: "2000F",
    lien: "/formations/scale-contenu",
    externe: false,
    active: true,
  },
  {
    id: "vente-automatisee",
    label: "Vente automatisée — Webinaire evergreen et VSL",
    description: "Mettre en place un système qui vend pendant que tu dors : webinaire automatique ou vidéo de vente.",
    niveau: "avance",
    categories: ["vente", "digital"],
    prix: "2000F",
    lien: "/formations/vente-automatisee",
    externe: false,
    active: true,
  },
  {
    id: "publicite-payante",
    label: "Publicité payante — Meta Ads et Google Ads",
    description: "Créer des campagnes rentables pour scaler son acquisition client au-delà de l'organique.",
    niveau: "avance",
    categories: ["audience", "digital"],
    prix: "2000F",
    lien: "/formations/publicite-payante",
    externe: false,
    active: true,
  },
];

export function getFormationById(id: string): Formation | undefined {
  return FORMATIONS_CATALOG.find((f) => f.id === id);
}

export function getFormationsByIds(ids: string[]): Formation[] {
  return ids
    .map(getFormationById)
    .filter((f): f is Formation => !!f && f.active);
}
