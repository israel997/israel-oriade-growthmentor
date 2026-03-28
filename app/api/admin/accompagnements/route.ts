import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const docs = await db.collection("accompagnements").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined })));
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, programme, startDate, endDate } = body;
    if (!nom || !programme || !startDate || !endDate)
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("accompagnements").insertOne({
      nom, programme, startDate, endDate, planning: [], createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
