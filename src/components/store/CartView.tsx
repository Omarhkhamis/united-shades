"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, cartTotal, MAX_METERS, sar, useCart, useHydrated, type CartItem } from "./cart";

const Ico = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <use href={`#i-${id}`} />
  </svg>
);

function MetersInput({ item }: { item: CartItem }) {
  // local draft so the field can be cleared while typing
  const [draft, setDraft] = useState<string | null>(null);
  const commit = (v: string) => {
    const n = parseInt(v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))), 10);
    cart.setMeters(item.id, Number.isFinite(n) ? n : item.meters);
    setDraft(null);
  };
  return (
    <div className="qty" role="group" aria-label={`عدد الأمتار — ${item.title}`}>
      <button type="button" className="qty__btn" onClick={() => cart.setMeters(item.id, item.meters + 1)} disabled={item.meters >= MAX_METERS} aria-label="زيادة متر">
        <Ico id="plus" />
      </button>
      <input
        className="qty__input"
        inputMode="numeric"
        value={draft ?? String(item.meters)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        aria-label="عدد الأمتار"
      />
      <button type="button" className="qty__btn" onClick={() => cart.setMeters(item.id, item.meters - 1)} disabled={item.meters <= 1} aria-label="إنقاص متر">
        <Ico id="minus" />
      </button>
    </div>
  );
}

export function CartView() {
  const items = useCart();
  const hydrated = useHydrated();

  if (!hydrated) return <div className="store__loading" aria-busy="true">جارٍ تحميل السلة…</div>;

  if (items.length === 0) {
    return (
      <div className="empty">
        <span className="empty__ico"><Ico id="bag" /></span>
        <h2>سلتك فارغة</h2>
        <p>اختر نوع المظلة المناسب من قسم الأسعار وأضفه إلى السلة.</p>
        <Link href="/#shop" className="btn btn--primary">تصفّح الأسعار</Link>
      </div>
    );
  }

  const total = cartTotal(items);
  const meters = items.reduce((n, i) => n + i.meters, 0);

  return (
    <div className="store__grid">
      <section className="cartlist" aria-label="المنتجات في السلة">
        <div className="cartlist__head">
          <span>{items.length} {items.length === 1 ? "منتج" : "منتجات"}</span>
          <button type="button" className="linkbtn" onClick={() => cart.clear()}>إفراغ السلة</button>
        </div>
        <ul className="cartlist__rows">
          {items.map((item) => (
            <li className="cline" key={item.id}>
              <img className="cline__img" src={item.image} alt={item.title} />
              <div className="cline__info">
                <h3>{item.title}</h3>
                <p className="cline__unit">يبدأ من <b>{sar(item.unitPrice)}</b> ريال للمتر</p>
                <button type="button" className="cline__remove" onClick={() => cart.remove(item.id)}>
                  <Ico id="trash" /> حذف
                </button>
              </div>
              <div className="cline__qty">
                <small>عدد الأمتار</small>
                <MetersInput item={item} />
              </div>
              <div className="cline__total">
                <small>التكلفة التقديرية</small>
                <strong>{sar(item.unitPrice * item.meters)} <span>ريال</span></strong>
              </div>
            </li>
          ))}
        </ul>
        <p className="cartlist__hint">عدّل عدد الأمتار حسب المساحة التي تريد تظليلها — سنتأكد من المقاسات أثناء المعاينة.</p>
      </section>

      <aside className="summary" aria-label="ملخص الطلب">
        <h2>ملخص الطلب</h2>
        <dl>
          <div><dt>إجمالي الأمتار</dt><dd>{sar(meters)} م</dd></div>
          <div><dt>المجموع التقديري</dt><dd>{sar(total)} ريال</dd></div>
          <div><dt>المعاينة ورفع المقاسات</dt><dd className="is-free">مجانية داخل الرياض</dd></div>
        </dl>
        <div className="summary__total">
          <span>الإجمالي التقديري <small>(يبدأ من)</small></span>
          <strong>{sar(total)} <span>ريال</span></strong>
        </div>
        <Link href="/checkout" className="btn btn--primary btn--block">
          متابعة الطلب <Ico id="arrow" className="ico" />
        </Link>
        <Link href="/#shop" className="summary__back">إضافة أنواع أخرى</Link>
        <p className="summary__note"><Ico id="lock" /> الأسعار تقديرية حسب السعر الأدنى للمتر، ويُحدَّد السعر النهائي بعد المعاينة. لن يتم خصم أي مبلغ الآن.</p>
      </aside>
    </div>
  );
}
