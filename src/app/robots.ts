import type { MetadataRoute } from "next";
import { getSection } from "@/content/get-content";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSection("seo");
  const base = siteUrl(seo);
  return {
    rules: seo.indexable
      ? { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
