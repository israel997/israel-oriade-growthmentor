import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function createNotification({
  title,
  message,
  type,
  link,
}: {
  title: string;
  message: string;
  type: "diagnostic" | "test" | "formation" | "blog" | "badge";
  link?: string;
}) {
  try {
    const client = await clientPromise;
    await client.db().collection("notifications").insertOne({
      _id: new ObjectId(),
      title,
      message,
      type,
      link: link ?? null,
      date: new Date().toISOString(),
      readBy: [],
    });
  } catch {}
}
