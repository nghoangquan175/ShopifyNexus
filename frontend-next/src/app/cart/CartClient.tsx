"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
  checkoutAction,
  clearCartCookieAction,
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
  const [cartId, setCartId] = useState<string | null>(null);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const checkoutWindowRef = useRef<Window | null>(null);

  // Load cart on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await getCartAction();
        if (cart) {
          setItems(cart.items);
          setCartId(cart.id);
          setHasRealCart(true);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, []);

  // Polling for payment completion
  useEffect(() => {
    if (!isWaitingPayment || !cartId) return;

    let isSubscribed = true;
    let apiCheckCounter = 0;

    const interval = setInterval(async () => {
      // Check if checkout tab is closed by the user
      if (checkoutWindowRef.current && checkoutWindowRef.current.closed) {
        clearInterval(interval);
        setIsWaitingPayment(false);
        return;
      }

      apiCheckCounter++;
      if (apiCheckCounter >= 3) {
        apiCheckCounter = 0;
        try {
          const res = await fetch(
            `/api/checkout/status?cartId=${encodeURIComponent(cartId)}`,
          );
          if (!res.ok) throw new Error("Status check failed");
          const data = await res.json();

          if (isSubscribed && data.status === "completed") {
            clearInterval(interval);
            setIsWaitingPayment(false);
            if (
              checkoutWindowRef.current &&
              !checkoutWindowRef.current.closed
            ) {
              checkoutWindowRef.current.close();
            }
            await clearCartCookieAction();
            // Redirect to success page
            window.location.href = `/checkout/success?cartId=${encodeURIComponent(cartId)}`;
          }
        } catch (err) {
          console.error("Error checking checkout status:", err);
        }
      }
    }, 5000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isWaitingPayment, cartId]);

  const handleMockPaymentSuccess = async () => {
    if (checkoutWindowRef.current && !checkoutWindowRef.current.closed) {
      checkoutWindowRef.current.close();
    }
    if (!cartId) return;
    const token = cartId.split("/").pop();
    try {
      const res = await fetch("/api/webhooks/shopify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-shopify-topic": "orders/create",
          "x-mock-webhook": "true",
        },
        body: JSON.stringify({
          cart_token: token,
          id: "mock-order-id-12345",
        }),
      });
      if (res.ok) {
        console.log("Mock payment webhook sent successfully.");
        await clearCartCookieAction();
        window.location.href = `/checkout/success?cartId=${encodeURIComponent(cartId)}`;
      } else {
        console.error("Failed to send mock payment webhook.");
      }
    } catch (err) {
      console.error("Error calling mock webhook:", err);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
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
        const win = window.open(res.checkoutUrl, "_blank");
        checkoutWindowRef.current = win;
        setIsWaitingPayment(true);
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
          <span className="text-on-surface-variant font-medium">0 items</span>
        </div>

        <div className="py-24 text-center border border-dashed border-outline-variant/50 rounded-xl bg-surface-container-lowest">
          <svg
            className="mx-auto h-12 w-12 text-outline"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-primary font-display">
            Your cart is empty
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            Looking for inspiration? Browse our collections to get started.
          </p>
          <Link
            href="/collections"
            className="mt-6 inline-block px-8 py-3 bg-primary hover:bg-secondary text-white rounded-full text-sm font-semibold transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-on-surface-variant flex items-start gap-3 bg-surface-container-low/50 p-4 rounded-lg">
          <svg
            className="h-5 w-5 text-primary shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>
            Complimentary carbon-neutral shipping on all expedition gear orders
            over $200. Returns accepted within 30 days of delivery.
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
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.stockStatus === "In Stock"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                            : "bg-secondary-fixed text-on-secondary-fixed-variant"
                        }`}
                      >
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
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 12H6"
                          />
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
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12M6 12h12"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors uppercase tracking-wider font-display"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-on-surface-variant flex items-start gap-3 bg-surface-container-low/50 p-4 rounded-lg">
            <svg
              className="h-5 w-5 text-primary shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>
              Complimentary carbon-neutral shipping on all expedition gear
              orders over $200. Returns accepted within 30 days of delivery.
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
                <span className="text-primary font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                <span>Estimated Shipping</span>
                <span className="text-primary font-semibold">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                <span>Taxes</span>
                <span className="text-on-surface-variant text-xs">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-6 mb-8 flex justify-between items-end">
              <span className="text-base font-bold text-primary font-display">
                Total
              </span>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold text-primary leading-none block font-display">
                  ${subtotal.toFixed(2)}
                </span>
                <span className="text-xs text-on-surface-variant mt-1 block font-medium">
                  USD
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center gap-2 group text-sm uppercase tracking-wider font-display disabled:opacity-60 cursor-pointer"
            >
              {isCheckoutLoading ? "Preparing checkout..." : "Buy now"}
              {!isCheckoutLoading && (
                <svg
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>

            
          </div>
        </aside>
      </div>

      {/* Loading Overlay for checkout */}
      {isWaitingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md transition-all duration-300">
          <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center backdrop-blur-lg">
            {/* Spinning Circle */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-white animate-spin" />
              <svg
                className="h-10 w-10 text-white animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>

            <p className="text-zinc-200 text-sm font-medium mb-8 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              Waiting for payment in new tab...
            </p>

            <div className="flex items-center gap-3 justify-center w-full">
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={handleMockPaymentSuccess}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-md text-[11px] uppercase tracking-wider font-display cursor-pointer"
                >
                  Mock Pay
                </button>
              )}
              <button
                onClick={() => {
                  if (
                    checkoutWindowRef.current &&
                    !checkoutWindowRef.current.closed
                  ) {
                    checkoutWindowRef.current.close();
                  }
                  setIsWaitingPayment(false);
                }}
                className={`${
                  process.env.NODE_ENV === "development" ? "flex-1" : "w-full"
                } bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-md text-[11px] uppercase tracking-wider font-display cursor-pointer`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
