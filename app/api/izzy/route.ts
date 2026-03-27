import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Daily request limits per badge tier
const IZZY_LIMITS: Record<string, number> = {
  mentee: 10,
  growth_mentee: 30,
  mentee_premium: 9999,
};

const SYSTEM = `Tu es Izzy, un consultant business IA de Growth Mentor, la plateforme de Israël Oriadé.

Tu es expert en :
- Création et scaling d'activités digitales
- Création de contenu (réseaux sociaux, stratégie éditoriale)
- Tunnels de vente, offres, pricing
- Marketing digital, personal branding
- Mindset entrepreneurial

Ton style :
- Direct, bienveillant, concret — tu donnes des conseils actionnables
- Pas de blabla inutile
- Tu poses des questions de clarification si nécessaire
- Tu réponds en français
- Tu peux utiliser des listes et des étapes claires
- Commence tes réponses sans te présenter à chaque fois`;

async function getBadgeTier(userId: string): Promise<string> {
  try {
    const db = (await clientPromise).db();
    const doc = await db.collection("user_badges").findOne({ userId });
    const badges: string[] = doc?.badges ?? ["mentee"];
    if (badges.includes("mentee_premium")) return "mentee_premium";
    if (badges.includes("growth_mentee")) return "growth_mentee";
    return "mentee";
  } catch { return "mentee"; }
}

async function getDailyCount(userId: string): Promise<number> {
  try {
    const db = (await clientPromise).db();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.collection("izzy_usage").countDocuments({ userId, createdAt: { $gte: today } });
  } catch { return 0; }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const tier = await getBadgeTier(session.user.id);
  const limit = IZZY_LIMITS[tier] ?? 10;
  const today = await getDailyCount(session.user.id);

  return NextResponse.json({ today, limit, tier, remaining: Math.max(0, limit - today) });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Connexion requise pour utiliser Izzy." }, { status: 401 });
    }

    const userId = session.user.id;
    const tier = await getBadgeTier(userId);
    const limit = IZZY_LIMITS[tier] ?? 10;
    const todayCount = await getDailyCount(userId);

    if (todayCount >= limit) {
      const upgradeMsg = tier === "mentee"
        ? `Tu as atteint ta limite de ${limit} requêtes aujourd'hui. Progresse dans tes tests pour débloquer le badge Growth Mentee (30 requêtes/jour).`
        : `Tu as atteint ta limite de ${limit} requêtes pour aujourd'hui. Reviens demain !`;
      return NextResponse.json({ error: upgradeMsg, limitReached: true, tier, limit }, { status: 429 });
    }

    const { messages } = await req.json();
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM,
      messages,
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Log usage
    try {
      const db = (await clientPromise).db();
      await db.collection("izzy_usage").insertOne({ userId, createdAt: new Date() });
    } catch {}

    return NextResponse.json({
      text,
      usage: { today: todayCount + 1, limit, tier },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur Izzy" }, { status: 500 });
  }
}
