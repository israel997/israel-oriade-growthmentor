import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const client = await clientPromise;
    const col = client.db().collection("blog");
    const item = await col.findOne({ slug });
    if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    const { _id, ...rest } = item;
    return NextResponse.json({ ...rest, id: _id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const { _id, id, ...update } = body;
    void _id; void id;
    const client = await clientPromise;
    const col = client.db().collection("blog");
    await col.updateOne({ slug }, { $set: update });
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
    const col = client.db().collection("blog");
    await col.deleteOne({ slug });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
