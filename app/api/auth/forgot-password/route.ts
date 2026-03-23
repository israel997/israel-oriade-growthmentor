import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email manquant." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email: email.trim().toLowerCase() });

    // Always return success (security: don't reveal if email exists)
    if (!user) return NextResponse.json({ ok: true });

    // Generate token valid 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.collection("password_reset_tokens").updateOne(
      { userId: user._id.toString() },
      { $set: { token, expiresAt, email: user.email } },
      { upsert: true }
    );

    // In production: send email with reset link
    // For now, return the token so the UI can show the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reinitialiser-mot-de-passe/${token}`;
    return NextResponse.json({ ok: true, resetUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
