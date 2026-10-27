import Link from "next/link";
import { getContent } from "@/content/get-content";
import { Footer, Header, Ico, wa } from "@/components/site/Site";
import { IconSprite } from "@/components/site/IconSprite";
import { StoreChrome } from "./StoreChrome";

const STEPS = ["السلة", "بيانات الطلب", "تأكيد الطلب"];

/** Header, footer and step indicator shared by the cart / checkout / confirmation pages. */
export async function StoreShell({ step, title, children }: { step: 0 | 1 | 2; title: string; children: React.ReactNode }) {
  const c = await getContent();
  const s = c.settings;
  return (
    <>
      <Header base="/" />
      <main className="store">
        <div className="container">
          <div className="store__head">
            <nav className="crumbs" aria-label="مسار الصفحة">
              <Link href="/">الرئيسية</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#shop">الأسعار</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{STEPS[step]}</span>
            </nav>
            <h1 className="store__title">{title}</h1>
            <ol className="steps" aria-label="مراحل الطلب">
              {STEPS.map((label, i) => (
                <li key={label} className={i < step ? "is-done" : i === step ? "is-current" : undefined} aria-current={i === step ? "step" : undefined}>
                  <span className="steps__dot">{i < step ? <Ico id="check" /> : i + 1}</span>
                  <span className="steps__label">{label}</span>
                </li>
              ))}
            </ol>
          </div>
          {children}
        </div>
      </main>
      <Footer c={c.footer} s={s} base="/" />

      <a href={wa(s.whatsapp)} target="_blank" rel="noopener" className="fab-wa" aria-label="تواصل معنا عبر واتساب">
        <Ico id="wa" />
        <span className="fab-wa__tip">تحدث معنا</span>
      </a>
      <IconSprite />
      <StoreChrome />
    </>
  );
}

/** Settings the client-side store pages need (WhatsApp number, cities etc.). */
export async function storeSettings() {
  const c = await getContent();
  return { whatsapp: c.settings.whatsapp, shop: c.shop };
}
