import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const [members, formations, outils, ressources, blog, temoignages, contenus] = await Promise.all([
      db.collection("users").countDocuments({ revoked: { $ne: true } }),
      db.collection("formations").countDocuments(),
      db.collection("outils").countDocuments(),
      db.collection("ressources").countDocuments(),
      db.collection("blog").countDocuments(),
      db.collection("temoignages").countDocuments(),
      db.collection("contenus").countDocuments(),
    ]);

    return NextResponse.json({ members, formations, outils, ressources, blog, temoignages, contenus });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
