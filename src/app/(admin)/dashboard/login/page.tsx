import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login__card">
        <img src="/assets/img/logo.png" alt="المتحدة للمظلات" className="login__logo" />
        <h1>لوحة تحكم الموقع</h1>
        <p className="login__sub">سجّل الدخول لتعديل محتوى الموقع.</p>
        <LoginForm />
      </div>
    </main>
  );
}
