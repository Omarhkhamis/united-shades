"use client";

import { useSyncExternalStore } from "react";

/**
 * Demo shopping cart kept in the visitor's browser (localStorage).
 * Nothing is charged: checkout only turns the cart into a quote request.
 */
export type CartItem = {
  id: string;
  title: string;
  type: string;
  image: string;
  unitPrice: number; // starting price per meter (SAR)
  meters: number;
};

export type PlacedOrder = {
  number: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string; city: string; district: string; date: string; slot: string };
  payment: string;
};

const CART_KEY = "us-cart-v1";
const ORDER_KEY = "us-last-order-v1";
export const DEFAULT_METERS = 10;
export const MAX_METERS = 5000;

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

const clampMeters = (n: number) => Math.min(MAX_METERS, Math.max(1, Math.round(Number.isFinite(n) ? n : 1)));

function isItem(x: unknown): x is CartItem {
  const i = x as CartItem;
  return !!i && typeof i.id === "string" && typeof i.title === "string" && typeof i.unitPrice === "number" && typeof i.meters === "number";
}

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cache = Array.isArray(raw) ? raw.filter(isItem).map((i) => ({ ...i, meters: clampMeters(i.meters) })) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* private mode / storage full — the cart still works for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // keep several open tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(item: Omit<CartItem, "meters">, meters = DEFAULT_METERS) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    write(
      existing
        ? items.map((i) => (i.id === item.id ? { ...i, ...item, meters: clampMeters(i.meters + meters) } : i))
        : [...items, { ...item, meters: clampMeters(meters) }],
    );
  },
  setMeters(id: string, meters: number) {
    write(read().map((i) => (i.id === id ? { ...i, meters: clampMeters(meters) } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.unitPrice * i.meters, 0);
export const cartCount = (items: CartItem[]) => items.length;

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** false during server render / hydration, true once running in the browser */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function saveOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

// memoized on the stored string so it is a stable snapshot for useSyncExternalStore
let orderRaw: string | null | undefined;
let orderParsed: PlacedOrder | null = null;
export function loadOrder(): PlacedOrder | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
  if (raw !== orderRaw) {
    orderRaw = raw;
    try {
      const o = JSON.parse(raw || "null");
      orderParsed = o && typeof o.number === "string" && Array.isArray(o.items) ? (o as PlacedOrder) : null;
    } catch {
      orderParsed = null;
    }
  }
  return orderParsed;
}

export const sar = (n: number) => n.toLocaleString("en-US");
