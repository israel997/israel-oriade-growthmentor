import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const client = await clientPromise;
  const doc = await client.db().collection("user_tools").findOne({ userId: session.user.id });

  return NextResponse.json({ pinned: doc?.pinned ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { pinned } = await req.json() as { pinned: string[] };
  if (!Array.isArray(pinned)) return NextResponse.json({ error: "Format invalide" }, { status: 400 });

  const client = await clientPromise;
  await client.db().collection("user_tools").updateOne(
    { userId: session.user.id },
    {
      $set: { pinned, updatedAt: new Date() },
      $setOnInsert: { userId: session.user.id, createdAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, pinned });
}
