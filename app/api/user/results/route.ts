import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { createNotification } from "@/lib/createNotification";
import { checkAndAwardGrowthMenteeBadge } from "@/lib/checkGrowthMenteeBadge";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const client = await clientPromise;
  const items = await client
    .db()
    .collection("user_results")
    .find({ userId: session.user.id })
    .sort({ date: -1 })
    .toArray();

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { type, score, badge, date } = body;
  if (!type || score === undefined) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  const client = await clientPromise;
  await client.db().collection("user_results").insertOne({
    userId: session.user.id,
    type,
    score,
    badge: badge ?? null,
    date: date ?? new Date().toISOString(),
    createdAt: new Date(),
  });

  // Trigger notification
  if (type === "diagnostic") {
    await createNotification({
      title: "Diagnostic complété",
      message: `Tu as obtenu ${score}/100 — niveau ${badge ?? "Apprenti"}. Consulte ta progression pour voir ton évolution.`,
      type: "diagnostic",
      link: "/espace-membre/progression",
    });
  } else {
    const labels: Record<string, string> = { contenu: "Contenu", vente: "Vente", digital: "Digital" };
    await createNotification({
      title: `Test ${labels[type] ?? type} complété`,
      message: `Tu as obtenu ${score}/100 au test ${labels[type] ?? type}${badge ? ` — niveau ${badge}` : ""}.`,
      type: "test",
      link: "/espace-membre/progression",
    });
  }

  // Check if Growth Mentee badge should be awarded
  const db = client.db();
  const justAwarded = await checkAndAwardGrowthMenteeBadge(db, session.user.id);
  if (justAwarded) {
    await createNotification({
      title: "Badge Growth Mentee débloqué ! 🎉",
      message: "Tu as démontré une progression régulière. Tu as maintenant accès aux événements exclusifs, à plus de requêtes Izzy et à la section Outils.",
      type: "badge",
      link: "/espace-membre",
    });
  }

  return NextResponse.json({ ok: true, growthMenteeAwarded: justAwarded });
}
