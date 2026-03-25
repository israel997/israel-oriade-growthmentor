import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (typeof body.revoked === "boolean") update.revoked = body.revoked;
    if (body.role && ["user", "admin", "assist"].includes(body.role)) update.role = body.role;
    const client = await clientPromise;
    await client
      .db()
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
