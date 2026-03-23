import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const col = client.db().collection("user_data");
    const doc = await col.findOne({ userId: session.user.id });
    return NextResponse.json(doc?.data ?? {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("user_data");

    // Merge patch: only update the provided keys inside data
    const setOps: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      setOps[`data.${key}`] = value;
    }

    await col.updateOne(
      { userId: session.user.id },
      { $set: setOps },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
