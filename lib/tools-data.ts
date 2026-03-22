export type Tool = {
  slug: string;
  name: string;
  category: string;
  rating: number; // 1–5
  tagline: string;
  logoGradient: string;
  imageUrl?: string;
  officialUrl: string;
  price: string;
  features: string[];
  pros: string[];
  cons: string[];
  tip: string;
  howToTry: string;
};

export const tools: Tool[] = [
  {
    slug: "notion",
    name: "Notion",
    category: "Productivité",
    rating: 5,
    tagline: "Centralise tes processus, contenus et suivi clients en un seul endroit.",
    logoGradient: "linear-gradient(135deg, #1A1A1A 0%, #3B3B3B 100%)",
    officialUrl: "https://www.notion.so",
    price: "Freemium — gratuit jusqu'à un usage solo, 8$/mois pour les équipes",
    features: [
      "Base de données relationnelles (tables, kanban, galerie, calendrier)",
      "Éditeur de pages tout-en-un (texte, code, embed, médias)",
      "Templates prêts à l'emploi pour tous les use cases",
      "API publique pour automatisations avancées",
      "Collaboration en temps réel",
      "Intégrations avec Zapier, Make, Slack et plus",
    ],
    pros: [
      "Extrêmement flexible — s'adapte à n'importe quel flux de travail",
      "Remplace facilement 3 à 4 outils (docs, CRM, project management, wiki)",
      "Interface épurée et agréable à utiliser au quotidien",
      "Version gratuite largement suffisante pour un solopreneur",
      "Communauté massive de templates partagés gratuitement",
    ],
    cons: [
      "Courbe d'apprentissage si tu veux exploiter toutes les fonctionnalités",
      "Peut devenir lent sur les très grandes bases de données",
      "Offline limité — nécessite une connexion pour la plupart des actions",
    ],
    tip: "Commence avec un template de CRM simple pour gérer tes prospects. Ajoute une vue Kanban pour suivre les étapes et une vue Tableau pour filtrer par statut. Tu auras un mini-CRM opérationnel en 30 minutes.",
    howToTry: "Va sur notion.so, crée un compte gratuit et duplique un template depuis la galerie officielle. Teste d'abord le template 'Personal CRM' ou 'Content Calendar' pour voir la puissance des bases de données.",
  },
  {
    slug: "convertkit",
    name: "ConvertKit",
    category: "Email Marketing",
    rating: 4,
    tagline: "Simple et fiable pour automatiser tes séquences email et gérer ta liste.",
    logoGradient: "linear-gradient(135deg, #FB6970 0%, #C2410C 100%)",
    officialUrl: "https://kit.com",
    price: "Gratuit jusqu'à 1 000 abonnés — 29$/mois au-delà",
    features: [
      "Séquences email automatisées avec logique conditionnelle",
      "Landing pages et formulaires d'opt-in intégrés",
      "Tags et segments pour personnaliser les envois",
      "Diffusion (broadcast) pour les newsletters",
      "Automatisations visuelles avec triggers multiples",
      "Commerce intégré pour vendre directement depuis l'outil",
    ],
    pros: [
      "Interface intuitive, prise en main en moins d'une heure",
      "Idéal pour les créateurs et solopreneurs",
      "Très bon taux de délivrabilité",
      "Plan gratuit généreux (jusqu'à 1 000 abonnés)",
      "Support réactif et documentation complète",
    ],
    cons: [
      "Moins de fonctionnalités avancées que ActiveCampaign ou Klaviyo",
      "L'éditeur d'emails est basique — peu de personnalisation visuelle",
      "Prix peut grimper vite avec une grande liste",
    ],
    tip: "Mets en place une séquence de bienvenue en 5 emails dès le premier abonné. Email 1 : accueil + promesse. Email 2 : ta meilleure ressource gratuite. Email 3 : ton histoire. Email 4 : ton offre phare. Email 5 : invitation à rejoindre ta communauté.",
    howToTry: "Crée un compte sur kit.com, connecte un formulaire à ta page de capture, et configure ta première séquence de bienvenue. Le plan gratuit suffit pour les 3 premiers mois.",
  },
  {
    slug: "canva",
    name: "Canva",
    category: "Design",
    rating: 5,
    tagline: "Crée des visuels professionnels sans designer en quelques minutes.",
    logoGradient: "linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)",
    officialUrl: "https://www.canva.com",
    price: "Freemium — gratuit limité, Canva Pro à 13€/mois",
    features: [
      "Milliers de templates pour posts, présentations, ebooks, logos",
      "Éditeur drag-and-drop sans compétences requises",
      "Brand Kit pour centraliser couleurs, polices et logos",
      "Suppression d'arrière-plan en un clic (Pro)",
      "Export multi-formats (PNG, PDF, MP4, GIF)",
      "Collaboration en équipe et partage de dossiers",
    ],
    pros: [
      "Accessibilité totale — zéro compétence graphique requise",
      "Gain de temps massif sur la production de contenus visuels",
      "Résultats très propres même avec la version gratuite",
      "Application mobile performante",
      "Idéal pour maintenir une identité visuelle cohérente",
    ],
    cons: [
      "Les créations restent reconnaisables comme 'Canva' avec les templates populaires",
      "Limites créatives comparé à Figma ou Photoshop pour des designs très personnalisés",
      "Certaines fonctionnalités indispensables (Brand Kit, background remover) réservées au Pro",
    ],
    tip: "Crée un dossier 'Brand Kit' avec tes couleurs exactes, tes 2 polices et ton logo. Ensuite, duplique toujours le même template de base pour tes posts. Tu produiras 10 visuels cohérents en 20 minutes au lieu de 2 heures.",
    howToTry: "Inscris-toi gratuitement sur canva.com et cherche un template pour ton réseau social principal. Lance-toi sur un post, un carousel ou une couverture d'ebook pour tester la prise en main.",
  },
  {
    slug: "systeme-io",
    name: "Systeme.io",
    category: "Tunnel de Vente",
    rating: 4,
    tagline: "Crée ton tunnel complet, ton email marketing et tes formations au même endroit.",
    logoGradient: "linear-gradient(135deg, #1A3FD8 0%, #0D9488 100%)",
    officialUrl: "https://systeme.io",
    price: "Gratuit jusqu'à 2 000 contacts — plans payants à partir de 27€/mois",
    features: [
      "Constructeur de tunnels de vente drag-and-drop",
      "Email marketing avec séquences et broadcasts",
      "Hébergement de formations en ligne",
      "Programme d'affiliation intégré",
      "Blog et pages de vente",
      "Automatisations entre tous les modules",
    ],
    pros: [
      "Tout-en-un — remplace ClickFunnels + ConvertKit + Teachable",
      "Plan gratuit très généreux (le meilleur du marché)",
      "Interface en français disponible",
      "Support client rapide et communauté active",
      "Idéal pour débuter sans exploser le budget outils",
    ],
    cons: [
      "Moins de flexibilité de design que ClickFunnels ou Leadpages",
      "L'éditeur de pages peut être limité pour des designs très personnalisés",
      "Moins connu → moins de ressources communautaires comparé aux concurrents",
    ],
    tip: "Utilise Systeme.io pour construire ton premier tunnel en 3 pages : page de capture → page de remerciement avec upsell → email de livraison. C'est faisable en une après-midi avec un template de base.",
    howToTry: "Crée un compte gratuit sur systeme.io sans carte bleue. Utilise le template 'Squeeze Page' pour lancer une première page de capture et teste l'envoi d'un email de bienvenue automatique.",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    category: "Intelligence Artificielle",
    rating: 5,
    tagline: "Accélère ta production de contenu, tes recherches et tes automatisations.",
    logoGradient: "linear-gradient(135deg, #10A37F 0%, #0D1B5E 100%)",
    officialUrl: "https://chat.openai.com",
    price: "Gratuit (GPT-3.5) — ChatGPT Plus à 20$/mois (GPT-4o)",
    features: [
      "Rédaction et amélioration de contenus (posts, emails, pages de vente)",
      "Analyse et résumé de documents longs",
      "Génération d'idées et brainstorming structuré",
      "Création de prompts systèmes pour automatisations",
      "Navigation web en temps réel (Plus)",
      "Génération d'images avec DALL-E (Plus)",
    ],
    pros: [
      "Gain de temps massif sur la production de contenu",
      "Polyvalent — utilisable pour presque toutes les tâches textuelles",
      "S'améliore constamment avec les nouvelles versions",
      "GPT-4o disponible gratuitement avec limitations",
      "Intégration possible dans n'importe quel workflow via l'API",
    ],
    cons: [
      "Peut générer des informations inexactes (hallucinations) — toujours vérifier",
      "Réponses parfois trop génériques sans prompt précis",
      "Contexte limité sur les conversations très longues",
    ],
    tip: "Ne jamais envoyer un texte généré sans le relire et l'adapter à ta voix. Utilise ChatGPT pour créer un premier jet à 70%, puis personnalise les 30% restants avec ton expérience, tes anecdotes et ta tonalité.",
    howToTry: "Va sur chat.openai.com et teste ce prompt : 'Écris 5 idées de posts LinkedIn pour un entrepreneur digital qui aide les débutants à lancer leur premier produit. Ton style : direct, concret, sans jargon.' Adapte ensuite les résultats.",
  },
  {
    slug: "loom",
    name: "Loom",
    category: "Vidéo & Communication",
    rating: 4,
    tagline: "Enregistre et partage des vidéos asynchrones pour gagner du temps sur les explications.",
    logoGradient: "linear-gradient(135deg, #625DF5 0%, #C026D3 100%)",
    officialUrl: "https://www.loom.com",
    price: "Gratuit jusqu'à 25 vidéos — Starter à 12.5$/mois",
    features: [
      "Enregistrement écran + webcam simultané en un clic",
      "Lien de partage instantané sans upload manuel",
      "Commentaires et réactions sur la timeline",
      "Transcription automatique des vidéos",
      "Intégration Notion, Slack, Gmail, Jira",
      "Analytics (vues, engagement, durée de visionnage)",
    ],
    pros: [
      "Remplace 80% des réunions Zoom par une vidéo de 3 minutes",
      "Gain de temps massif pour onboarding clients et explications techniques",
      "Très facile à utiliser — enregistrement en 2 clics",
      "Excellent pour créer du contenu tutoriel rapidement",
      "Lien de partage universel, pas besoin de compte pour visionner",
    ],
    cons: [
      "Plan gratuit limité à 25 vidéos (mais suffisant pour tester)",
      "Qualité vidéo dépend de ta connexion internet",
      "Moins adapté pour les vidéos longues ou les formations complètes",
    ],
    tip: "Utilise Loom pour répondre aux questions fréquentes de tes clients une fois, puis envoie le lien à tout le monde. Une vidéo de 3 minutes vaut mieux qu'un email de 20 lignes — et tu ne l'enregistres qu'une fois.",
    howToTry: "Installe l'extension Chrome sur loom.com, crée un compte gratuit et enregistre ta première vidéo de présentation de 2 minutes. Partage le lien avec un client ou un prospect pour tester la réception.",
  },
];
