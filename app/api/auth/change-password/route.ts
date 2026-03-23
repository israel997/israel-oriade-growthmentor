import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Mot de passe trop court." }, { status: 400 });
    }

    const client = await clientPromise;
    const user = await client.db().collection("users").findOne({ email: session.user.email });

    if (!user?.password) {
      return NextResponse.json({ error: "Compte Google — pas de mot de passe à modifier." }, { status: 400 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await client.db().collection("users").updateOne(
      { email: session.user.email },
      { $set: { password: hashed } }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
