import type { MetadataRoute } from "next";
import { getSection } from "@/content/get-content";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl(await getSection("seo"));
  return [{ url: base.toString(), changeFrequency: "monthly", priority: 1 }];
}
