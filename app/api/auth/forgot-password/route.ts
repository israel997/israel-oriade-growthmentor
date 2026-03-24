import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const baseUrl = process.env.NEXTAUTH_URL ?? `https://${process.env.VERCEL_URL}`;
    const resetUrl = `${baseUrl}/reinitialiser-mot-de-passe/${token}`;

    await resend.emails.send({
      from: "GrowthMentor <onboarding@resend.dev>",
      to: user.email,
      subject: "Réinitialisation de ton mot de passe",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#03071A;color:white;border-radius:16px;">
          <h2 style="color:white;margin-bottom:8px;">Growth<span style="color:#F5C200">Mentor</span></h2>
          <p style="color:rgba(255,255,255,0.7);margin-bottom:24px;">Tu as demandé à réinitialiser ton mot de passe.</p>
          <a href="${resetUrl}"
            style="display:inline-block;background:linear-gradient(135deg,#1A3FD8,#3B82F6);color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:bold;font-size:15px;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:24px;">Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
