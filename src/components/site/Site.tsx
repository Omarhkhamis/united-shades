import { Fragment } from "react";
import type { SiteContent } from "@/content/defaults";
import { galleryFilters } from "@/content/defaults";
import { rich } from "@/content/rich";
import { IconSprite } from "./IconSprite";
import { MARK_DARK, MARK_ORANGE } from "./mark-paths";
import { PlateDrawing } from "./PlateDrawing";

const wa = (number: string, text?: string) =>
  `https://wa.me/${number}` + (text ? `?text=${encodeURIComponent(text)}` : "");

const Ico = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <use href={`#i-${id}`} />
  </svg>
);

export function Site({ c }: { c: SiteContent }) {
  const s = c.settings;
  return (
    <>
      <Preloader />
      <Header whatsapp={s.whatsapp} />
      <main>
        <Hero c={c} />
        <Ticker items={c.ticker.items} />
        <About c={c.about} />
        <Stats c={c.stats} />
        <Services c={c.services} />
        <Products c={c.products} />
        <Clients c={c.clients} />
        <Why c={c.why} />
        <Gallery c={c.gallery} projects={c.projects} />
        <Quality c={c.quality} />
        <Faq c={c.faq} whatsapp={s.whatsapp} />
        <Cta c={c.cta} whatsapp={s.whatsapp} />
        <Contact c={c.contact} s={s} />
      </main>
      <Footer c={c.footer} s={s} />

      {/* Floating WhatsApp */}
      <a href={wa(s.whatsapp)} target="_blank" rel="noopener" className="fab-wa" aria-label="تواصل معنا عبر واتساب">
        <Ico id="wa" />
        <span className="fab-wa__tip">تحدث معنا</span>
      </a>

      {/* Lightbox */}
      <div className="lightbox" id="lightbox" aria-hidden="true">
        <button className="lightbox__close" aria-label="إغلاق">&times;</button>
        <img alt="" />
        <p className="lightbox__cap"></p>
      </div>

      {/* Custom cursor */}
      <div className="cursor" aria-hidden="true"><span>عرض</span></div>

      <IconSprite />
    </>
  );
}

/* ============ PRELOADER ============ */
function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <svg className="preloader__sail" viewBox="66 64 1236 1376" role="img" aria-label="المتحدة للمظلات">
        <path className="pl-dark" d={MARK_DARK} />
        <path className="pl-orange" d={MARK_ORANGE} />
      </svg>
      <div className="preloader__bar"><span></span></div>
    </div>
  );
}

/* ============ HEADER ============ */
const NAV = [
  ["#home", "الرئيسية"],
  ["#services", "الخدمات"],
  ["#sections", "الأقسام"],
  ["#gallery", "معرض الأعمال"],
  ["#faq", "الأسئلة الشائعة"],
  ["#contact", "اتصل بنا"],
] as const;

