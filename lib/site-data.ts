export type Formation = {
  slug: string;
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  objective: string;
  content: string[];
  results: string[];
  price: string;
};

export type Ebook = {
  id: string;
  title: string;
  preview: string;
  type: "Téléchargement" | "Payant";
  price?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string;
};

export const socialProof = [
  "+180 membres accompagnés sur 12 mois",
  "87% déclarent des résultats en moins de 8 semaines",
  "Capture: tunnel optimisé x2.4 de conversion",
  "Capture: premier revenu en 14 jours"
];

export const testimonials = [
  {
    name: "Sarah",
    text: "J'ai arrêté de tourner en rond. J'ai un plan clair et mes premières ventes."
  },
  {
    name: "Yanis",
    text: "Le quiz m'a orienté vers la bonne offre. Gain de temps énorme."
  },
  {
    name: "Mireille",
    text: "Le suivi est concret, humain, et orienté résultats."
  }
];

export const formations: Formation[] = [
  {
    slug: "lancement-digital-30j",
    title: "Lancement Digital 30J",
    level: "Débutant",
    objective: "Créer ton premier actif digital et vendre rapidement.",
    content: ["Positionnement", "Offre simple", "Tunnel de vente", "Acquisition organique"],
    results: ["Première offre publiée", "Tunnel prêt", "Premiers prospects"],
    price: "79€"
  },
  {
    slug: "croissance-systeme",
    title: "Croissance Système",
    level: "Intermédiaire",
    objective: "Structurer un système d'acquisition et de conversion stable.",
    content: ["KPI", "Email automation", "Pages de conversion", "Offres ascendantes"],
    results: ["Process reproductible", "Suivi des indicateurs", "Meilleure marge"],
    price: "149€"
  },
  {
    slug: "mentorat-elite",
    title: "Mentorat Elite",
    level: "Avancé",
    objective: "Scaler une activité digitale avec accompagnement stratégique.",
    content: ["Audit business", "Roadmap 90 jours", "Optimisation acquisition", "Pilotage"],
    results: ["Décisions data-driven", "Accélération du CA", "Gain de clarté"],
    price: "390€"
  }
];

export const ebooks: Ebook[] = [
  {
    id: "ebook-positionnement",
    title: "Trouver ton positionnement rentable",
    preview: "Méthode simple pour sortir du flou et clarifier ton message.",
    type: "Téléchargement"
  },
  {
    id: "ebook-tunnel",
    title: "Tunnel intelligent en 7 étapes",
    preview: "Checklist de conversion avec pages et séquences prêtes.",
    type: "Payant",
    price: "19€"
  }
];

export const blogPosts: BlogPost[] = [
  {
    slug: "eviter-les-3-erreurs-debutant",
    title: "Éviter les 3 erreurs qui bloquent les débutants",
    excerpt: "Les pièges fréquents qui font perdre 6 mois aux nouveaux créateurs.",
    date: "2026-03-20",
    body: "Si tu débutes, l'erreur #1 est de vouloir tout faire en même temps. L'erreur #2 est d'ignorer la validation d'offre. L'erreur #3 est de ne pas mesurer tes actions."
  },
  {
    slug: "comment-creer-une-offre-qui-convertit",
    title: "Comment créer une offre qui convertit sans audience massive",
    excerpt: "Une méthode pragmatique basée sur le problème urgent du client.",
    date: "2026-03-21",
    body: "Une bonne offre est spécifique, orientée résultat et simple à comprendre. Concentre-toi sur un problème unique et une promesse mesurable."
  }
];

export const testedTools = [
  {
    name: "Notion",
    review: "Excellent pour centraliser processus, contenu et suivi clients.",
    rating: 4.7,
    link: "https://www.notion.so"
  },
  {
    name: "ConvertKit",
    review: "Simple et fiable pour email marketing automation.",
    rating: 4.4,
    link: "https://kit.com"
  },
  {
    name: "Canva",
    review: "Rapide pour produire des visuels pro sans designer.",
    rating: 4.6,
    link: "https://www.canva.com"
  }
];

export const contentLinks = [
  {
    platform: "YouTube",
    url: "https://www.youtube.com",
    description: "Études de cas, stratégie acquisition, tunnel et monétisation."
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com",
    description: "Live Q&A, retours d'expérience et annonces."
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com",
    description: "Contenu court orienté action et mindset business."
  }
];

export const defaultNotifications = [
  "Nouvelle formation: Croissance Système",
  "Nouveau contenu YouTube publié",
  "Offre limitée mentorat cette semaine"
];
