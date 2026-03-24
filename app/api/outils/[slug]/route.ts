import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const client = await clientPromise;
    const col = client.db().collection("outils");
    const item = await col.findOne(ObjectId.isValid(slug) ? { $or: [{ slug }, { _id: new ObjectId(slug) }] } : { slug });
    if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const { _id, ...update } = body;
    void _id;
    const client = await clientPromise;
    const col = client.db().collection("outils");
    await col.updateOne(
      ObjectId.isValid(slug) ? { $or: [{ slug }, { _id: new ObjectId(slug) }] } : { slug },
      { $set: update }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const client = await clientPromise;
    const col = client.db().collection("outils");
    await col.deleteOne(ObjectId.isValid(slug) ? { $or: [{ slug }, { _id: new ObjectId(slug) }] } : { slug });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
