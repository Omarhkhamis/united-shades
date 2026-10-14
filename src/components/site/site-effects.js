/* =========================================================
   United Shades — interactions & GSAP animations
   Ported from the original assets/js/main.js. Runs once on the client
   after hydration and returns a cleanup function.
   ========================================================= */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";

export function initSite() {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ac = new AbortController();
  const on = (el, type, fn, opts = {}) => el && el.addEventListener(type, fn, { ...opts, signal: ac.signal });
  const tickers = [];
  const addTicker = (fn) => { gsap.ticker.add(fn); tickers.push(fn); };

  gsap.registerPlugin(ScrollTrigger, Flip);

  /*
   * Scroll reveal with explicit end values. Many of these elements also have CSS
   * transitions on transform/opacity, which fight GSAP and left them stuck half-way
   * or invisible (bug in the original design too) — so the CSS transition is paused
   * during the reveal, and every inline style is cleared afterwards (hover effects keep working).
   */
  const reveal = (targets, from, to) => {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;
    gsap.set(els, { transition: 'none' });
    return gsap.fromTo(els, from, { x: 0, y: 0, opacity: 1, ...to, clearProps: 'transform,opacity,transition' });
  };

  /* ---------- Generated "string-art" lines (inspired by the profile's wave pattern) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  function buildLines(svg, count, w, h, shape) {
    svg.replaceChildren();
    const paths = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElementNS(NS, 'path');
      p.style.opacity = (0.12 + 0.5 * (i / count)).toFixed(2);
      svg.appendChild(p);
      paths.push(p);
    }
    const draw = (t = 0) => {
      paths.forEach((p, i) => {
        const k = i / (count - 1);
        p.setAttribute('d', shape(k, t, w, h));
      });
    };
    draw(0);
    return { paths, draw };
  }

  const stats = buildLines($('#statsLines'), 26, 1600, 300, (k, t, w, h) => {
    const s = Math.sin(t * 0.8 + k * 3) * 22;
    return `M-50,${h - k * 60} C${w * 0.3},${h * 0.2 + s + k * 80} ${w * 0.7},${h * 1.1 - s - k * 90} ${w + 50},${h * 0.25 + k * 70}`;
  });

  /* ---------- Header / nav ---------- */
  const header = $('#header');
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleNav = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && !reduce) {
      gsap.fromTo($$('.nav__link', nav), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .7, delay: .2, ease: 'power3.out' });
    }
  };
  on(burger, 'click', () => toggleNav(!nav.classList.contains('is-open')));

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  }

  const scrollToTarget = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'home' ? 0 : -60, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      e.preventDefault();
      if (nav.classList.contains('is-open')) toggleNav(false);
      scrollToTarget(id);
    });
  });

  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 500 && !nav.classList.contains('is-open'));
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else on(window, 'scroll', () => onScroll(window.scrollY), { passive: true });

  /* ---------- Tabs ---------- */
  const tabs = $$('.tab');
  const ink = $('.tabs__ink');
  const moveInk = (tab) => {
    if (!tab || !ink) return;
    ink.style.width = tab.offsetWidth + 'px';
    ink.style.left = tab.offsetLeft + 'px';
  };
  tabs.forEach(tab => on(tab, 'click', () => {
    if (tab.classList.contains('is-active')) return;
    tabs.forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
    gsap.to(ink, { left: tab.offsetLeft, width: tab.offsetWidth, duration: .6, ease: 'power3.inOut' });
    $$('.panel').forEach(p => {
      const active = p.dataset.panel === tab.dataset.tab;
      p.hidden = !active;
      p.classList.toggle('is-active', active);
      if (active && !reduce) {
        reveal($$('.pcard', p), { y: 50, opacity: 0 }, { stagger: .08, duration: .8, ease: 'power3.out' });
      }
    });
    ScrollTrigger.refresh();
  }));
  if (document.readyState === 'complete') moveInk($('.tab.is-active'));
  else on(window, 'load', () => moveInk($('.tab.is-active')));
  on(window, 'resize', () => moveInk($('.tab.is-active')));

  /* ---------- Gallery filter + lightbox ---------- */
  const items = $$('.gitem');
  $$('.filter').forEach(btn => on(btn, 'click', () => {
    $$('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    const state = Flip.getState(items);
    items.forEach(it => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
    if (!reduce) {
      Flip.from(state, {
        duration: .7, ease: 'power3.inOut', scale: true, absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .6 }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: .85, duration: .4 }),
        onComplete: () => ScrollTrigger.refresh()
      });
    } else ScrollTrigger.refresh();
  }));

  const lb = $('#lightbox');
  const openLb = (fig) => {
    const img = $('img', fig);
    $('img', lb).src = img.src;
    $('img', lb).alt = img.alt;
    $('.lightbox__cap', lb).textContent = $('figcaption b', fig).textContent + ' — ' + $('figcaption span', fig).textContent;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  };
  const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); };
  items.forEach(it => {
    it.tabIndex = 0;
    on(it, 'click', () => openLb(it));
    on(it, 'keydown', e => { if (e.key === 'Enter') openLb(it); });
  });
  on(lb, 'click', e => { if (e.target === lb || e.target.closest('.lightbox__close')) closeLb(); });
  on(document, 'keydown', e => { if (e.key === 'Escape') { closeLb(); if (nav.classList.contains('is-open')) toggleNav(false); } });

  /* ---------- FAQ: one open at a time + smooth height ---------- */
  $$('.qa').forEach(d => {
    const sum = $('summary', d);
    const body = $('.qa__a', d);
    on(sum, 'click', e => {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: .45, ease: 'power2.inOut', onComplete: () => { d.open = false; body.style.height = ''; ScrollTrigger.refresh(); } });
      } else {
        $$('.qa[open]').forEach(o => { if (o !== d) $('summary', o).click(); });
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: 'auto', duration: .55, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() });
      }
    });
  });

  /* ---------- Contact form → WhatsApp ---------- */
  on($('#cform'), 'submit', e => {
    e.preventDefault();
    const f = e.target;
    let ok = true;
    ['name', 'phone', 'type'].forEach(n => {
      const el = f.elements[n];
      const bad = !el.value.trim();
      el.closest('.field').classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      gsap.fromTo(f, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
      return;
    }
    const msg = [
      f.dataset.intro,
      `الاسم: ${f.elements.name.value.trim()}`,
      `الجوال: ${f.elements.phone.value.trim()}`,
      `الخدمة: ${f.elements.type.value}`,
      f.elements.city.value.trim() && `المدينة/الحي: ${f.elements.city.value.trim()}`,
      f.elements.msg.value.trim() && `التفاصيل: ${f.elements.msg.value.trim()}`
    ].filter(Boolean).join('\n');
    // keep a copy in the dashboard (fire-and-forget, never blocks the WhatsApp hand-off)
    const payload = Object.fromEntries(['name', 'phone', 'type', 'city', 'msg', 'website'].map(n => [n, f.elements[n].value]));
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    window.open(`https://wa.me/${f.dataset.wa}?text=` + encodeURIComponent(msg), '_blank', 'noopener');
  });

  const preloader = $('.preloader');
  const hidePreloader = () => { if (preloader) preloader.style.display = 'none'; };

  const cleanup = (ctx, mm) => () => {
    ac.abort();
    tickers.forEach(fn => gsap.ticker.remove(fn));
    if (mm) mm.revert();
    if (ctx) ctx.revert();
    if (lenis) lenis.destroy();
    document.body.classList.remove('is-loading');
    document.body.style.overflow = '';
    if (preloader) preloader.style.display = '';
  };

  if (reduce) {
    hidePreloader();
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ''));
    return cleanup();
  }

  /* =========================================================
     GSAP
     ========================================================= */
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    addTicker(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Services: horizontal pinned scroll (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const track = $('#servicesTrack');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services', start: 'top top', end: () => '+=' + dist(),
        pin: '.services__pin', scrub: 1, refreshPriority: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    tl.to(track, { x: () => dist(), ease: 'none' }, 0)
      .to('.services__progress span', { scaleX: 1, ease: 'none' }, 0);
    // subtle image drift inside each card
    $$('.svc__img img').forEach(img => gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.services', start: 'top top', end: () => '+=' + dist(), scrub: true } }));
  });
  mm.add('(max-width: 960px)', () => {
    reveal('.svc', { x: -60, opacity: 0 }, { stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.services__track', start: 'top 85%' } });
  });

  const ctx = gsap.context(() => {
    /* ---------- Split titles into masked words ---------- */
    $$('.split').forEach(el => {
      const walk = (node) => {
        [...node.childNodes].forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              const w = document.createElement('span'); w.className = 'w';
              const i = document.createElement('span'); i.textContent = part;
              w.appendChild(i); frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      // split only once (effects can re-run in development)
      if (!el.dataset.split) { walk(el); el.dataset.split = '1'; }
      gsap.from($$('.w > span', el), {
        yPercent: 110, rotate: -4, duration: 1.1, ease: 'power4.out', stagger: .05,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    /* ---------- Preloader (shared) ---------- */
    document.body.classList.add('is-loading');
    const heroWords = $$('.hero__title .word');

    // loader: each sail of the logo draws its outline, then fills solid → ends as the exact mark
    const plSails = $$('.preloader__sail path');
    plSails.forEach(el => {
      const len = Math.ceil(el.getTotalLength());
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    });
    gsap.set('.preloader__sail', { scale: .92, transformOrigin: '50% 50%' });
    gsap.set('.header', { autoAlpha: 0 });

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro
      .to(plSails, { strokeDashoffset: 0, duration: 1.1, stagger: .22, ease: 'power2.inOut' })
      .to(plSails, { fillOpacity: 1, duration: .55, stagger: .12, ease: 'power1.out' }, '-=.35')
      .to('.preloader__sail', { scale: 1, duration: .9, ease: 'expo.out' }, '<')
      .set(plSails, { strokeOpacity: 0 })
      .to('.preloader__bar span', { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0)
      .to('.preloader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'power4.inOut', onComplete: () => { hidePreloader(); document.body.classList.remove('is-loading'); } }, '+=.35')
      .to('.header', { autoAlpha: 1, duration: .8 }, '-=.3');

    /* ---------- Living lines (only while visible) ---------- */
    const animLines = (obj, trigger, speed) => {
      let t = 0, active = false;
      ScrollTrigger.create({ trigger, start: 'top bottom', end: 'bottom top', onToggle: s => active = s.isActive });
      addTicker((_, dt) => { if (active) { t += dt / 1000 * speed; obj.draw(t); } });
    };
    animLines(stats, '.stats', .6);

    /* ===== Hero — "Sheet 01": drawing → reality ===== */
    const plate = $('.plate');
    const drawEls = $$('.plate__draw path, .plate__draw circle');
    const cast = $('.shade-word__cast');

    drawEls.forEach(el => {
      const len = Math.ceil(el.getTotalLength ? el.getTotalLength() : 3000);
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(heroWords, { yPercent: 115 });
    gsap.set(cast, { skewX: 0, scaleY: 0, yPercent: 4, transformOrigin: '50% 88%', opacity: 0 });
    gsap.set(['.hero__meta span', '.hero__lead', '.hero__cta', '.plate__cap', '.lbl'], { autoAlpha: 0 });
    gsap.set('.plate__photo', { scale: 1.12 });

    intro
      .fromTo('.hero__meta span', { y: 10 }, { autoAlpha: 1, y: 0, stagger: .1, duration: .7 }, '<')
      // the drawing draws itself
      .to(drawEls, { strokeDashoffset: 0, duration: 1.5, stagger: .045, ease: 'power2.inOut' }, '<.1')
      .to('.lbl', { autoAlpha: 1, stagger: .08, duration: .5, ease: 'none' }, '-=.7')
      // headline rises; the sun comes up and «ظلّ» casts its shadow
      .to(heroWords, { yPercent: 0, duration: 1.2, stagger: .12 }, '<-.6')
      .to(cast, { opacity: .13, scaleY: .42, skewX: -38, duration: 1.6, ease: 'power3.out' }, '<.5')
      // paper slides away like moving shade → the real structure appears under the markup
      .to('.plate__paper', { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, '-=.6')
      .to('.plate__photo', { scale: 1, duration: 2, ease: 'expo.out' }, '<.3')
      .to('.plate__draw path, .plate__draw circle', { stroke: '#ffffff', duration: .8, ease: 'none' }, '<')
      .to('.plate__draw .d-thin', { opacity: .45, duration: .8 }, '<')
      .add(() => plate.classList.add('is-real'), '<.3')
      .to('.plate__cap', { autoAlpha: 1, duration: .6 }, '<')
      .fromTo('.hero__lead', { y: 24 }, { autoAlpha: 1, y: 0, duration: 1 }, '-=1.4')
      .fromTo('.hero__cta', { y: 24 }, { autoAlpha: 1, y: 0, duration: 1 }, '<.1');

    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__content', { y: -90, ease: 'none', scrollTrigger: { ...heroST } });
    gsap.to('.hero__visual', { y: -40, ease: 'none', scrollTrigger: { ...heroST } });
    // as you scroll the sun climbs → the shadow shortens
    gsap.fromTo(cast, { scaleY: .42 }, { scaleY: .12, immediateRender: false, ease: 'none', scrollTrigger: { ...heroST } });

    // the cursor is the sun: shadow falls away from it
    if (window.matchMedia('(hover: hover)').matches) {
      const heroEl = $('.hero');
      const sun = gsap.quickTo(cast, 'skewX', { duration: 1.2, ease: 'power3' });
      on(heroEl, 'mousemove', e => {
        if (intro.isActive()) return;
        const r = $('.shade-word').getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        sun(gsap.utils.clamp(-62, 62, -dx * 110));
      });
      on(heroEl, 'mouseleave', () => sun(-38));
    }

    /* ---------- Marquees (speed reacts to scroll velocity) ---------- */
    const marquee = (track, dir, dur) =>
      gsap.fromTo(track, { xPercent: dir > 0 ? 0 : 50 }, { xPercent: dir > 0 ? 50 : 0, duration: dur, ease: 'none', repeat: -1 });
    const marquees = [
      marquee($('.ticker__track'), 1, 38),
      ...$$('.logo-marquee').map(m => marquee($('.logo-marquee__track', m), +m.dataset.dir, 45))
    ];
    ScrollTrigger.create({
      onUpdate: self => {
        const boost = 1 + Math.min(5, Math.abs(self.getVelocity()) / 400);
        marquees.forEach(tw => {
          gsap.killTweensOf(tw);
          tw.timeScale(boost);
          gsap.to(tw, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
        });
      }
    });

    /* ---------- Generic reveals ---------- */
    $$('.fade-up').forEach(el => {
      reveal(el, { y: 50, opacity: 0 }, { duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    $$('.reveal-img').forEach(el => {
      const img = $('img', el);
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } })
        .from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        .from(img, { scale: 1.35, duration: 1.8, ease: 'expo.out' }, '<.2');
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.from('.about__stamp', { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.about__media', start: 'top 70%' } });
    gsap.to('.stamp-rotate', { rotate: 360, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.to('.about__img--b', { y: -60, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---------- Counters ---------- */
    function countUp(el) {
      if (!el || el.dataset.done) return;
      el.dataset.done = 1;
      const end = +el.dataset.count;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: end > 50 ? 2.6 : 2, ease: 'power3.out',
        onUpdate: () => el.textContent = Math.round(obj.v).toLocaleString('en-US') + (el.dataset.suffix || '')
      });
    }
    $$('.stats [data-count]').forEach(el => {
      delete el.dataset.done;
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => countUp(el) });
    });
    reveal('.stat', { y: 60, opacity: 0 }, { stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats__grid', start: 'top 85%' } });

    /* ---------- Cards stagger ---------- */
    reveal('.panel.is-active .pcard', { y: 70, opacity: 0 }, { stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.pgrid', start: 'top 85%' } });
    reveal('.feat', { x: -60, opacity: 0 }, { stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.why__list', start: 'top 80%' } });
    reveal('.q', { y: 60, opacity: 0 }, { stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.qgrid', start: 'top 85%' } });
    reveal('.partners__row img', { y: 30, opacity: 0 }, { stagger: .06, duration: .8, scrollTrigger: { trigger: '.partners', start: 'top 90%' } });
    reveal('.qa', { y: 30, opacity: 0 }, { stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });
    reveal('.cinfo li', { x: -40, opacity: 0 }, { stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.cinfo', start: 'top 85%' } });
    reveal('.cform', { y: 80, opacity: 0 }, { duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.cform', start: 'top 88%' } });
    reveal('.plist__rows li', { y: 24, opacity: 0 }, { stagger: .04, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: '.plist', start: 'top 85%' } });
    gsap.from('.materials', { clipPath: 'inset(0% 0% 0% 100% round 28px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.materials', start: 'top 85%' } });

    // gallery: batch reveal
    ScrollTrigger.batch('.gitem', {
      start: 'top 92%',
      onEnter: batch => gsap.fromTo(batch, { y: 80, opacity: 0, clipPath: 'inset(20% 0% 0% 0%)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', stagger: .08, duration: 1.1, ease: 'power3.out', overwrite: true })
    });
    gsap.set('.gitem', { opacity: 0 });

    // CTA + footer
    reveal('.cta__inner > *', { y: 50, opacity: 0 }, { stagger: .15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 80%' } });
    gsap.fromTo('.footer__big', { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    // ticker skew while scrolling
    const skewTo = gsap.quickTo('.ticker__track', 'skewX', { duration: .4, ease: 'power3' });
    ScrollTrigger.create({ onUpdate: s => skewTo(gsap.utils.clamp(-8, 8, s.getVelocity() / -250)) });

    /* ---------- Active nav link ---------- */
    $$('.nav__link').forEach(link => {
      const sec = $(link.getAttribute('href'));
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 45%', end: 'bottom 45%',
        onToggle: s => { if (s.isActive) $$('.nav__link').forEach(l => l.classList.toggle('is-active', l === link)); }
      });
    });

    /* ---------- Magnetic buttons ---------- */
    if (window.matchMedia('(hover: hover)').matches) {
      $$('.magnetic').forEach(btn => {
        const mx = gsap.quickTo(btn, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
        const my = gsap.quickTo(btn, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
        on(btn, 'mousemove', e => {
          const r = btn.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * .3);
          my((e.clientY - r.top - r.height / 2) * .4);
        });
        on(btn, 'mouseleave', () => { mx(0); my(0); });
      });

      /* custom cursor on gallery */
      const cursor = $('.cursor');
      const cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' });
      const cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
      on(window, 'mousemove', e => { cx(e.clientX); cy(e.clientY); });
      items.forEach(it => {
        on(it, 'mouseenter', () => gsap.to(cursor, { scale: 1, duration: .4, ease: 'back.out(2)' }));
        on(it, 'mouseleave', () => gsap.to(cursor, { scale: 0, duration: .3 }));
      });
    }
  });

  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else on(window, 'load', () => ScrollTrigger.refresh());
  // lazy images can shift layout after load — keep trigger positions accurate
  let rT;
  $$('img[loading="lazy"]').forEach(img => img.complete || on(img, 'load', () => {
    clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 200);
  }));

  return cleanup(ctx, mm);
}
