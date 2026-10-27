"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { cart, cartTotal, saveOrder, sar, useCart, useHydrated, type PlacedOrder } from "./cart";

const Ico = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <use href={`#i-${id}`} />
  </svg>
);

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "القصيم", "أبها", "تبوك", "حائل", "الجوف", "جازان", "أخرى"];
const SLOTS = ["صباحاً (8 – 12)", "ظهراً (12 – 4)", "مساءً (4 – 9)"];

export const PAYMENTS = [
  { id: "card", label: "مدى / بطاقة ائتمانية", icon: "card", note: "سنرسل لك رابط دفع آمن بعد تأكيد السعر النهائي." },
  { id: "applepay", label: "Apple Pay", icon: "card", note: "يصلك رابط الدفع عبر Apple Pay بعد تأكيد السعر." },
  { id: "tabby", label: "تابي — تقسيط", icon: "tabby", note: "نرسل لك رابط التقسيط عبر تابي بعد تأكيد السعر." },
  { id: "tamara", label: "تمارا — تقسيط", icon: "tamara", note: "نرسل لك رابط التقسيط عبر تمارا بعد تأكيد السعر." },
  { id: "transfer", label: "تحويل بنكي", icon: "bank", note: "نرسل لك بيانات الحساب البنكي مع عرض السعر النهائي." },
] as const;

type Form = {
  name: string; phone: string; email: string; city: string; district: string; address: string;
  property: string; date: string; slot: string; payment: string; notes: string; agree: boolean; website: string;
};

const toLatin = (v: string) => v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
const normPhone = (v: string) => toLatin(v).replace(/[\s-]/g, "");
const PHONE_RE = /^(05\d{8}|(\+|00)?9665\d{8})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 3) e.name = "اكتب الاسم الكامل";
  if (!PHONE_RE.test(normPhone(f.phone))) e.phone = "رقم جوال سعودي صحيح، مثال: 0551234567";
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = "البريد الإلكتروني غير صحيح";
  if (!f.city) e.city = "اختر المدينة";
  if (f.district.trim().length < 2) e.district = "اكتب اسم الحي";
  if (f.date && f.date < tomorrow()) e.date = "اختر تاريخاً من الغد فصاعداً";
  if (!f.payment) e.payment = "اختر طريقة الدفع";
  if (!f.agree) e.agree = "يلزم الموافقة للمتابعة";
  return e;
}

const orderNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `US-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export function CheckoutView() {
  const router = useRouter();
  const items = useCart();
  const hydrated = useHydrated();
  const formRef = useRef<HTMLFormElement>(null);
  const [f, setF] = useState<Form>({
    name: "", phone: "", email: "", city: "الرياض", district: "", address: "",
    property: "منزل / فيلا", date: "", slot: SLOTS[0], payment: "", notes: "", agree: false, website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [stage, setStage] = useState<"idle" | "processing" | "confirming">("idle");
  const total = useMemo(() => cartTotal(items), [items]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (submitted) setErrors(validate(next));
  };

  if (!hydrated) return <div className="store__loading" aria-busy="true">جارٍ التحميل…</div>;

  if (items.length === 0 && stage === "idle") {
    return (
      <div className="empty">
        <span className="empty__ico"><Ico id="bag" /></span>
        <h2>لا توجد منتجات للطلب</h2>
        <p>أضف نوع المظلة المناسب إلى السلة أولاً، ثم أكمل بيانات الطلب.</p>
        <Link href="/#shop" className="btn btn--primary">تصفّح الأسعار</Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      // jump to the first problem
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus({ preventScroll: true });
      return;
    }

    const payment = PAYMENTS.find((p) => p.id === f.payment)!;
    const order: PlacedOrder = {
      number: orderNumber(),
      createdAt: new Date().toISOString(),
      items,
      total,
      customer: { name: f.name.trim(), phone: normPhone(f.phone), city: f.city, district: f.district.trim(), date: f.date, slot: f.slot },
      payment: payment.label,
    };

    // keep a copy in the dashboard as a quote request (no payment is taken)
    const lines = items.map((i) => `• ${i.title}: ${i.meters} م × ${i.unitPrice} = ${sar(i.unitPrice * i.meters)} ريال`).join("\n");
    const msg = [
      `طلب من المتجر رقم ${order.number}`,
      lines,
      `الإجمالي التقديري: ${sar(total)} ريال`,
      `طريقة الدفع المفضلة: ${payment.label}`,
      `نوع العقار: ${f.property}`,
      f.date && `موعد المعاينة المفضل: ${f.date} — ${f.slot}`,
      f.email.trim() && `البريد: ${f.email.trim()}`,
      f.address.trim() && `العنوان: ${f.address.trim()}`,
      f.notes.trim() && `ملاحظات: ${f.notes.trim()}`,
    ].filter(Boolean).join("\n");
    const sent = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: order.customer.name, phone: order.customer.phone, type: "طلب من المتجر", city: `${f.city} — ${f.district.trim()}`, msg, website: f.website }),
      keepalive: true,
    }).catch(() => {});

    // simulated payment-provider round trip
    setStage("processing");
    setTimeout(() => setStage("confirming"), 1300);
    setTimeout(async () => {
      await Promise.race([sent, new Promise((r) => setTimeout(r, 1500))]);
      saveOrder(order);
      cart.clear();
      router.push("/checkout/done");
    }, 2400);
  };

  const err = (k: keyof Form) => (errors[k] ? <span className="ferr" id={`err-${k}`}>{errors[k]}</span> : null);
  const aria = (k: keyof Form) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined });

  return (
    <form className="store__grid checkout" onSubmit={onSubmit} noValidate ref={formRef}>
      <div className="checkout__main">
        <fieldset className="cbox">
          <legend><span className="cbox__n">1</span> بيانات التواصل</legend>
          <div className="cbox__grid">
            <label className="sfield">
              <span>الاسم الكامل *</span>
              <input value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" {...aria("name")} />
              {err("name")}
            </label>
            <label className="sfield">
              <span>رقم الجوال *</span>
              <input value={f.phone} onChange={(e) => set("phone", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="05XXXXXXXX" dir="ltr" {...aria("phone")} />
              {err("phone")}
            </label>
            <label className="sfield sfield--full">
              <span>البريد الإلكتروني <small>(اختياري)</small></span>
              <input value={f.email} onChange={(e) => set("email", e.target.value)} inputMode="email" autoComplete="email" dir="ltr" {...aria("email")} />
              {err("email")}
            </label>
          </div>
        </fieldset>

        <fieldset className="cbox">
          <legend><span className="cbox__n">2</span> موقع التركيب والمعاينة</legend>
          <div className="cbox__grid">
            <label className="sfield">
              <span>المدينة *</span>
              <select value={f.city} onChange={(e) => set("city", e.target.value)} {...aria("city")}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {err("city")}
            </label>
            <label className="sfield">
              <span>الحي *</span>
              <input value={f.district} onChange={(e) => set("district", e.target.value)} {...aria("district")} />
              {err("district")}
            </label>
            <label className="sfield sfield--full">
              <span>وصف الموقع أو العنوان <small>(اختياري)</small></span>
              <input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="الشارع، رقم المبنى، أو رابط الموقع على الخريطة" autoComplete="street-address" />
            </label>
            <div className="sfield sfield--full">
              <span>نوع العقار</span>
              <div className="chips" role="radiogroup" aria-label="نوع العقار">
                {["منزل / فيلا", "منشأة تجارية", "جهة حكومية", "استراحة / مزرعة"].map((p) => (
                  <label key={p} className={"chip" + (f.property === p ? " is-on" : "")}>
                    <input type="radio" name="property" value={p} checked={f.property === p} onChange={() => set("property", p)} />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <label className="sfield">
              <span>موعد المعاينة المفضل <small>(اختياري)</small></span>
              <input type="date" value={f.date} min={tomorrow()} onChange={(e) => set("date", e.target.value)} dir="ltr" {...aria("date")} />
              {err("date")}
            </label>
            <label className="sfield">
              <span>الوقت المناسب</span>
              <select value={f.slot} onChange={(e) => set("slot", e.target.value)}>
                {SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className="cbox">
          <legend><span className="cbox__n">3</span> طريقة الدفع</legend>
          <p className="cbox__hint"><Ico id="lock" /> لن يُطلب منك إدخال بيانات البطاقة هنا — الدفع يتم لاحقاً عبر رابط آمن بعد تأكيد السعر النهائي.</p>
          <div className="pays" role="radiogroup" aria-label="طريقة الدفع" {...aria("payment")} tabIndex={errors.payment ? -1 : undefined}>
            {PAYMENTS.map((p) => (
              <label key={p.id} className={"pay" + (f.payment === p.id ? " is-on" : "")}>
                <input type="radio" name="payment" value={p.id} checked={f.payment === p.id} onChange={() => set("payment", p.id)} />
                <span className="pay__radio" aria-hidden="true" />
                <span className={"pay__logo pay__logo--" + p.id}>
                  {p.id === "tabby" ? "tabby" : p.id === "tamara" ? "tamara" : p.id === "applepay" ? " Pay" : <Ico id={p.icon} />}
                </span>
                <span className="pay__text">
                  <b>{p.label}</b>
                  {f.payment === p.id && <small>{p.note}</small>}
                </span>
              </label>
            ))}
          </div>
          {err("payment")}
        </fieldset>

        <fieldset className="cbox">
          <legend><span className="cbox__n">4</span> ملاحظات إضافية</legend>
          <label className="sfield sfield--full">
            <span className="sr-only">ملاحظات</span>
            <textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="مثال: عدد السيارات، لون القماش المفضل، أي تفاصيل تساعدنا…" />
          </label>
          {/* honeypot — hidden from people */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform__trap" value={f.website} onChange={(e) => set("website", e.target.value)} />
        </fieldset>
      </div>

      <aside className="summary" aria-label="ملخص الطلب">
        <h2>طلبك</h2>
        <ul className="summary__items">
          {items.map((i) => (
            <li key={i.id}>
              <img src={i.image} alt="" />
              <span><b>{i.title}</b><small>{sar(i.meters)} م × {sar(i.unitPrice)} ريال</small></span>
              <em>{sar(i.unitPrice * i.meters)}</em>
            </li>
          ))}
        </ul>
        <Link href="/cart" className="summary__edit">تعديل السلة</Link>
        <dl>
          <div><dt>المجموع التقديري</dt><dd>{sar(total)} ريال</dd></div>
          <div><dt>المعاينة ورفع المقاسات</dt><dd className="is-free">مجانية داخل الرياض</dd></div>
        </dl>
        <div className="summary__total">
          <span>الإجمالي التقديري <small>(يبدأ من)</small></span>
          <strong>{sar(total)} <span>ريال</span></strong>
        </div>

        <label className={"agree" + (errors.agree ? " is-invalid" : "")}>
          <input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} {...aria("agree")} />
          <span>أفهم أن الأسعار تقديرية وأن السعر النهائي يُحدَّد بعد المعاينة ورفع المقاسات.</span>
        </label>
        {err("agree")}

        <button type="submit" className="btn btn--primary btn--block checkout__submit" disabled={stage !== "idle"}>
          {stage === "idle" ? (<><Ico id="lock" className="ico" /> تأكيد الطلب</>) : (<><span className="spinner" aria-hidden="true" /> {stage === "processing" ? "جاري معالجة الطلب…" : "جاري تأكيد الطلب…"}</>)}
        </button>
        <p className="summary__note">لن يتم خصم أي مبلغ الآن — سيتواصل معك فريقنا لتأكيد التفاصيل والسعر النهائي.</p>
      </aside>

      {stage !== "idle" && (
        <div className="processing" role="status" aria-live="polite">
          <div className="processing__card">
            <span className="spinner spinner--lg" aria-hidden="true" />
            <b>{stage === "processing" ? "جاري معالجة طلبك" : "جاري تأكيد الطلب"}</b>
            <small>لحظات من فضلك…</small>
          </div>
        </div>
      )}
    </form>
  );
}
