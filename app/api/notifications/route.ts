import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  try {
    const client = await clientPromise;
    const col = client.db().collection("notifications");
    const items = await col.find({}).sort({ date: -1 }).toArray();
    // Attach read status per user
    const result = items.map((n) => ({
      ...n,
      read: userId ? (n.readBy ?? []).includes(userId) : true,
    }));
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db().collection("notifications");
    const result = await col.insertOne({ ...body, readBy: [], _id: new ObjectId() });
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
