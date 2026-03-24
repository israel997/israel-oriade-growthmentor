import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ formations: [], outils: [], contenus: [] });
  }
  try {
    const client = await clientPromise;
    const col = client.db().collection("favoris");
    const doc = await col.findOne({ userId: session.user.id });
    return NextResponse.json({
      formations: doc?.formations ?? [],
      outils: doc?.outils ?? [],
      contenus: doc?.contenus ?? [],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { category, id, action } = await req.json();
    // category: "formations" | "outils" | "contenus"
    // action: "add" | "remove"
    const client = await clientPromise;
    const col = client.db().collection("favoris");

    if (action === "add") {
      await col.updateOne(
        { userId: session.user.id },
        { $addToSet: { [category]: id } },
        { upsert: true }
      );
    } else {
      await col.updateOne(
        { userId: session.user.id },
        { $pull: { [category]: id } }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
