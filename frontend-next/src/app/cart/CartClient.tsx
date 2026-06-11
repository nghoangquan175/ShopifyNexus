"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
  checkoutAction,
} from "./cartActions";

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  imageUrl: string;
  color: string;
  variantInfo: string;
  quantity: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
}

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [hasRealCart, setHasRealCart] = useState(false);

  // Load cart on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await getCartAction();
        if (cart) {
          setItems(cart.items);
          setHasRealCart(true);
        } else {
          // If no real Shopify cart exists in cookies, load the beautiful mock cart for visual presentation
          setItems([
            {
              id: "backpack",
              variantId: "backpack",
              title: "Ascent Pro Alpine Backpack",
              price: 345.0,
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn030Vjs6v5kF08Dm8rJRfZeVKP0Ff9wXTfbPe2-p84nx7CY7CVeVyv84LZ9slDDkwmHbIXc-kQXWJwgyQVqs7XKDghpJpgDk2VKWQw2allKmmfBfPHC8atWPKjidSU4SEBeRoWgxd7gfYZGNb5kbLf8eoBvzoK78mJ4MqBFhhTkxDBkdx5vgz9nT5Q6GD_0UyK_7vGpgDA-9hIAVLCS3u2b909Z475BGgGjyahrq0EOU0FTvA5T0Xq2GCNWIPaarZBLGGo3Uka-2U",
              color: "Slate Mist",
              variantInfo: "45L Capacity",
              quantity: 1,
              stockStatus: "In Stock",
            },
            {
              id: "jacket",
              variantId: "jacket",
              title: "Meridian Hardshell Jacket",
              price: 580.0,
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyEzjuLr-nPBScI4k_zKWKuqfCAnYwq3fUk3Aji3nkBCYtcGTyvu9qXWKxqrHgq82vyDx3QNdEWwTYgG-T3eGjBuEj3ykeKAQ0CssHMQDR_d4FRNcAc9an1YF-8afA7MpnuWgpx9iuOh12A7nGXEpnq8h8YDlZp5M8ztNkTYCWY4R1f0WwkZlzGnwlLMal_GtzfK_3WrrpzcGSJpO2O0SjQZONmzKdl4HI5Xajq9h1-atis4q1LjztGhzEKA2FoRz0R6znL-0qfqr9",
              color: "Sunset Terracotta",
              variantInfo: "Size: L",
              quantity: 1,
              stockStatus: "Low Stock",
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    // If it's a real Shopify item, call server action
    if (id.startsWith("gid://shopify/")) {
      const item = items.find((i) => i.id === id);
      if (item) {
        const newQty = Math.max(1, item.quantity + delta);
        const res = await updateCartLineAction(id, newQty);
        if (res?.error) {
          console.error("Failed to update cart line:", res.error);
        }
      }
    }
  };

  const removeItem = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((item) => item.id !== id));

    // If it's a real Shopify item, call server action
    if (id.startsWith("gid://shopify/")) {
      const res = await removeCartLineAction(id);
      if (res?.error) {
        console.error("Failed to remove cart line:", res.error);
      }
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await checkoutAction(items);
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else if (res?.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error("Checkout redirection failed:", err);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          <section className="w-full lg:w-2/3">
            <div className="h-10 bg-surface-container-low w-48 rounded-md mb-8" />
            <div className="space-y-6">
              <div className="h-32 bg-surface-container-low rounded-xl w-full" />
              <div className="h-32 bg-surface-container-low rounded-xl w-full" />
            </div>
          </section>
          <aside className="w-full lg:w-1/3">
            <div className="h-96 bg-surface-container-low rounded-2xl w-full" />
          </aside>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight font-display">
            Your Equipment
          </h1>
          <span className="text-on-surface-variant font-medium">
            0 items
          </span>
        </div>

        <div className="py-24 text-center border border-dashed border-outline-variant/50 rounded-xl bg-surface-container-lowest">
          <svg className="mx-auto h-12 w-12 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-primary font-display">Your cart is empty</h3>
          <p className="mt-2 text-sm text-on-surface-variant">Looking for inspiration? Browse our collections to get started.</p>
          <Link
            href="/collections"
            className="mt-6 inline-block px-8 py-3 bg-primary hover:bg-secondary text-white rounded-full text-sm font-semibold transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-on-surface-variant flex items-start gap-3 bg-surface-container-low/50 p-4 rounded-lg">
          <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Complimentary carbon-neutral shipping on all expedition gear orders over $200. Returns accepted within 30 days of delivery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Cart Items Section */}
        <section className="w-full lg:w-2/3">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight font-display">
              Your Equipment
            </h1>
            <span className="text-on-surface-variant font-medium">
              {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant/20 hover:shadow-[0_12px_40px_rgba(26,43,60,0.04)] transition-shadow duration-300"
              >
                <div className="relative w-full sm:w-40 h-40 sm:h-48 bg-surface-container-low rounded-lg overflow-hidden shrink-0">
                  <Image
                    alt={item.title}
                    src={item.imageUrl}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover object-center"
                  />
                </div>

                <div className="flex flex-col justify-between flex-grow py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold leading-tight text-primary mb-1 font-display">
                        {item.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant mb-2">
                        Color: {item.color} / {item.variantInfo}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.stockStatus === "In Stock"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : "bg-secondary-fixed text-on-secondary-fixed-variant"
                      }`}>
                        {item.stockStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg md:text-xl font-bold text-primary font-display">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-6 sm:mt-0">
                    <div className="flex items-center border border-outline-variant/50 rounded-full bg-surface-container-lowest">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-bold text-primary text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors uppercase tracking-wider font-display"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-on-surface-variant flex items-start gap-3 bg-surface-container-low/50 p-4 rounded-lg">
            <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Complimentary carbon-neutral shipping on all expedition gear orders over $200. Returns accepted within 30 days of delivery.
            </p>
          </div>
        </section>

        {/* Order Summary Section */}
        <aside className="w-full lg:w-1/3 lg:sticky lg:top-28">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_12px_40px_rgba(26,43,60,0.06)] border border-outline-variant/30">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 border-b border-outline-variant/20 pb-4 font-display">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                <span>Subtotal</span>
                <span className="text-primary font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                <span>Estimated Shipping</span>
                <span className="text-primary font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                <span>Taxes</span>
                <span className="text-on-surface-variant text-xs">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-6 mb-8 flex justify-between items-end">
              <span className="text-base font-bold text-primary font-display">Total</span>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold text-primary leading-none block font-display">
                  ${subtotal.toFixed(2)}
                </span>
                <span className="text-xs text-on-surface-variant mt-1 block font-medium">USD</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center gap-2 group text-sm uppercase tracking-wider font-display disabled:opacity-60 cursor-pointer"
            >
              {isCheckoutLoading ? "Preparing checkout..." : "Proceed to Checkout"}
              {!isCheckoutLoading && (
                <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            <div className="mt-6 flex justify-center gap-6 text-outline opacity-60">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
