import { count, eq } from "drizzle-orm";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { db, schema } from "@/db";
import { editorSchema } from "@/content/editor-schema";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [{ unread }] = await db
    .select({ unread: count() })
    .from(schema.contactMessages)
    .where(eq(schema.contactMessages.isRead, false));

  // contact-form submissions sit right under the "اتصل بنا" section
  type Item = { key: string; title: string; icon: string; badge?: number };
  const items = editorSchema.flatMap(({ key, title, icon }): Item[] =>
    key === "contact"
      ? [{ key, title, icon }, { key: "messages", title: "بيانات اتصل بنا", icon: "messages", badge: unread }]
      : [{ key, title, icon }],
  );

  return (
    <div className="shell">
      <Sidebar items={items} email={session.email} />
      <main className="main">{children}</main>
    </div>
  );
}
