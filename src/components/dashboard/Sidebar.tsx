"use client";

import { ExternalLink, KeyRound, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { logout } from "@/app/(admin)/dashboard/actions";
import { confirmAction } from "@/lib/alerts";
import { sectionIcons } from "./icons";

type Item = { key: string; title: string; icon: string; badge?: number };

export function Sidebar({ items, email }: { items: Item[]; email: string }) {
  const pathname = usePathname();
  // the mobile drawer remembers the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  const link = (href: string, label: string, Icon: React.ComponentType<{ size?: number }>, badge?: number) => (
    <Link href={href} className={"side__link" + (pathname === href ? " is-active" : "")} aria-current={pathname === href ? "page" : undefined}>
      <Icon size={18} />
      <span>{label}</span>
      {!!badge && <em className="side__badge" aria-label={`${badge} غير مقروءة`}>{badge > 99 ? "99+" : badge}</em>}
    </Link>
  );

  const onLogout = async () => {
    if (await confirmAction({ title: "تسجيل الخروج؟", text: "ستحتاج لإدخال البريد وكلمة المرور مرة أخرى.", confirmText: "تسجيل الخروج" })) {
      await logout();
    }
  };

  return (
    <>
      <div className="topbar">
        <button className="topbar__menu" onClick={() => setOpen(true)} aria-label="فتح القائمة"><Menu size={22} /></button>
        <img src="/assets/img/logo-light.png" alt="المتحدة للمظلات" className="topbar__logo" />
      </div>

      <div className={"side__backdrop" + (open ? " is-open" : "")} onClick={() => setOpen(false)} />

      <aside className={"side" + (open ? " is-open" : "")} aria-label="أقسام لوحة التحكم">
        <div className="side__head">
          <img src="/assets/img/logo-light.png" alt="المتحدة للمظلات" className="side__logo" />
          <button className="side__close" onClick={() => setOpen(false)} aria-label="إغلاق القائمة"><X size={20} /></button>
        </div>

        <nav className="side__nav">
          {link("/dashboard", "الرئيسية", LayoutDashboard)}
          <p className="side__label">أقسام الموقع</p>
          {items.map((it) => (
            <Fragment key={it.key}>{link(`/dashboard/${it.key}`, it.title, sectionIcons[it.icon], it.badge)}</Fragment>
          ))}
          <p className="side__label">الحساب</p>
          {link("/dashboard/account", "كلمة المرور", KeyRound)}
        </nav>

        <div className="side__foot">
          <a href="/" target="_blank" rel="noopener" className="side__link">
            <ExternalLink size={18} />
            <span>عرض الموقع</span>
          </a>
          <div className="side__user">
            <span title={email}>{email}</span>
            <button type="button" className="side__logout" onClick={onLogout} aria-label="تسجيل الخروج" title="تسجيل الخروج"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}
