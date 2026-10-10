import type { Metadata, Viewport } from "next";
import { getSection } from "@/content/get-content";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/seo";
import "./site.css";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSection("seo");
  const shareTitle = seo.shareTitle || seo.title;
  const shareDescription = seo.shareDescription || seo.description;
  const image = { url: seo.shareImage, width: 1200, height: 630, alt: seo.shareImageAlt || shareTitle };
  const handle = seo.xHandle.trim().replace(/^@?/, "@");

  return {
    metadataBase: siteUrl(seo),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.filter(Boolean),
    applicationName: seo.siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: "/",
      siteName: seo.siteName,
      title: shareTitle,
      description: shareDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: [image],
      ...(handle.length > 1 ? { site: handle } : {}),
    },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    formatDetection: { telephone: false },
    icons: { icon: { url: "/assets/img/favicon.png", type: "image/png" }, apple: "/assets/img/favicon.png" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ede3",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables} suppressHydrationWarning>
      {/* browser extensions often inject attributes here; ignore those mismatches */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
