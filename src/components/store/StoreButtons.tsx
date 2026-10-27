"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, cartCount, useCart, useHydrated, type CartItem } from "./cart";

const Ico = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <use href={`#i-${id}`} />
  </svg>
);

/** Adds a shade type to the cart, then takes the visitor to the cart page. */
export function AddToCartButton({ item, label }: { item: Omit<CartItem, "meters">; label: string }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={"btn btn--primary btn--block shopc__buy" + (added ? " is-added" : "")}
      onClick={() => {
        cart.add(item);
        setAdded(true);
        // brief "added" state before moving on to the cart
        setTimeout(() => router.push("/cart"), 450);
      }}
      disabled={added}
    >
      <Ico id={added ? "check" : "bag"} className="ico" /> {added ? "تمت الإضافة" : label}
    </button>
  );
}

/** Header cart icon with item count. */
export function CartButton() {
  const items = useCart();
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;
  return (
    <Link href="/cart" className="cartbtn" aria-label={count ? `السلة — ${count} منتجات` : "السلة"}>
      <Ico id="bag" />
      {count > 0 && <span className="cartbtn__count">{count}</span>}
    </Link>
  );
}
