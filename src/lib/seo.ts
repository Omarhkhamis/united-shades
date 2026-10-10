import type { SiteContent } from "@/content/defaults";

/** The public base URL used for canonical links and absolute share-image URLs. */
export function siteUrl(seo: SiteContent["seo"]) {
  try {
    return new URL(seo.siteUrl.trim() || "https://uscompany.com.sa");
  } catch {
    return new URL("https://uscompany.com.sa");
  }
}

/** schema.org LocalBusiness data so search engines understand who the company is. */
export function businessJsonLd(c: SiteContent) {
  const base = siteUrl(c.seo);
  const abs = (path: string) => new URL(path, base).toString();
  const s = c.settings;
  const sameAs = [s.instagram, s.x, s.snapchat, s.tiktok, s.linkedin].map((v) => v.trim()).filter((v) => v && v !== "#");
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "المتحدة للمظلات",
    alternateName: "United Shades",
    url: base.toString(),
    logo: abs("/assets/img/logo.png"),
    image: abs(c.seo.shareImage),
    description: c.seo.description,
    telephone: s.phone,
    email: s.email,
    foundingDate: "2011",
    address: { "@type": "PostalAddress", addressLocality: "الرياض", addressCountry: "SA", streetAddress: s.address },
    areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
