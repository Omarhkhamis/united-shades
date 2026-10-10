import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";

/* simple per-IP limit so the form can't be used to flood the dashboard */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const field = (body: Record<string, unknown>, key: string, max: number) =>
  typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";

/** Stores a quote request from the website's contact form. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return Response.json({ error: "invalid" }, { status: 400 });

  // honeypot: real visitors never see or fill this field
  if (field(body, "website", 200)) return Response.json({ ok: true });

  const name = field(body, "name", 120);
  const phone = field(body, "phone", 30);
  const service = field(body, "type", 120);
  if (!name || !phone || !service) return Response.json({ error: "missing fields" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return Response.json({ error: "too many requests" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  await db.insert(schema.contactMessages).values({
    name,
    phone,
    service,
    city: field(body, "city", 120),
    message: field(body, "msg", 2000),
  });
  revalidatePath("/dashboard", "layout");
  return Response.json({ ok: true });
}
