import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

type Params = { params: Promise<{ userId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  let body: { startDate?: string | null; endDate?: string | null; label?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const update =
      body.startDate === null && body.endDate === null
        ? { $unset: { accompaniment: "" } }
        : {
            $set: {
              accompaniment: {
                startDate: body.startDate ?? null,
                endDate: body.endDate ?? null,
                label: body.label ?? "Accompagnement",
              },
            },
          };

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, update);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
