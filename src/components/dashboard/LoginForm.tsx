"use client";

import { Loader2, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { login } from "@/app/(admin)/dashboard/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  // controlled so the email survives React's form reset after a failed attempt
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="login__form">
      <div className="field field--full">
        <label className="field__label" htmlFor="email">البريد الإلكتروني</label>
        <input id="email" name="email" type="email" className="input" dir="ltr" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field field--full">
        <label className="field__label" htmlFor="password">كلمة المرور</label>
        <input id="password" name="password" type="password" className="input" dir="ltr" autoComplete="current-password" required />
      </div>
      {state && !state.ok && <p className="pill pill--err">{state.error}</p>}
      <button type="submit" className="btn btn--primary btn--block" disabled={pending}>
        {pending ? <Loader2 size={17} className="spin" /> : <LogIn size={17} />} تسجيل الدخول
      </button>
    </form>
  );
}
