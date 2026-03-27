import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

// Badge definitions
export const MEMBER_BADGES = {
  mentee: {
    id: "mentee",
    label: "Mentee",
    color: "#94A3B8",        // argent
    colorBg: "rgba(148,163,184,0.12)",
    colorBorder: "rgba(148,163,184,0.3)",
    description: "Badge de bienvenue accordé à l'inscription.",
    perks: [
      "Accès aux tests (Contenu, Vente, Digital...)",
      "Téléchargement de toutes les ressources",
      "Détails complets des outils testés",
      "Diagnostic hebdomadaire",
      "Chat avec Izzy (10 requêtes/jour)",
    ],
  },
  growth_mentee: {
    id: "growth_mentee",
    label: "Growth Mentee",
    color: "#EF4444",        // rouge
    colorBg: "rgba(239,68,68,0.12)",
    colorBorder: "rgba(239,68,68,0.3)",
    description: "Accordé quand tu démontres une progression régulière dans tes résultats.",
    perks: [
      "Accès aux événements & conférences exclusifs",
      "Chat avec Izzy (30 requêtes/jour)",
      "Section Outils débloquée (Smart Planner...)",
      "Ajout d'outils personnalisés au dashboard",
      "Badge progression affiché sur le profil",
    ],
    requirements: {
      minTestImprovements: 3,  // 3 tests avec score amélioré
      minCertifications: 1,
    },
  },
  mentee_premium: {
    id: "mentee_premium",
    label: "Mentee Premium",
    color: "#F5C200",        // or
    colorBg: "rgba(245,194,0,0.12)",
    colorBorder: "rgba(245,194,0,0.3)",
    description: "Badge réservé aux membres du programme d'accompagnement personnalisé.",
    perks: [
      "Accompagnement 1-1 personnalisé",
      "Accès illimité à Izzy",
      "Révisions de stratégie mensuelles",
      "Accès prioritaire à tous les événements",
      "Support direct via messagerie privée",
    ],
  },
} as const;

export type BadgeId = keyof typeof MEMBER_BADGES;

// GET — fetch user badges
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const client = await clientPromise;
  const doc = await client.db().collection("user_badges").findOne({ userId: session.user.id });

  const badges: BadgeId[] = doc?.badges ?? [];

  // Always ensure Mentee badge is present for authenticated users
  if (!badges.includes("mentee")) {
    badges.unshift("mentee");
    await client.db().collection("user_badges").updateOne(
      { userId: session.user.id },
      { $addToSet: { badges: "mentee" }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }

  return NextResponse.json({ badges, definitions: MEMBER_BADGES });
}

// POST — award a badge
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { badge } = await req.json() as { badge: BadgeId };
  if (!badge || !(badge in MEMBER_BADGES)) {
    return NextResponse.json({ error: "Badge invalide" }, { status: 400 });
  }

  const client = await clientPromise;
  await client.db().collection("user_badges").updateOne(
    { userId: session.user.id },
    {
      $addToSet: { badges: badge },
      $set: { updatedAt: new Date() },
      $setOnInsert: { userId: session.user.id, createdAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true, badge });
}
