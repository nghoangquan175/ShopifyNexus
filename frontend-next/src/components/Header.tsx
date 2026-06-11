import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { shopifyGetCart } from "@/lib/cart";

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  const profileLink = token ? "/account" : "/account/login";
  
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  let cartItemCount = 0;
  if (cartId) {
    const cart = await shopifyGetCart(cartId);
    cartItemCount = cart?.totalQuantity || 0;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-16 w-full">
        {/* Left: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="ShopifyNexus Logo"
            width={100}
            height={100}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center-Right: Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          <Link
            href="/collections"
            className="hover:text-primary transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/collections/gear"
            className="hover:text-primary transition-colors"
          >
            Gear
          </Link>
          <Link
            href="/collections/expeditions"
            className="hover:text-primary transition-colors"
          >
            Expeditions
          </Link>
          <Link
            href="/collections/sustainability"
            className="hover:text-primary transition-colors"
          >
            Sustainability
          </Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-6 text-on-surface-variant">
          {/* Search Icon */}
          <Link
            href="/search"
            className="p-2 hover:text-primary transition-colors scale-95 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Search"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>

          {/* User Profile / Login */}
          <Link
            href={profileLink}
            className="p-2 hover:text-primary transition-colors scale-95 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Account"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* Wishlist Icon */}
          <button
            className="p-2 hover:text-primary transition-colors scale-95 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Wishlist"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 hover:text-primary transition-colors scale-95 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Cart"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
