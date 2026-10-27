"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { loadOrder, sar, useHydrated, type PlacedOrder } from "./cart";

const Ico = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <use href={`#i-${id}`} />
  </svg>
);

const NEXT_STEPS = [
  { title: "مراجعة الطلب", text: "يراجع فريقنا طلبك ويتواصل معك خلال ساعات العمل." },
  { title: "المعاينة ورفع المقاسات", text: "نزور الموقع في الموعد المناسب لك ونقترح الحل الأنسب." },
  { title: "عرض السعر النهائي", text: "نرسل لك السعر النهائي ورابط الدفع حسب الطريقة التي اخترتها." },
  { title: "التصنيع والتركيب", text: "نبدأ التنفيذ ونسلّمك المشروع حسب الجدول المتفق عليه." },
];

export function DoneView({ whatsapp }: { whatsapp: string }) {
  const hydrated = useHydrated();
  const order: PlacedOrder | null = useSyncExternalStore(() => () => {}, loadOrder, () => null);

  if (!hydrated) return <div className="store__loading" aria-busy="true">جارٍ التحميل…</div>;

  if (!order) {
    return (
      <div className="empty">
        <span className="empty__ico"><Ico id="bag" /></span>
        <h2>لا يوجد طلب لعرضه</h2>
        <p>يبدو أنك فتحت هذه الصفحة مباشرة. يمكنك بدء طلب جديد من قسم الأسعار.</p>
        <Link href="/#shop" className="btn btn--primary">تصفّح الأسعار</Link>
      </div>
    );
  }

  const waText = [
    `السلام عليكم، أتابع طلبي رقم ${order.number}`,
    ...order.items.map((i) => `• ${i.title} — ${i.meters} م`),
    `الإجمالي التقديري: ${sar(order.total)} ريال`,
  ].join("\n");
  const placed = new Date(order.createdAt);

  return (
    <div className="done">
      <section className="done__hero">
        <svg className="done__check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="m15 27 7 7 15-15" />
        </svg>
        <h2>تم استلام طلبك بنجاح</h2>
        <p>شكراً {order.customer.name}، سيتواصل معك فريق المتحدة للمظلات على الرقم <b dir="ltr">{order.customer.phone}</b> لتأكيد التفاصيل.</p>
        <div className="done__number">
          <small>رقم الطلب</small>
          <strong dir="ltr">{order.number}</strong>
        </div>
        <p className="done__nocharge"><Ico id="lock" /> لم يتم خصم أي مبلغ — الدفع يتم بعد تأكيد السعر النهائي.</p>
      </section>

      <div className="store__grid done__grid">
        <section className="cbox">
          <h3 className="cbox__title">ماذا يحدث الآن؟</h3>
          <ol className="timeline">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className={i === 0 ? "is-current" : undefined}>
                <span className="timeline__dot">{i + 1}</span>
                <div><b>{s.title}</b><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="summary">
          <h2>ملخص الطلب</h2>
          <ul className="summary__items">
            {order.items.map((i) => (
              <li key={i.id}>
                <img src={i.image} alt="" />
                <span><b>{i.title}</b><small>{sar(i.meters)} م × {sar(i.unitPrice)} ريال</small></span>
                <em>{sar(i.unitPrice * i.meters)}</em>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>تاريخ الطلب</dt><dd>{placed.toLocaleDateString("ar-SA-u-nu-latn", { dateStyle: "medium" })}</dd></div>
            <div><dt>الموقع</dt><dd>{order.customer.city} — {order.customer.district}</dd></div>
            {order.customer.date && <div><dt>موعد المعاينة المفضل</dt><dd>{order.customer.date} · {order.customer.slot}</dd></div>}
            <div><dt>طريقة الدفع</dt><dd>{order.payment}</dd></div>
          </dl>
          <div className="summary__total">
            <span>الإجمالي التقديري <small>(يبدأ من)</small></span>
            <strong>{sar(order.total)} <span>ريال</span></strong>
          </div>
          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener" className="btn btn--wa btn--block">
            <Ico id="wa" className="ico" /> تابع طلبك عبر واتساب
          </a>
          <Link href="/" className="summary__back">العودة إلى الرئيسية</Link>
        </aside>
      </div>
    </div>
  );
}
