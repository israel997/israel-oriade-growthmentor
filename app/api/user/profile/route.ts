import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  try {
    const client = await clientPromise;
    const user = await client.db().collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { pays: 1, whatsapp: 1, name: 1 } }
    );
    return NextResponse.json({ pays: user?.pays ?? null, whatsapp: user?.whatsapp ?? null });
  } catch {
    return NextResponse.json({ pays: null });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
    }

    const client = await clientPromise;
    await client.db().collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { name: name.trim() } }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