function Header({ whatsapp }: { whatsapp: string }) {
  return (
    <header className="header" id="header">
      <div className="container header__inner">
        <a href="#home" className="header__logo" aria-label="المتحدة للمظلات - الرئيسية">
          <img src="/assets/img/logo-light.png" alt="المتحدة للمظلات" className="logo-light" width={464} height={167} />
          <img src="/assets/img/logo.png" alt="" className="logo-dark" width={464} height={167} aria-hidden="true" />
        </a>

        <nav className="nav" id="nav" aria-label="القائمة الرئيسية">
          {NAV.map(([href, label], i) => (
            <a key={href} href={href} className={"nav__link" + (i === 0 ? " is-active" : "")}>{label}</a>
          ))}
        </nav>

        <div className="header__actions">
          <a href={wa(whatsapp)} target="_blank" rel="noopener" className="btn btn--wa btn--sm" aria-label="تواصل عبر واتساب">
            <Ico id="wa" className="ico" />
            <span>واتساب</span>
          </a>
          <button className="burger" id="burger" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============ HERO — "Sheet 01": from drawing to reality ============ */
function Hero({ c }: { c: SiteContent }) {
  const h = c.hero;
  return (
    <section className="hero hero--sheet" id="home">
      <div className="hero__sheet" aria-hidden="true"></div>

      <div className="container hero__meta" aria-hidden="true">
        <span dir="ltr">24.7136° N — 46.6753° E</span>
        <span className="hero__meta-mid">{h.location}</span>
        <span dir="ltr">SHEET 01 / 12</span>
      </div>

      <div className="container hero__grid">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="line"><span className="word">{h.titleLine}</span></span>
            <span className="line">
              <span className="word shade-word">{h.shadeWord}<span className="shade-word__cast" aria-hidden="true">{h.shadeWord}</span></span>
            </span>
          </h1>

          <p className="hero__lead">{h.lead}</p>

          <div className="hero__cta">
            <a href="#contact" className="hbtn magnetic">
              <span>{h.ctaLabel}</span>
              <Ico id="arrow" className="ico" />
            </a>
          </div>
        </div>

        <figure className="hero__visual">
          <div className="plate">
            <img className="plate__photo" src={h.image} alt={h.imageAlt} width={1000} height={1309} />
            <div className="plate__paper" aria-hidden="true"></div>
            <PlateDrawing />
            <div className="plate__labels" aria-hidden="true">
              <span className="lbl lbl--mid" style={{ top: "57.9%", left: "9%" }}>H</span>
              <span className="lbl lbl--up" style={{ top: "22.9%", right: "2%" }}>MEMBRANE · PVC / PTFE</span>
              <span className="lbl lbl--up" style={{ top: "71.8%", right: "2%" }}>COLUMN · STEEL · POWDER COATED</span>
              <span className="lbl lbl--mid" style={{ top: "94%", left: "50%" }}>SPAN</span>
              <span className="lbl lbl--up" style={{ top: "87.8%", left: "12%" }}>± 0.00</span>
            </div>
          </div>
          <figcaption className="plate__cap"><span>01</span> {h.caption}</figcaption>
        </figure>
      </div>

      <a href="#about" className="scroll-cue" aria-label="انتقل للأسفل">
        <span className="scroll-cue__line"></span>
      </a>
    </section>
  );
}

/* ============ MARQUEE ============ */
function Ticker({ items }: { items: string[] }) {
  // rendered twice for a seamless loop; the copy is hidden from assistive tech
  const run = (copy: boolean) =>
    items.map((t, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span aria-hidden={copy || undefined}>{t}</span>
        <i aria-hidden={copy || undefined}></i>
      </Fragment>
    ));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

/* ============ ABOUT ============ */
function About({ c }: { c: SiteContent["about"] }) {
  return (
    <section className="about section" id="about">
      <div className="container about__grid">
        <div className="about__media">
          <div className="about__img about__img--a reveal-img"><img src={c.imageA} alt={c.imageAAlt} loading="lazy" width={1000} height={1309} /></div>
          <div className="about__img about__img--b reveal-img"><img src={c.imageB} alt={c.imageBAlt} loading="lazy" width={1000} height={1309} /></div>
          <div className="about__stamp">
            <svg viewBox="0 0 200 200" className="stamp-rotate">
              <defs><path id="circlePath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#circlePath">UNITED SHADES · MORE THAN JUST SHADE · SINCE 2011 ·</textPath></text>
            </svg>
            <img src="/assets/img/mark.svg" alt="" width={1236} height={1376} />
          </div>
        </div>

        <div className="about__content">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="section-title split">{rich(c.title)}</h2>
          <p className="about__text fade-up">{rich(c.text)}</p>
          <p className="about__quote fade-up">{c.quote}</p>

          <div className="vm">
            <article className="vm__card fade-up">
              <span className="vm__icon"><Ico id="eye" /></span>
              <h3>{c.visionTitle}</h3>
              <p>{c.visionText}</p>
            </article>
            <article className="vm__card fade-up">
              <span className="vm__icon"><Ico id="target" /></span>
              <h3>{c.missionTitle}</h3>
              <p>{c.missionText}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ STATS ============ */
function Stats({ c }: { c: SiteContent["stats"] }) {
  return (
    <section className="stats" aria-label="أرقامنا">
      <svg className="stats__wave" viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden="true" id="statsLines"></svg>
      <div className="container">
        <div className="stats__head">
          <p className="eyebrow eyebrow--light">{c.eyebrow}</p>
          <h2 className="section-title section-title--light split">{rich(c.title)}</h2>
        </div>
        <div className="stats__grid">
          {c.items.map((st, i) => (
            <div className="stat" key={i}>
              <strong className="stat__num"><span data-count={st.value}>0</span>{st.plus && <sup>+</sup>}</strong>
              <span className="stat__label">{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICES (horizontal) ============ */
function Services({ c }: { c: SiteContent["services"] }) {
  return (
    <section className="services" id="services">
      <div className="services__pin">
        <div className="container services__head">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="section-title split">{rich(c.title)}</h2>
          </div>
          <div className="services__progress" aria-hidden="true"><span></span></div>
        </div>

        <div className="services__track" id="servicesTrack">
          {c.items.map((svc, i) => (
            <article className="svc" key={i}>
              <div className="svc__img"><img src={svc.image} alt={svc.alt} loading="lazy" /></div>
              <div className="svc__body">
                <span className="svc__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{svc.title}</h3>
                <p className="svc__en">{svc.en}</p>
                <p>{svc.text}</p>
              </div>
            </article>
          ))}
          <div className="svc svc--cta">
            <p>{rich(c.ctaText)}</p>
            <a href="#contact" className="btn btn--primary">{c.ctaButton}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTIONS / PRODUCTS ============ */
function Products({ c }: { c: SiteContent["products"] }) {
  return (
    <section className="products section" id="sections">
      <div className="container">
        <div className="products__head">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="section-title split">{rich(c.title)}</h2>
          </div>
          <div className="tabs" role="tablist" aria-label="أقسام المنتجات">
            {c.tabs.map((tab, i) => (
              <button key={i} className={"tab" + (i === 0 ? " is-active" : "")} role="tab" aria-selected={i === 0} data-tab={`t${i}`}>{tab.label}</button>
            ))}
            <span className="tabs__ink" aria-hidden="true"></span>
          </div>
        </div>

        {c.tabs.map((tab, i) => (
          <div key={i} className={"panel" + (i === 0 ? " is-active" : "")} data-panel={`t${i}`} role="tabpanel" hidden={i !== 0}>
            <div className="pgrid">
              {tab.items.map((p, j) => (
                <article className="pcard" key={j}>
                  <div className="pcard__img"><img src={p.image} alt={p.title} loading="lazy" /></div>
                  <div className="pcard__body">
                    <h3>{p.title}</h3>
                    {p.specs.length > 0 ? (
                      <ul className="specs">
                        {p.specs.map((sp, k) => <li key={k}><span>{sp.label}</span>{sp.value}</li>)}
                      </ul>
                    ) : (
                      <p>{p.text}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        {/* Materials */}
        <div className="materials">
          <h3 className="materials__title">{c.materialsTitle}</h3>
          <div className="materials__grid">
            {c.materials.map((m, i) => (
              <div className="mat fade-up" key={i}><b>{m.name}</b><span>{m.text}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CLIENTS MARQUEE ============ */
function LogoRow({ logos, dir }: { logos: { image: string; name: string }[]; dir: 1 | -1 }) {
  const run = (copy: boolean) =>
    logos.map((l, i) => <img key={`${copy}-${i}`} src={l.image} alt={l.name} loading="lazy" aria-hidden={copy || undefined} />);
  return (
    <div className="logo-marquee" data-dir={dir}>
      <div className="logo-marquee__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

function Clients({ c }: { c: SiteContent["clients"] }) {
  return (
    <section className="clients section" id="clients">
      <div className="container">
        <p className="eyebrow eyebrow--center">{c.eyebrow}</p>
        <h2 className="section-title section-title--center split">{rich(c.title)}</h2>
      </div>
      <LogoRow logos={c.row1} dir={1} />
      <LogoRow logos={c.row2} dir={-1} />
    </section>
  );
}

/* ============ WHY US ============ */
function Why({ c }: { c: SiteContent["why"] }) {
  return (
    <section className="why section" id="why">
      <div className="container why__grid">
        <div className="why__intro">
          <p className="eyebrow eyebrow--light">{c.eyebrow}</p>
          <h2 className="section-title section-title--light split">{rich(c.title)}</h2>
          <p className="why__text fade-up">{c.text}</p>
          <div className="why__img reveal-img"><img src={c.image} alt={c.imageAlt} loading="lazy" /></div>
        </div>
        <div className="why__list">
          {c.features.map((f, i) => (
            <article className="feat" key={i}>
              <span className="feat__n">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{f.title}</h3><p>{f.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ GALLERY ============ */
function Gallery({ c, projects }: { c: SiteContent["gallery"]; projects: SiteContent["projects"] }) {
  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <div className="gallery__head">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="section-title split">{rich(c.title)}</h2>
          </div>
          <div className="filters" role="group" aria-label="تصفية الأعمال">
            {galleryFilters.map((f, i) => (
              <button key={f.value} className={"filter" + (i === 0 ? " is-active" : "")} data-filter={f.value}>{f.label}</button>
            ))}
          </div>
        </div>

        <div className="ggrid" id="ggrid">
          {c.items.map((g, i) => (
            <figure key={i} className={"gitem" + (g.tall ? " gitem--tall" : "")} data-cat={g.category}>
              <img src={g.image} alt={g.alt} loading="lazy" />
              <figcaption><b>{g.title}</b><span>{g.subtitle}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Accomplished projects list */}
      <div className="container plist">
        <h3 className="plist__title">{projects.title}</h3>
        <ul className="plist__rows">
          {projects.items.map((p, i) => (
            <li key={i}><b>{p.name}</b><span>{p.type}</span><em>{p.location}</em></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============ QUALITY ============ */
function Quality({ c }: { c: SiteContent["quality"] }) {
  return (
    <section className="quality section">
      <div className="container">
        <p className="eyebrow eyebrow--center">{c.eyebrow}</p>
        <h2 className="section-title section-title--center split">{rich(c.title)}</h2>
        <div className="qgrid">
          {c.items.map((q, i) => (
            <div className="q" key={i}><span className="q__ico"><Ico id={q.icon} /></span><h3>{q.title}</h3><p>{q.text}</p></div>
          ))}
        </div>

        <div className="partners">
          <p className="partners__label">{c.partnersLabel}</p>
          <div className="partners__row">
            {c.partners.map((p, i) => <img key={i} src={p.image} alt={p.name} loading="lazy" />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
function Faq({ c, whatsapp }: { c: SiteContent["faq"]; whatsapp: string }) {
  return (
    <section className="faq section" id="faq">
      <div className="container faq__grid">
        <div className="faq__intro">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="section-title split">{rich(c.title)}</h2>
          <p className="fade-up">{c.text}</p>
          <a href={wa(whatsapp)} target="_blank" rel="noopener" className="btn btn--wa fade-up">
            <Ico id="wa" className="ico" /> {c.buttonLabel}
          </a>
        </div>
        <div className="faq__list">
          {c.items.map((q, i) => (
            <details className="qa" key={i} open={i === 0}>
              <summary>{q.question}<span className="qa__ico"></span></summary>
              <div className="qa__a"><p>{q.answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CTA + TABBY ============ */
function Cta({ c, whatsapp }: { c: SiteContent["cta"]; whatsapp: string }) {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div className="cta__text">
          <h2 className="split">{rich(c.title)}</h2>
          <p>{c.text}</p>
        </div>
        <div className="cta__actions">
          <a href={wa(whatsapp, c.quoteMessage)} target="_blank" rel="noopener" className="btn btn--dark magnetic">
            <Ico id="wa" className="ico" /> {c.buttonLabel}
          </a>
          <div className="bnpl">
            <span className="bnpl__txt">{c.bnplTitle}<br /><small>{c.bnplNote}</small></span>
            <a href={wa(whatsapp, c.tabbyMessage)} target="_blank" rel="noopener" className="bnpl__chip bnpl__chip--tabby magnetic" aria-label="الدفع عبر تابي من خلال واتساب">tabby</a>
            <a href={wa(whatsapp, c.tamaraMessage)} target="_blank" rel="noopener" className="bnpl__chip bnpl__chip--tamara magnetic" aria-label="الدفع عبر تمارا من خلال واتساب">tamara</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
const SOCIALS = [
  ["instagram", "ig", "إنستغرام"],
  ["x", "x", "إكس"],
  ["snapchat", "snap", "سناب شات"],
  ["tiktok", "tiktok", "تيك توك"],
  ["linkedin", "in", "لينكدإن"],
] as const;

function Contact({ c, s }: { c: SiteContent["contact"]; s: SiteContent["settings"] }) {
  // only accounts that actually have a link are shown
  const socials = SOCIALS.filter(([key]) => {
    const url = s[key]?.trim();
    return url && url !== "#";
  });
  return (
    <section className="contact section" id="contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="section-title split">{rich(c.title)}</h2>
          <ul className="cinfo">
            <li><span className="cinfo__ico"><Ico id="phone" /></span><div><small>الرقم الموحّد</small><a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a></div></li>
            <li><span className="cinfo__ico"><Ico id="wa" /></span><div><small>جوال / واتساب</small><a href={wa(s.whatsapp)} target="_blank" rel="noopener" dir="ltr">{s.whatsappDisplay}</a></div></li>
            <li><span className="cinfo__ico"><Ico id="mail" /></span><div><small>البريد الإلكتروني</small><a href={`mailto:${s.email}`}>{s.email}</a></div></li>
            <li><span className="cinfo__ico"><Ico id="pin" /></span><div><small>العنوان</small><span>{s.address}</span></div></li>
          </ul>
          {socials.length > 0 && (
            <div className="socials">
              {socials.map(([key, icon, label]) => (
                <a key={key} href={s[key].trim()} aria-label={label} target="_blank" rel="noopener">
                  <Ico id={icon} />
                </a>
              ))}
            </div>
          )}
        </div>

        <form className="cform" id="cform" noValidate data-wa={s.whatsapp} data-intro={c.whatsappIntro}>
          <h3>{c.formTitle}</h3>
          <p className="cform__hint">{c.formHint}</p>
          <div className="field">
            <input type="text" id="f-name" name="name" required placeholder=" " autoComplete="name" />
            <label htmlFor="f-name">الاسم الكامل</label>
          </div>
          <div className="field">
            <input type="tel" id="f-phone" name="phone" required placeholder=" " autoComplete="tel" dir="rtl" />
            <label htmlFor="f-phone">رقم الجوال</label>
          </div>
          <div className="field">
            <select id="f-type" name="type" required defaultValue="">
              <option value="" disabled hidden></option>
              {c.serviceOptions.map((o, i) => <option key={i}>{o}</option>)}
            </select>
            <label htmlFor="f-type">نوع الخدمة</label>
          </div>
          <div className="field">
            <input type="text" id="f-city" name="city" placeholder=" " />
            <label htmlFor="f-city">المدينة / الحي</label>
          </div>
          <div className="field field--full">
            <textarea id="f-msg" name="msg" rows={3} placeholder=" "></textarea>
            <label htmlFor="f-msg">تفاصيل المشروع (اختياري)</label>
          </div>
          {/* honeypot for spam bots — hidden from people and screen readers */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform__trap" />
          <button type="submit" className="btn btn--primary btn--block">
            <Ico id="wa" className="ico" /> {c.submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function Footer({ c, s }: { c: SiteContent["footer"]; s: SiteContent["settings"] }) {
  const websiteLabel = s.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">UNITED SHADES</div>
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/assets/img/logo-light.png" alt="المتحدة للمظلات" width={464} height={167} />
          <p>{c.brandText}</p>
        </div>
        <div>
          <h4>روابط</h4>
          <a href="#home">الرئيسية</a><a href="#services">الخدمات</a><a href="#sections">الأقسام</a><a href="#gallery">معرض الأعمال</a><a href="#contact">اتصل بنا</a>
        </div>
        <div>
          <h4>خدماتنا</h4>
          {c.services.map((t, i) => <a key={i} href="#services">{t}</a>)}
        </div>
        <div>
          <h4>تواصل</h4>
          <a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a>
          <a href={`mailto:${s.email}`}>{s.email}</a>
          {s.website && <a href={s.website} target="_blank" rel="noopener">{websiteLabel}</a>}
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© <span id="year">{new Date().getFullYear()}</span> المتحدة للمظلات — جميع الحقوق محفوظة.</span>
        <a href="#home" className="totop" aria-label="العودة للأعلى"><Ico id="up" /></a>
      </div>
    </footer>
  );
}
