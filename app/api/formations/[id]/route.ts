import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const col = client.db().collection("formations");
    const item = await col.findOne(ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });
    if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("formations");
    const { _id, ...update } = body;
    void _id;
    await col.updateOne(
      ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id },
      { $set: update }
    );
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
    const col = client.db().collection("formations");
    await col.deleteOne(ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
