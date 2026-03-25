import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const client = await clientPromise;
        const user = await client
          .db()
          .collection("users")
          .findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign-in: assign role from DB (or auto-assign admin)
      if (user && user.id) {
        token.id = user.id;
        const client = await clientPromise;

        // ADMIN_EMAIL always wins, regardless of what's stored in DB
        if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
          await client.db().collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { role: "admin" } }
          );
          token.role = "admin";
        } else {
          const dbUser = await client.db().collection("users").findOne(
            { _id: new ObjectId(user.id) },
            { projection: { role: 1, name: 1 } }
          );
          token.role = dbUser?.role ?? "user";
        }
      }

      // On session update: reload name from DB
      if (trigger === "update" && token.id) {
        const client = await clientPromise;
        const dbUser = await client.db().collection("users").findOne(
          { _id: new ObjectId(token.id as string) },
          { projection: { name: 1 } }
        );
        if (dbUser?.name) token.name = dbUser.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id)   session.user.id   = token.id   as string;
      if (token?.name) session.user.name = token.name as string;
      if (token?.role) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: { signIn: "/connexion" },
});
