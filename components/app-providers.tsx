"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { CatalogProvider } from "@/components/catalog-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>{children}</CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
