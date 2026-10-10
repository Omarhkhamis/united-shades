import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { MessagesList } from "@/components/dashboard/MessagesList";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "بيانات اتصل بنا" };

const fmt = new Intl.DateTimeFormat("ar-SA-u-nu-latn", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" });

export default async function MessagesPage() {
  await requireAdmin();
  const rows = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).limit(500);
  const messages = rows.map(({ createdAt, ...m }) => ({ ...m, date: fmt.format(createdAt) }));
  return <MessagesList messages={messages} />;
}
