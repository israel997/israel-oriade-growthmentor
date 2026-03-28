import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();

  await db.collection("accompagnements").updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  await db.collection("accompagnements").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
