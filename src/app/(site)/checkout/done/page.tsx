import type { Metadata } from "next";
import { StoreShell, storeSettings } from "@/components/store/StoreShell";
import { DoneView } from "@/components/store/DoneView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تم استلام طلبك | المتحدة للمظلات", robots: { index: false, follow: false } };

export default async function DonePage() {
  const { whatsapp } = await storeSettings();
  return (
    <StoreShell step={2} title="تأكيد الطلب">
      <DoneView whatsapp={whatsapp} />
    </StoreShell>
  );
}
