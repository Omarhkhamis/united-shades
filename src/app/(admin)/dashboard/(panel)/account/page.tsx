import type { Metadata } from "next";
import { PasswordForm } from "@/components/dashboard/PasswordForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "كلمة المرور" };

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <div className="editor">
      <header className="editor__bar">
        <div>
          <h1 className="editor__title">الحساب</h1>
          <p className="editor__desc">أنت مسجّل الدخول باسم <b dir="ltr">{session.email}</b></p>
        </div>
      </header>
      <PasswordForm />
    </div>
  );
}
