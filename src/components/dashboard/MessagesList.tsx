"use client";

import { CheckCheck, Inbox, Mail, MailOpen, MapPin, Phone, Search, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { deleteMessage, markAllMessagesRead, setMessageRead } from "@/app/(admin)/dashboard/actions";
import { confirmAction, notify } from "@/lib/alerts";

type Message = { id: number; name: string; phone: string; service: string; city: string; message: string; isRead: boolean; date: string };

/** Saudi numbers typed as 05xxxxxxxx / 5xxxxxxxx → 9665xxxxxxxx for wa.me */
function waNumber(phone: string) {
  let d = phone.replace(/[^\d]/g, "").replace(/^00/, "");
  if (d.startsWith("05") && d.length === 10) d = "966" + d.slice(1);
  else if (d.startsWith("5") && d.length === 9) d = "966" + d;
  return d;
}

export function MessagesList({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const unread = messages.filter((m) => !m.isRead).length;

  const shown = useMemo(() => {
    const q = query.trim();
    return messages.filter(
      (m) =>
        (filter === "all" || !m.isRead) &&
        (!q || [m.name, m.phone, m.service, m.city, m.message].some((v) => v.includes(q))),
    );
  }, [messages, filter, query]);

  const toggleRead = (m: Message) => startTransition(async () => { await setMessageRead(m.id, !m.isRead); });

  const remove = async (m: Message) => {
    const ok = await confirmAction({ title: "حذف الرسالة؟", text: `سيتم حذف طلب «${m.name}» نهائياً.`, confirmText: "حذف", danger: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteMessage(m.id);
      notify(res.ok ? "success" : "error", res.ok ? res.message ?? "تم الحذف" : res.error);
    });
  };

  const readAll = async () => {
    const ok = await confirmAction({ title: "تحديد الكل كمقروء؟", text: `${unread} رسالة غير مقروءة.`, confirmText: "نعم" });
    if (!ok) return;
    startTransition(async () => {
      const res = await markAllMessagesRead();
      notify(res.ok ? "success" : "error", res.ok ? res.message ?? "تم" : res.error);
    });
  };

  return (
    <div className="editor">
      <header className="editor__bar">
        <div>
          <h1 className="editor__title">بيانات اتصل بنا</h1>
          <p className="editor__desc">كل طلب يُرسَل من نموذج «اطلب عرض سعر» في الموقع يُحفظ هنا، إضافةً إلى فتح المحادثة على واتساب.</p>
        </div>
        <div className="editor__actions">
          <button type="button" className="btn btn--ghost" onClick={readAll} disabled={!unread || pending}>
            <CheckCheck size={16} /> <span className="hide-sm">تحديد الكل كمقروء</span>
          </button>
        </div>
      </header>

      <div className="msgbar">
        <div className="seg" role="tablist" aria-label="تصفية الرسائل">
          <button role="tab" aria-selected={filter === "all"} className={filter === "all" ? "is-on" : ""} onClick={() => setFilter("all")}>
            الكل <em>{messages.length}</em>
          </button>
          <button role="tab" aria-selected={filter === "unread"} className={filter === "unread" ? "is-on" : ""} onClick={() => setFilter("unread")}>
            غير مقروءة <em>{unread}</em>
          </button>
        </div>
        <label className="msgsearch">
          <Search size={16} />
          <input className="input" placeholder="بحث بالاسم أو الجوال أو الخدمة…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="card empty">
          <Inbox size={36} />
          <p>{messages.length === 0 ? "لا توجد رسائل بعد. ستظهر هنا الطلبات المرسلة من نموذج الموقع." : "لا توجد رسائل مطابقة."}</p>
        </div>
      ) : (
        <div className="msgs" aria-busy={pending}>
          {shown.map((m) => (
            <article key={m.id} className={"msg" + (m.isRead ? "" : " is-unread")}>
              <header className="msg__head">
                <div className="msg__who">
                  {!m.isRead && <span className="msg__dot" aria-label="غير مقروءة" />}
                  <b>{m.name}</b>
                  <span className="msg__service">{m.service}</span>
                </div>
                <time className="msg__date">{m.date}</time>
              </header>

              <div className="msg__meta">
                <a href={`tel:${m.phone}`} dir="ltr"><Phone size={15} /> {m.phone}</a>
                {m.city && <span><MapPin size={15} /> {m.city}</span>}
              </div>
              {m.message && <p className="msg__text">{m.message}</p>}

              <footer className="msg__actions">
                <a className="btn btn--wa-sm" href={`https://wa.me/${waNumber(m.phone)}`} target="_blank" rel="noopener">واتساب</a>
                <a className="btn btn--ghost" href={`tel:${m.phone}`}><Phone size={15} /> اتصال</a>
                <button type="button" className="btn btn--ghost" onClick={() => toggleRead(m)} disabled={pending}>
                  {m.isRead ? <><Mail size={15} /> تحديد كغير مقروءة</> : <><MailOpen size={15} /> تحديد كمقروءة</>}
                </button>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(m)} disabled={pending} aria-label="حذف" title="حذف"><Trash2 size={15} /></button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
