import Link from "next/link";
import Image from "next/image";
import { shopifyGetShopId } from "@/lib/shopify";

export default async function Footer() {
  const shopId = await shopifyGetShopId();
  return (
    <footer className="bg-primary text-white font-sans border-t border-primary-container">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-16 w-full flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Left Column: Brand & Logo */}
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.png"
              alt="ShopifyNexus Logo"
              width={100}
              height={100}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-[#8192a7] mb-8 leading-relaxed">
            Equipping modern explorers with uncompromising gear for the world's
            most demanding environments.
          </p>
          <div className="flex gap-4">
            {/* Social icons */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Menus */}
        <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs font-display">
              Support
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/support/shipping"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <a
                  href={`https://shopify.com/${shopId || "101276778628"}/account`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Request a Return
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs font-display">
              Company
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-[#8192a7] hover:text-secondary transition-colors"
                >
                  Newsletter Signup
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-[#8192a7]">
        <p>© 2026 ShopifyNexus Expeditionary Goods. All rights reserved.</p>
      </div>
    </footer>
  );
}
