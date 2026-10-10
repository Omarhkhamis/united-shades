import "server-only";
import { cache } from "react";
import { db, schema } from "@/db";
import { defaultContent, type SectionKey, type SiteContent } from "./defaults";
import { sanitize } from "./sanitize";

/** Full website content: database values layered over the defaults. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const rows = await db.select().from(schema.siteSections);
  const content = structuredClone(defaultContent);
  for (const row of rows) {
    const key = row.key as SectionKey;
    if (key in content) (content as Record<SectionKey, unknown>)[key] = sanitize(defaultContent[key], row.data);
  }
  return content;
});

export async function getSection<K extends SectionKey>(key: K): Promise<SiteContent[K]> {
  return (await getContent())[key];
}
