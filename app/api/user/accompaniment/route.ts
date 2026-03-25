import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!ObjectId.isValid(session.user.id)) {
    return NextResponse.json({ accompaniment: null });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { accompaniment: 1 } }
      );

    return NextResponse.json({ accompaniment: user?.accompaniment ?? null });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
