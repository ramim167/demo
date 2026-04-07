"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

import { CartLine, PatchOption } from "@/lib/types";

const STORAGE_KEY = "vanta-kits-cart";

interface AddToCartPayload {
  productId: string;
  productSlug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  size: string;
  unitPrice: number;
  heroTag: string;
  accent: string;
  customName?: string;
  customNumber?: number;
  patches: PatchOption[];
}

interface CartContextValue {
  items: CartLine[];
  isOpen: boolean;
  subtotal: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (lineId: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const subtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  function addItem(payload: AddToCartPayload) {
    const patchSignature = payload.patches
      .map((patch) => patch.id)
      .sort()
      .join(",");

    setItems((current) => {
      const existing = current.find((line) => {
        const lineSignature = line.patches
          .map((patch) => patch.id)
          .sort()
          .join(",");

        return (
          line.productId === payload.productId &&
          line.variantId === payload.variantId &&
          line.size === payload.size &&
          line.customName === payload.customName &&
          line.customNumber === payload.customNumber &&
          lineSignature === patchSignature
        );
      });

      if (existing) {
        return current.map((line) =>
          line.id === existing.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }

      return [
        ...current,
        {
          id: crypto.randomUUID(),
          quantity: 1,
          ...payload
        }
      ];
    });

    setIsOpen(true);
  }

  function removeItem(lineId: string) {
    setItems((current) => current.filter((line) => line.id !== lineId));
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        subtotal,
        addItem,
        removeItem,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
