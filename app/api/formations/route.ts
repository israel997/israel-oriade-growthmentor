import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db().collection("formations");
    const items = await col.find({}).sort({ _id: 1 }).toArray();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("formations");
    const result = await col.insertOne({ ...body, _id: new ObjectId() });
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
