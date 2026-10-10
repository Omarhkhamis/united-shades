import type { Metadata } from "next";
import { ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { sectionIcons } from "@/components/dashboard/icons";
import { db, schema } from "@/db";
import { editorSchema } from "@/content/editor-schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "الرئيسية" };

const fmt = new Intl.DateTimeFormat("ar-SA-u-nu-latn", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" });

export default async function DashboardHome() {
  await requireAdmin();
  const rows = await db.select({ key: schema.siteSections.key, updatedAt: schema.siteSections.updatedAt }).from(schema.siteSections);
  const updated = new Map(rows.map((r) => [r.key, r.updatedAt]));

  return (
    <div className="editor">
      <header className="editor__bar">
        <div>
          <h1 className="editor__title">أهلاً بك 👋</h1>
          <p className="editor__desc">اختر القسم الذي تريد تعديله من القائمة الجانبية أو من البطاقات أدناه. أي تعديل تحفظه يظهر مباشرة على الموقع.</p>
        </div>
        <div className="editor__actions">
          <a className="btn btn--ghost" href="/" target="_blank" rel="noopener"><ExternalLink size={16} /> عرض الموقع</a>
        </div>
      </header>

      <div className="tiles">
        {editorSchema.map((s) => {
          const Icon = sectionIcons[s.icon];
          const at = updated.get(s.key);
          return (
            <Link key={s.key} href={`/dashboard/${s.key}`} className="tile">
              <span className="tile__icon"><Icon size={20} /></span>
              <span className="tile__body">
                <b>{s.title}</b>
                <small>{s.description}</small>
                {at && <small className="tile__date">آخر تعديل: {fmt.format(at)}</small>}
              </span>
              <ChevronLeft size={18} className="tile__chev" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
