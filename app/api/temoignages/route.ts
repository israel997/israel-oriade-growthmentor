import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db().collection("temoignages");
    const items = await col.find({}).toArray();
    return NextResponse.json(items.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() })));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, _id, ...data } = body;
    void id; void _id;
    const client = await clientPromise;
    const col = client.db().collection("temoignages");
    await col.insertOne(data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, _id, ...update } = body;
    void _id;
    if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });
    const client = await clientPromise;
    const col = client.db().collection("temoignages");
    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });
    const client = await clientPromise;
    const col = client.db().collection("temoignages");
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
