import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const users = await client
      .db()
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      users.map(({ _id, ...u }) => ({
        id: _id.toString(),
        name: u.name ?? "",
        email: u.email ?? "",
        image: u.image ?? null,
        method: u.emailVerified !== undefined ? "Email" : "Google",
        joinedAt: u.createdAt
          ? new Date(u.createdAt).toISOString().split("T")[0]
          : new Date(_id.getTimestamp?.() ?? Date.now()).toISOString().split("T")[0],
        revoked: u.revoked ?? false,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
