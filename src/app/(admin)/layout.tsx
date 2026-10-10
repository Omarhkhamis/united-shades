import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "sweetalert2/dist/sweetalert2.min.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم | المتحدة للمظلات", template: "%s | لوحة التحكم" },
  icons: { icon: { url: "/assets/img/favicon.png", type: "image/png" } },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <body className="dash" suppressHydrationWarning>{children}</body>
    </html>
  );
}
