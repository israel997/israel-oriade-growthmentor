import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌  MONGODB_URI manquant. Lance : node --env-file=.env.local scripts/seed-formations.mjs");
  process.exit(1);
}

const formations = [
  {
    id: "lancement-digital-30j",
    title: "Lancement Digital 30J",
    type: "Formation",
    coverGradient: "linear-gradient(135deg, #0D9488 0%, #0D1B5E 100%)",
    period: "30 jours",
    validityPeriod: "Accès à vie",
    price: "79€",
    priceXof: "52 000 XOF",
    members: 312,
    advantages: [
      "Méthode étape par étape pour ton premier produit digital",
      "Positionnement et choix de niche rentable",
      "Création d'une offre irrésistible",
      "Tunnel de vente simple et efficace",
      "Stratégie d'acquisition organique",
      "Templates et checklists inclus",
      "Accès à la communauté privée",
    ],
    modules: [
      { title: "Module 1 — Positionnement", lessons: ["Choisir ta niche rentable", "Définir ton avatar client", "Valider ton idée en 48h"] },
      { title: "Module 2 — L'Offre", lessons: ["Structurer une offre simple", "Fixer son prix", "Écrire sa page de vente"] },
      { title: "Module 3 — Le Tunnel", lessons: ["Page de capture", "Séquence email de bienvenue", "Page de vente + paiement"] },
      { title: "Module 4 — Acquisition", lessons: ["Stratégie de contenu organique", "Premiers 100 abonnés", "Convertir ses premiers clients"] },
    ],
    href: "/formations/lancement-digital-30j",
  },
  {
    id: "croissance-systeme",
    title: "Croissance Système",
    type: "Formation",
    coverGradient: "linear-gradient(135deg, #1A3FD8 0%, #0A1240 100%)",
    period: "6 semaines",
    validityPeriod: "Accès à vie",
    price: "149€",
    priceXof: "98 000 XOF",
    originalPrice: "199€",
    promo: "-25%",
    members: 187,
    advantages: [
      "Structurer un système d'acquisition reproductible",
      "Email automation et séquences de conversion",
      "Pages de vente haute conversion",
      "Pilotage par les KPI essentiels",
      "Offres ascendantes et upsell",
      "Suivi hebdomadaire des indicateurs",
      "Accès aux mises à jour à vie",
    ],
    modules: [
      { title: "Module 1 — KPI & Pilotage", lessons: ["Les métriques qui comptent vraiment", "Tableau de bord simple", "Prendre des décisions data-driven"] },
      { title: "Module 2 — Email Automation", lessons: ["Séquence de nurturing", "Emails de vente", "Segmentation et scoring"] },
      { title: "Module 3 — Pages de Conversion", lessons: ["Anatomie d'une page qui vend", "A/B testing rapide", "Optimiser son taux de conversion"] },
      { title: "Module 4 — Offres Ascendantes", lessons: ["Ladder de valeur", "Upsell et downsell", "Fidélisation et récurrence"] },
    ],
    href: "/formations/croissance-systeme",
  },
  {
    id: "content-machine",
    title: "Content Machine",
    type: "Masterclass",
    coverGradient: "linear-gradient(135deg, #B45309 0%, #1A3FD8 100%)",
    period: "1 journée intensive",
    validityPeriod: "Accès replay 12 mois",
    price: "49€",
    priceXof: "32 000 XOF",
    members: 524,
    advantages: [
      "Créer 30 jours de contenu en 3 heures",
      "Les formats qui convertissent sur chaque plateforme",
      "Calendrier éditorial clé en main",
      "Scripts vidéo et posts haute performance",
      "Replay intégral + slides disponibles",
    ],
    modules: [
      { title: "Partie 1 — Stratégie Contenu", lessons: ["Pourquoi la plupart échouent", "Les 3 piliers de contenu qui vendent", "Choisir ses plateformes"] },
      { title: "Partie 2 — Création en masse", lessons: ["La méthode batch", "Scripts et templates", "Outils pour aller 3x plus vite"] },
      { title: "Partie 3 — Calendrier & Systèmes", lessons: ["Calendrier éditorial 30 jours", "Automatiser la publication", "Analyser et itérer"] },
    ],
    href: "/formations/content-machine",
  },
  {
    id: "offre-premium",
    title: "Créer une Offre Premium",
    type: "Masterclass",
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #0D1B5E 100%)",
    period: "2h de masterclass",
    validityPeriod: "Accès replay à vie",
    price: "Gratuit",
    priceXof: "Gratuit",
    members: 891,
    advantages: [
      "Comprendre la psychologie de l'acheteur premium",
      "Structurer une offre à haute valeur perçue",
      "Pricing et positionnement haut de gamme",
      "Les erreurs qui font fuir les clients premium",
      "Q&A en direct enregistré",
    ],
    modules: [
      { title: "Partie 1 — Psychologie Premium", lessons: ["Ce que veut vraiment un acheteur premium", "Les signaux de confiance", "Positionnement haut de gamme"] },
      { title: "Partie 2 — Construire l'Offre", lessons: ["Valeur perçue vs valeur réelle", "Structurer les livrables", "Fixer un prix premium assumé"] },
      { title: "Partie 3 — Q&A Live", lessons: ["Questions des participants", "Études de cas commentées"] },
    ],
    href: "/formations/offre-premium",
  },
  {
    id: "mentorat-elite",
    title: "Mentorat Elite",
    type: "Accompagnement",
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #1A3FD8 100%)",
    period: "90 jours",
    validityPeriod: "Durée du programme",
    price: "390€",
    priceXof: "256 000 XOF",
    members: 43,
    advantages: [
      "Audit complet de ton business dès le départ",
      "Roadmap personnalisée sur 90 jours",
      "Sessions live hebdomadaires en groupe",
      "Accès direct pour questions par messagerie",
      "Revue mensuelle de tes indicateurs",
      "Accès à toutes les formations de la plateforme",
      "Certificat de fin de programme",
    ],
    modules: [
      { title: "Semaine 1-2 — Audit & Fondations", lessons: ["Audit complet de ton activité", "Identification des blocages", "Définition de la roadmap 90j"] },
      { title: "Semaine 3-6 — Acquisition", lessons: ["Optimisation de l'acquisition", "Tunnel et conversion", "Premiers paliers de revenus"] },
      { title: "Semaine 7-10 — Systèmes", lessons: ["Automatisation des process", "Délégation et outils", "Pilotage par les données"] },
      { title: "Semaine 11-13 — Scale", lessons: ["Stratégie de passage à l'échelle", "Offres premium", "Bilan et plan de continuation"] },
    ],
    href: "/formations/mentorat-elite",
  },
  {
    id: "acceleration-individuelle",
    title: "Accélération Individuelle",
    type: "Accompagnement",
    coverGradient: "linear-gradient(135deg, #C2410C 0%, #7C3AED 100%)",
    period: "30 jours intensif",
    validityPeriod: "Durée du programme",
    price: "290€",
    priceXof: "190 000 XOF",
    originalPrice: "390€",
    promo: "EARLY BIRD",
    members: 18,
    advantages: [
      "Suivi 1-to-1 avec Israël Oriadé",
      "2 appels stratégiques par semaine",
      "Plan d'action détaillé semaine par semaine",
      "Feedback sur tes créations (pages, offres, contenus)",
      "Accès prioritaire aux nouvelles ressources",
    ],
    modules: [
      { title: "Semaine 1 — Diagnostic & Plan", lessons: ["Appel de cadrage initial", "Analyse de ta situation", "Plan d'action semaine 1-4"] },
      { title: "Semaine 2-3 — Exécution rapide", lessons: ["Appels bi-hebdomadaires", "Feedback sur tes livrables", "Ajustements en temps réel"] },
      { title: "Semaine 4 — Bilan & Suite", lessons: ["Revue des résultats", "Identification des prochaines étapes", "Plan de continuation"] },
    ],
    href: "/formations/acceleration-individuelle",
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db().collection("formations");

    // Vide la collection avant de re-seeder
    await col.deleteMany({});
    console.log("🗑️   Collection 'formations' vidée.");

    const result = await col.insertMany(formations);
    console.log(`✅  ${result.insertedCount} formations insérées avec prix € et XOF.`);

    for (const f of formations) {
      const xof = f.priceXof ?? "—";
      console.log(`   • ${f.title.padEnd(30)} ${f.price.padEnd(8)} → ${xof}`);
    }
  } finally {
    await client.close();
  }
}

seed().catch((err) => { console.error(err); process.exit(1); });
