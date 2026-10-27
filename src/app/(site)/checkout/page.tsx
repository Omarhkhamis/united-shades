import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { CheckoutView } from "@/components/store/CheckoutView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "إتمام الطلب | المتحدة للمظلات", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <StoreShell step={1} title="إتمام الطلب">
      <CheckoutView />
    </StoreShell>
  );
}
