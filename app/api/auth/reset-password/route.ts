import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const SPECIAL_RE = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Données manquantes." }, { status: 400 });

    if (password.length < 8) return NextResponse.json({ error: "Mot de passe trop court." }, { status: 400 });
    if (!SPECIAL_RE.test(password)) return NextResponse.json({ error: "Le mot de passe doit contenir au moins un caractère spécial." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const record = await db.collection("password_reset_tokens").findOne({ token });

    if (!record) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
    if (new Date() > new Date(record.expiresAt)) {
      await db.collection("password_reset_tokens").deleteOne({ token });
      return NextResponse.json({ error: "Ce lien a expiré. Fais une nouvelle demande." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.collection("users").updateOne(
      { email: record.email },
      { $set: { password: hashed } }
    );
    await db.collection("password_reset_tokens").deleteOne({ token });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
