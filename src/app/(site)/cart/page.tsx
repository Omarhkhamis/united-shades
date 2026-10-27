import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { CartView } from "@/components/store/CartView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سلة المشتريات | المتحدة للمظلات", robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <StoreShell step={0} title="سلة المشتريات">
      <CartView />
    </StoreShell>
  );
}
