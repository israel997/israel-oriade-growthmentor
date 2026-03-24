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
    const filter = ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id };

    if (read) {
      await col.updateOne(filter, { $addToSet: { readBy: session.user.id } });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await col.updateOne(filter, { $pull: { readBy: session.user.id } } as any);
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
    await col.deleteOne(ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
