"use client";

import { useEffect } from "react";

/** Mobile menu + header shadow on the store pages (the home page uses its own GSAP effects). */
export function StoreChrome() {
  useEffect(() => {
    const header = document.getElementById("header");
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (!header || !burger || !nav) return;
    const ac = new AbortController();

    const toggle = (open: boolean) => {
      nav.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!nav.classList.contains("is-open")), { signal: ac.signal });
    nav.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a")) toggle(false); }, { signal: ac.signal });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); }, { signal: ac.signal });

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, signal: ac.signal });

    return () => {
      ac.abort();
      document.body.style.overflow = "";
    };
  }, []);
  return null;
}
