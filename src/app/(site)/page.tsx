import { Site } from "@/components/site/Site";
import { SiteEffects } from "@/components/site/SiteEffects";
import { getContent } from "@/content/get-content";
import { businessJsonLd } from "@/lib/seo";

// content comes from the database and is edited live from the dashboard
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so content from the dashboard can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(content)).replace(/</g, "\\u003c") }}
      />
      <Site c={content} />
      <SiteEffects />
    </>
  );
}
