// answers[] index mapping (0-based):
// [0] Q1: offre définie        [1] Q2: contenu régulier
// [2] Q3: tunnel/système       [3] Q4: appels de vente
// [4] Q5: témoignages          [5] Q6: analyse chiffres
// [6] Q7: positionnement       [7] Q8: audience/liste email
// [8] Q9: investissement       [9] Q10: ventes ce mois

export type BadgeLabel = "Apprenti" | "En croissance" | "Confirmé" | "Expert" | "Elite";

export type DiagnosticScenario = {
  id: string;
  priority: number; // lower = more critical, used for sorting
  // Conditions: all must be true to match
  badges?: BadgeLabel[]; // if empty, matches any badge
  conditions: ((a: number[]) => boolean)[];
  // Output
  lacune: string; // short title of the weakness
  action: string; // 1 concrete immediate action (imperative, precise)
  formationIds: string[];
  resourceIds: string[];
};

const a = (answers: number[], idx: number) => answers[idx] ?? 0;

export const DIAGNOSTIC_SCENARIOS: DiagnosticScenario[] = [

  // ══════════════════════════════════════════════════════════════════
  // APPRENTI SCENARIOS (badge 0-29)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "apprenti-zero-absolu",
    priority: 1,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 0) === 0 && a(ans, 1) === 0],
    lacune: "Tu pars de zéro — ni offre ni contenu",
    action: "Commence par lire le guide 'Trouver ta niche rentable' aujourd'hui, puis note par écrit en 2 phrases qui tu veux aider et quel problème tu résous.",
    formationIds: ["lancer-activite-digitale", "trouver-niche"],
    resourceIds: ["guide-niche-rentable", "template-offre"],
  },
  {
    id: "apprenti-offre-floue",
    priority: 2,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 0) <= 1 && a(ans, 9) === 0],
    lacune: "Ton offre est floue — tu n'as pas encore de clients",
    action: "Complète le template 'Construire son offre en 1 page' maintenant : définis ta cible, ton résultat promis et ton prix de lancement.",
    formationIds: ["premiere-offre", "lancer-activite-digitale"],
    resourceIds: ["template-offre", "guide-prix"],
  },
  {
    id: "apprenti-pas-contenu-pas-audience",
    priority: 3,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 1) === 0 && a(ans, 7) === 0],
    lacune: "Aucun contenu publié et aucune audience",
    action: "Choisis 1 seul réseau social aujourd'hui (Instagram ou LinkedIn) et publie ton premier post en te présentant et en expliquant ce que tu fais.",
    formationIds: ["creer-contenu-zero", "instagram-debutant"],
    resourceIds: ["calendrier-editorial", "guide-niche-rentable"],
  },
  {
    id: "apprenti-zero-vente-zero-preuve",
    priority: 4,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 4) === 0 && a(ans, 9) === 0],
    lacune: "Aucune vente, aucune preuve sociale",
    action: "Propose ton service gratuitement ou à prix réduit à 2-3 personnes de ton entourage en échange d'un témoignage écrit ou vidéo.",
    formationIds: ["premiers-clients-sans-audience"],
    resourceIds: ["guide-temoignages", "guide-prospection"],
  },
  {
    id: "apprenti-positionnement-inexistant",
    priority: 5,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 6) === 0 && a(ans, 0) <= 1],
    lacune: "Ton positionnement est inexistant",
    action: "Remplis cette phrase maintenant : 'J'aide [qui précis] à [résultat mesurable] grâce à [ta méthode unique]' — colle-la en bio sur tous tes réseaux.",
    formationIds: ["trouver-niche", "lancer-activite-digitale"],
    resourceIds: ["guide-positionnement", "guide-niche-rentable"],
  },
  {
    id: "apprenti-zero-appels-zero-systeme",
    priority: 6,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 2) === 0 && a(ans, 3) === 0 && a(ans, 9) === 0],
    lacune: "Aucun système de vente, aucun appel passé",
    action: "Crée un Calendly gratuit aujourd'hui, fixe 3 créneaux 'appel découverte' cette semaine et envoie le lien à 5 personnes susceptibles d'être intéressées.",
    formationIds: ["appels-vente", "premiers-clients-sans-audience"],
    resourceIds: ["script-appel-vente", "guide-prospection"],
  },
  {
    id: "apprenti-pas-investissement",
    priority: 7,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 8) === 0 && a(ans, 5) === 0],
    lacune: "Tu n'investis pas en toi et n'analyses rien",
    action: "Inscris-toi à une formation gratuite de la plateforme cette semaine et installe un fichier Google Sheets pour tracker au minimum ton CA mensuel.",
    formationIds: ["mindset-entrepreneur", "lancer-activite-digitale"],
    resourceIds: ["routine-entrepreneur", "tableau-bord-kpi"],
  },
  {
    id: "apprenti-pas-audience-pas-tunnel",
    priority: 8,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 7) === 0 && a(ans, 2) === 0],
    lacune: "Pas d'audience et pas de système de capture",
    action: "Crée un lead magnet gratuit (guide PDF, checklist ou template) en 1 journée, puis ouvre un compte Mailchimp gratuit pour collecter des emails.",
    formationIds: ["email-marketing", "instagram-debutant"],
    resourceIds: ["guide-lead-magnet", "guide-email-bienvenue"],
  },
  {
    id: "apprenti-pas-formation",
    priority: 9,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 8) === 0 && a(ans, 0) === 0],
    lacune: "Tu n'investis pas en toi avant même d'avoir une offre",
    action: "Commence par la formation 'Lancer son activité digitale de zéro' — elle est gratuite et te donnera les bases indispensables en moins de 2h.",
    formationIds: ["lancer-activite-digitale", "mindset-entrepreneur"],
    resourceIds: ["guide-niche-rentable", "template-offre"],
  },
  {
    id: "apprenti-script-vente-positionnement",
    priority: 10,
    badges: ["Apprenti"],
    conditions: [(ans) => a(ans, 3) === 0 && a(ans, 4) === 0 && a(ans, 6) <= 1],
    lacune: "Vente et positionnement inexistants — tu n'as aucun argument de vente",
    action: "Télécharge le script d'appel de vente, entraîne-toi à le prononcer à voix haute et passe ton premier appel découverte cette semaine.",
    formationIds: ["appels-vente", "trouver-niche"],
    resourceIds: ["script-appel-vente", "guide-positionnement"],
  },

  // ══════════════════════════════════════════════════════════════════
  // EN CROISSANCE (30-49)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "croissance-contenu-irregulier-audience-faible",
    priority: 11,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 1) <= 1 && a(ans, 7) <= 1],
    lacune: "Contenu irrégulier et audience encore faible",
    action: "Prépare 12 posts d'avance ce weekend (1 idée par semaine sur 3 mois), programme-les avec Buffer ou Later et publie sans interruption pendant 30 jours.",
    formationIds: ["strategie-contenu"],
    resourceIds: ["calendrier-editorial", "guide-niche-rentable"],
  },
  {
    id: "croissance-offre-sans-systeme",
    priority: 12,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 2) <= 1 && a(ans, 9) <= 1],
    lacune: "Tu as une offre mais aucun système de conversion",
    action: "Crée une page de vente simple sur Notion ou Canva cette semaine : problème, solution, bénéfices, prix, bouton d'achat ou lien Calendly.",
    formationIds: ["tunnel-vente-simple"],
    resourceIds: ["checklist-tunnel", "template-offre"],
  },
  {
    id: "croissance-pas-assez-appels",
    priority: 13,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 3) <= 1 && a(ans, 9) <= 1],
    lacune: "Tu fais trop peu d'appels de vente — tes ventes stagnent",
    action: "Bloque 2h chaque lundi matin uniquement pour la prospection : envoie 10 messages personnalisés sur Instagram ou LinkedIn, sans exception.",
    formationIds: ["appels-vente", "premiers-clients-sans-audience"],
    resourceIds: ["script-appel-vente", "guide-prospection"],
  },
  {
    id: "croissance-pas-temoignages",
    priority: 14,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 4) <= 1 && a(ans, 9) <= 1],
    lacune: "Tu as des clients mais pas de témoignages exploités",
    action: "Envoie un message à chacun de tes clients actuels aujourd'hui pour leur demander un témoignage en 3 questions : résultat, avant/après, recommandation.",
    formationIds: ["personal-branding"],
    resourceIds: ["guide-temoignages"],
  },
  {
    id: "croissance-zero-analyse",
    priority: 15,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 5) <= 1 && a(ans, 9) <= 1],
    lacune: "Tu génères des ventes mais tu n'analyses rien",
    action: "Ouvre Google Sheets maintenant et crée 4 colonnes : Date, Source du client, Montant, Canal (Instagram/Referral/etc.) — remplis-le à chaque vente.",
    formationIds: ["analyser-chiffres"],
    resourceIds: ["tableau-bord-kpi"],
  },
  {
    id: "croissance-positionnement-flou-avec-contenu",
    priority: 16,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 6) <= 1 && a(ans, 1) >= 1],
    lacune: "Tu publies du contenu mais ton positionnement est flou",
    action: "Réécris ta bio sur tous tes réseaux en 1 phrase : 'J'aide [cible] à [résultat] — DM pour [prochaine étape]'. Applique ce changement avant ce soir.",
    formationIds: ["personal-branding", "strategie-contenu"],
    resourceIds: ["guide-positionnement"],
  },
  {
    id: "croissance-pas-email-avec-contenu",
    priority: 17,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 7) <= 1 && a(ans, 1) >= 1],
    lacune: "Tu as du contenu mais pas de liste email — tu dépends des plateformes",
    action: "Crée un compte Mailchimp (gratuit jusqu'à 500 contacts), conçois un lead magnet simple cette semaine et ajoute le lien d'inscription dans chaque post.",
    formationIds: ["email-marketing"],
    resourceIds: ["guide-lead-magnet", "guide-email-bienvenue"],
  },
  {
    id: "croissance-pas-investissement-pas-tunnel",
    priority: 18,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 8) <= 1 && a(ans, 2) <= 1],
    lacune: "Tu n'investis pas en toi et tu n'as pas de tunnel",
    action: "Inscris-toi à la formation 'Tunnel de vente simple' cette semaine — sans système de vente, ta croissance restera aléatoire et épuisante.",
    formationIds: ["tunnel-vente-simple", "mindset-entrepreneur"],
    resourceIds: ["checklist-tunnel"],
  },
  {
    id: "croissance-offre-a-affiner",
    priority: 19,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 0) <= 2 && a(ans, 2) <= 1],
    lacune: "Ton offre n'est pas encore clairement définie",
    action: "Définis 3 versions de ton offre à prix différents (entrée, standard, premium) et teste-les en les proposant à tes prochains prospects.",
    formationIds: ["offre-premium", "premiere-offre"],
    resourceIds: ["template-offre", "guide-prix"],
  },
  {
    id: "croissance-contenu-sans-conversion",
    priority: 20,
    badges: ["En croissance"],
    conditions: [(ans) => a(ans, 1) >= 2 && a(ans, 2) === 0 && a(ans, 9) <= 1],
    lacune: "Tu crées du contenu actif mais tu ne convertis pas",
    action: "Ajoute un appel à l'action clair à la fin de chaque post ('DM-moi le mot X pour...') et crée une page de capture simple avec une offre gratuite.",
    formationIds: ["tunnel-vente-simple"],
    resourceIds: ["checklist-tunnel", "guide-lead-magnet"],
  },

  // ══════════════════════════════════════════════════════════════════
  // CONFIRMÉ (50-69)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "confirme-peu-appels",
    priority: 21,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 3) <= 1 && a(ans, 9) <= 2],
    lacune: "Pas assez d'appels de vente — tes ventes sont limitées",
    action: "Instaure une règle non-négociable : minimum 5 appels découverte par semaine. Bloque les créneaux dans ton agenda maintenant pour les 4 prochaines semaines.",
    formationIds: ["appels-vente"],
    resourceIds: ["script-appel-vente", "guide-prospection"],
  },
  {
    id: "confirme-contenu-irregulier",
    priority: 22,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 1) <= 1 && a(ans, 7) <= 2],
    lacune: "Ton contenu est encore trop irrégulier pour construire une audience solide",
    action: "Adopte la règle du 'content batch' : réserve chaque lundi 3h pour créer le contenu de toute la semaine, programme-le et n'y touche plus.",
    formationIds: ["strategie-contenu"],
    resourceIds: ["calendrier-editorial"],
  },
  {
    id: "confirme-analyse-mensuelle-seulement",
    priority: 23,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 5) <= 2 && a(ans, 9) >= 2],
    lacune: "Tu analyses tes chiffres trop rarement pour piloter efficacement",
    action: "Fixe un 'Monday morning metrics' de 20 minutes chaque lundi : CA semaine, nouveaux leads, taux de conversion, source principale de clients.",
    formationIds: ["analyser-chiffres"],
    resourceIds: ["tableau-bord-kpi"],
  },
  {
    id: "confirme-peu-preuves-sociales",
    priority: 24,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 4) <= 2 && a(ans, 6) >= 2],
    lacune: "Bon positionnement mais peu de preuves sociales exploitées",
    action: "Crée 1 étude de cas client ce mois-ci : avant/après, chiffres concrets, témoignage cité. Publie-la sur ta page de vente et en post sur tes réseaux.",
    formationIds: ["personal-branding"],
    resourceIds: ["guide-temoignages"],
  },
  {
    id: "confirme-audience-stagne",
    priority: 25,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 7) <= 1 && a(ans, 2) >= 2],
    lacune: "Ton tunnel fonctionne mais ton audience ne grossit plus",
    action: "Lance 1 collaboration cette semaine : trouve un créateur complémentaire (pas concurrent), propose un live commun ou un échange de newsletters.",
    formationIds: ["strategie-contenu", "email-marketing"],
    resourceIds: ["guide-lead-magnet"],
  },
  {
    id: "confirme-pas-investissement",
    priority: 26,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 8) <= 1 && a(ans, 5) <= 1],
    lacune: "Tu n'investis pas assez en toi ni dans l'analyse",
    action: "Inscris-toi à une formation avancée dans ta lacune principale et bloque 30 minutes chaque vendredi pour analyser ta semaine business.",
    formationIds: ["analyser-chiffres", "offre-premium"],
    resourceIds: ["tableau-bord-kpi", "routine-entrepreneur"],
  },
  {
    id: "confirme-tunnel-faible-conversion",
    priority: 27,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 2) <= 2 && a(ans, 9) <= 1],
    lacune: "Ton tunnel est en place mais ne convertit pas assez",
    action: "Fais relire ta page de vente par 3 personnes extérieures cette semaine. Améliore le titre, la preuve sociale et le CTA selon leurs retours.",
    formationIds: ["tunnel-vente-simple", "offre-premium"],
    resourceIds: ["checklist-tunnel", "guide-prix"],
  },
  {
    id: "confirme-positionnement-flou",
    priority: 28,
    badges: ["Confirmé"],
    conditions: [(ans) => a(ans, 6) <= 1 && a(ans, 7) <= 2],
    lacune: "Positionnement encore flou malgré ton activité",
    action: "Analyse les 3 concurrents qui réussissent dans ta niche : note leur promesse, leur cible, leur ton. Définis comment tu es DIFFÉRENT d'eux en 1 phrase.",
    formationIds: ["personal-branding"],
    resourceIds: ["guide-positionnement"],
  },

  // ══════════════════════════════════════════════════════════════════
  // EXPERT (70-87)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "expert-contenu-pas-3x",
    priority: 29,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 1) <= 2 && a(ans, 7) <= 2],
    lacune: "Ton contenu n'est pas encore au rythme nécessaire pour scaler",
    action: "Délègue la mise en forme et la programmation de tes posts à un assistant virtuel — concentre-toi uniquement sur la création d'idées et de messages.",
    formationIds: ["scale-contenu"],
    resourceIds: ["calendrier-editorial"],
  },
  {
    id: "expert-appels-pas-quotidiens",
    priority: 30,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 3) <= 2 && a(ans, 9) <= 2],
    lacune: "Tes appels de vente sont insuffisants pour atteindre ton prochain palier",
    action: "Mets en place un système de prospection automatisé : séquence LinkedIn, DM automatisés ou campagne email froide avec 50 prospects/semaine.",
    formationIds: ["vente-automatisee", "appels-vente"],
    resourceIds: ["script-appel-vente"],
  },
  {
    id: "expert-pas-analyse-hebdo",
    priority: 31,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 5) <= 2 && a(ans, 9) >= 2],
    lacune: "Tu as des ventes solides mais tu pilotes encore trop à l'intuition",
    action: "Crée un dashboard Google Sheets avec tes KPIs hebdo : CA, nombre de leads, taux de conversion, CAC (coût d'acquisition client) et LTV (valeur vie client).",
    formationIds: ["analyser-chiffres"],
    resourceIds: ["tableau-bord-kpi"],
  },
  {
    id: "expert-tunnel-faible-conversion",
    priority: 32,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 2) >= 3 && a(ans, 9) <= 2],
    lacune: "Ton tunnel est opérationnel mais le taux de conversion est à améliorer",
    action: "Installe Microsoft Clarity (gratuit) sur ta page de vente pour voir exactement où les visiteurs abandonnent. Corrige les 3 points de friction cette semaine.",
    formationIds: ["vente-automatisee"],
    resourceIds: ["checklist-tunnel"],
  },
  {
    id: "expert-peu-preuves-ventes-ok",
    priority: 33,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 4) <= 2 && a(ans, 9) >= 2],
    lacune: "Tes ventes sont là mais tes preuves sociales sont sous-exploitées",
    action: "Lance un programme de referral cette semaine : offre 1 mois gratuit ou une réduction à chaque client qui t'amène un nouveau client.",
    formationIds: ["personal-branding"],
    resourceIds: ["guide-temoignages"],
  },
  {
    id: "expert-audience-email-faible",
    priority: 34,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 7) <= 2 && a(ans, 9) >= 3],
    lacune: "Ventes solides mais ta liste email est trop petite pour sécuriser tes revenus",
    action: "Alloue 20% de tes bénéfices ce mois-ci en publicité Meta Ads pour diriger du trafic vers ton lead magnet et faire grossir ta liste rapidement.",
    formationIds: ["publicite-payante", "email-marketing"],
    resourceIds: ["guide-lead-magnet"],
  },
  {
    id: "expert-pas-coaching-avance",
    priority: 35,
    badges: ["Expert"],
    conditions: [(ans) => a(ans, 8) <= 2 && a(ans, 5) >= 2],
    lacune: "Tu analyses bien mais tu n'investis pas assez en accompagnement pour débloquer ton prochain niveau",
    action: "Recherche un mastermind ou un programme de coaching avancé dans ton secteur — l'environnement est le facteur #1 de progression à ton niveau.",
    formationIds: ["scale-contenu", "vente-automatisee"],
    resourceIds: ["routine-entrepreneur"],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELITE (88+)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "elite-pas-systeme-auto",
    priority: 36,
    badges: ["Elite"],
    conditions: [(ans) => a(ans, 3) <= 2],
    lacune: "Tes ventes sont encore trop manuelles pour un niveau Elite",
    action: "Crée un webinaire evergreen ou une VSL (Video Sales Letter) cette semaine pour que ton système vende même quand tu n'es pas là.",
    formationIds: ["vente-automatisee"],
    resourceIds: ["checklist-tunnel"],
  },
  {
    id: "elite-audience-plafonnee",
    priority: 37,
    badges: ["Elite"],
    conditions: [(ans) => a(ans, 7) <= 2],
    lacune: "Ton audience plafonne — il faut scaler l'acquisition",
    action: "Lance une campagne Meta Ads ou Google Ads avec un budget test de 50€/semaine sur ton lead magnet le plus performant. Mesure le CPL et itère.",
    formationIds: ["publicite-payante", "scale-contenu"],
    resourceIds: ["guide-lead-magnet"],
  },
  {
    id: "elite-analyse-insuffisante",
    priority: 38,
    badges: ["Elite"],
    conditions: [(ans) => a(ans, 5) <= 2],
    lacune: "À ton niveau, piloter sans données précises est un risque réel",
    action: "Mets en place un tableau de bord avancé avec LTV, CAC, MRR et taux de churn. Utilise Google Looker Studio (gratuit) connecté à tes outils.",
    formationIds: ["analyser-chiffres"],
    resourceIds: ["tableau-bord-kpi"],
  },

  // ══════════════════════════════════════════════════════════════════
  // SCÉNARIOS TRANSVERSAUX (tous niveaux)
  // ══════════════════════════════════════════════════════════════════

  {
    id: "transversal-contenu-actif-zero-conversion",
    priority: 39,
    badges: undefined,
    conditions: [(ans) => a(ans, 1) >= 3 && a(ans, 2) === 0 && a(ans, 9) === 0],
    lacune: "Tu crées beaucoup de contenu mais tu ne convertis absolument pas",
    action: "Arrête de publier du contenu 'éducatif' sans CTA — chaque post doit se terminer par une invitation à agir : 'DM-moi le mot X', 'Lien en bio' ou 'Réponds à ce post'.",
    formationIds: ["tunnel-vente-simple", "appels-vente"],
    resourceIds: ["checklist-tunnel", "script-appel-vente"],
  },
  {
    id: "transversal-ventes-sans-email",
    priority: 40,
    badges: undefined,
    conditions: [(ans) => a(ans, 9) >= 2 && a(ans, 7) === 0],
    lacune: "Tu vends bien mais tu n'as aucune liste email — risque de tout perdre si une plateforme ferme",
    action: "Crée un compte email marketing aujourd'hui (Mailchimp ou Brevo gratuits), propose un bonus exclusif à tes clients et abonnés pour récupérer leurs emails cette semaine.",
    formationIds: ["email-marketing"],
    resourceIds: ["guide-lead-magnet", "guide-email-bienvenue"],
  },
];
