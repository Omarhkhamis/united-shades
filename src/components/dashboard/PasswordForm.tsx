"use client";

import { Loader2, Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { notify } from "@/lib/alerts";
import { changePassword } from "@/app/(admin)/dashboard/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  useEffect(() => {
    if (state) notify(state.ok ? "success" : "error", state.ok ? state.message ?? "تم الحفظ" : state.error);
  }, [state]);
  return (
    <form action={action} className="card" key={state?.ok ? "done" : "form"}>
      <h2 className="card__title">تغيير كلمة المرور</h2>
      <div className="fields">
        <div className="field field--full">
          <label className="field__label" htmlFor="current">كلمة المرور الحالية</label>
          <input id="current" name="current" type="password" className="input" dir="ltr" autoComplete="current-password" required />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="next">كلمة المرور الجديدة</label>
          <input id="next" name="next" type="password" className="input" dir="ltr" autoComplete="new-password" minLength={8} required />
          <p className="field__hint">8 أحرف على الأقل.</p>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="confirm">تأكيد كلمة المرور</label>
          <input id="confirm" name="confirm" type="password" className="input" dir="ltr" autoComplete="new-password" minLength={8} required />
        </div>
      </div>
      <div className="card__actions">
        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? <Loader2 size={16} className="spin" /> : <Save size={16} />} حفظ كلمة المرور
        </button>
      </div>
    </form>
  );
}
