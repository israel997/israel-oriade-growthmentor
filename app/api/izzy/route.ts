import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM,
      messages,
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur Izzy" }, { status: 500 });
  }
}
