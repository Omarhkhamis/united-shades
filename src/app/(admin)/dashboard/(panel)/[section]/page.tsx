import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/dashboard/SectionEditor";
import { defaultContent } from "@/content/defaults";
import { getSectionSchema } from "@/content/editor-schema";
import { getContent } from "@/content/get-content";
import { requireAdmin } from "@/lib/auth";

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getSectionSchema((await params).section)?.title ?? "قسم غير موجود" };
}

export default async function SectionPage({ params }: Props) {
  await requireAdmin();
  const { section } = await params;
  const sectionSchema = getSectionSchema(section);
  if (!sectionSchema) notFound();

  const content = await getContent();
  return (
    <SectionEditor
      key={section}
      schema={sectionSchema}
      initial={content[sectionSchema.key] as Record<string, unknown>}
      defaults={defaultContent[sectionSchema.key] as Record<string, unknown>}
    />
  );
}
