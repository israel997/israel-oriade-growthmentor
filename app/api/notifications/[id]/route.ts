import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { read } = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("notifications");
    const filter = { $or: [{ id }, { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }] };

    if (read) {
      await col.updateOne(filter, { $addToSet: { readBy: session.user.id } });
    } else {
      await col.updateOne(filter, { $pull: { readBy: session.user.id } });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const col = client.db().collection("notifications");
    await col.deleteOne({ $or: [{ id }, { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }] });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
