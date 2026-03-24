import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db().collection("blog");
    const items = await col.find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(items.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() })));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("blog");
    await col.insertOne(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
