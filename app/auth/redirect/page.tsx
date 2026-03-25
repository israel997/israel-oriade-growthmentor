import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion");
  }

  const role = (session.user as { role?: string }).role;

  if (role === "admin") {
    redirect("/admin");
  }

  redirect("/espace-membre");
}
