import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";

import "@/app/globals.css";
import { AppProviders } from "@/components/app-providers";
import { SideCart } from "@/components/side-cart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const displayFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Vanta Kits",
  description: "Premium sports jersey storefront starter built with Next.js and Tailwind CSS."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AppProviders>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute left-[-8rem] top-[-5rem] h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
            <div className="pointer-events-none absolute right-[-9rem] top-8 h-[30rem] w-[30rem] rounded-full bg-[#d8e4ff] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(91,124,250,0.12),_transparent_60%)]" />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <SideCart />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
