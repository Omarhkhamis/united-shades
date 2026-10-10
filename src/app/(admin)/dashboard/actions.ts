"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { defaultContent, sectionKeys, type SectionKey } from "@/content/defaults";
import { sanitize } from "@/content/sanitize";
import { endSession, requireAdmin, startSession } from "@/lib/auth";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

/* ---------- login (with a small in-memory brute-force guard) ---------- */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000;

export async function login(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) {
    return { ok: false, error: "محاولات كثيرة. حاول مرة أخرى بعد 10 دقائق." };
  }

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const [user] = email ? await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1) : [];
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    const count = entry && entry.until > Date.now() ? entry.count + 1 : 1;
    attempts.set(ip, { count, until: Date.now() + LOCK_MS });
    return { ok: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  attempts.delete(ip);
  await startSession({ userId: user.id, email: user.email });
  redirect("/dashboard");
}

export async function logout() {
  await endSession();
  redirect("/dashboard/login");
}

/* ---------- content ---------- */
const isSectionKey = (key: string): key is SectionKey => (sectionKeys as string[]).includes(key);

export async function saveSection(key: string, data: unknown): Promise<ActionResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, error: "قسم غير معروف." };

  const clean = sanitize(defaultContent[key], data);
  await db
    .insert(schema.siteSections)
    .values({ key, data: clean })
    .onConflictDoUpdate({ target: schema.siteSections.key, set: { data: clean, updatedAt: new Date() } });

  revalidatePath("/");
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "تم الحفظ — التعديلات ظاهرة الآن على الموقع." };
}

export async function resetSection(key: string): Promise<ActionResult> {
  return saveSection(key, defaultContent[key as SectionKey]);
}

/* ---------- account ---------- */
export async function changePassword(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  if (next.length < 8) return { ok: false, error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف." };
  if (next !== confirm) return { ok: false, error: "تأكيد كلمة المرور غير مطابق." };

  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, session.userId)).limit(1);
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false, error: "كلمة المرور الحالية غير صحيحة." };
  }

  await db.update(schema.adminUsers).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.adminUsers.id, user.id));
  return { ok: true, message: "تم تغيير كلمة المرور بنجاح." };
}

/* ---------- contact-form messages ---------- */
export async function setMessageRead(id: number, isRead: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.update(schema.contactMessages).set({ isRead }).where(eq(schema.contactMessages.id, id));
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function markAllMessagesRead(): Promise<ActionResult> {
  await requireAdmin();
  await db.update(schema.contactMessages).set({ isRead: true }).where(eq(schema.contactMessages.isRead, false));
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "تم تحديد كل الرسائل كمقروءة." };
}

export async function deleteMessage(id: number): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "تم حذف الرسالة." };
}
