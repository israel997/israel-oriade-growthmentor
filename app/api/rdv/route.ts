import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db().collection("rdv");
    const items = await col.find({}).sort({ date: 1, heure: 1 }).toArray();
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
    const col = client.db().collection("rdv");
    const result = await col.insertOne(data);
    return NextResponse.json({ ok: true, id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
