import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

/** Upload an image from the dashboard → { url } */
export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return Response.json({ error: "الصيغ المسموحة: JPG, PNG, WEBP, AVIF, GIF" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "الحد الأقصى لحجم الصورة 8 ميجابايت" }, { status: 400 });

  const [row] = await db
    .insert(schema.media)
    .values({ filename: file.name.slice(0, 200), mime: file.type, size: file.size, data: Buffer.from(await file.arrayBuffer()) })
    .returning({ id: schema.media.id });

  return Response.json({ url: `/media/${row.id}` });
}
