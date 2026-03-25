import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const users = await db
      .collection("users")
      .find({}, { projection: { name: 1, email: 1, accompaniment: 1 } })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name ?? u.email,
        email: u.email,
        accompaniment: u.accompaniment ?? null,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
