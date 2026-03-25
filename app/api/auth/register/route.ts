import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, pays, whatsapp } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Mot de passe trop court (8 caractères minimum)." }, { status: 400 });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins un caractère spécial." }, { status: 400 });
    }

    const client = await clientPromise;
    const users = client.db().collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await users.insertOne({
      name,
      email,
      password: hashed,
      emailVerified: null,
      image: null,
      role: "user",
      pays: pays ?? null,
      whatsapp: whatsapp ?? null,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
