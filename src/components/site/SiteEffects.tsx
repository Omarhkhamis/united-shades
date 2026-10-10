"use client";

import { useEffect } from "react";
import { initSite } from "./site-effects";

/** Boots the original interactions & GSAP animations once the page is hydrated. */
export function SiteEffects() {
  useEffect(() => initSite(), []);
  return null;
}
