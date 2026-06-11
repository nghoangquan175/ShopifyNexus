import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayoutConfigurator from "@/components/LayoutConfigurator";
import { headers } from "next/headers";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopifyNexus - Premium Expeditionary Goods",
  description: "Equipping modern explorers with uncompromising gear for the world's most demanding environments.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAccountPage = pathname === "/account" || pathname.startsWith("/account/");

  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${isAccountPage ? "auth-page" : ""}`}>
      <body className="flex min-h-screen flex-col bg-background text-on-background antialiased">
        <LayoutConfigurator />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
