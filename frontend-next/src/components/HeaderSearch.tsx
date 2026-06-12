"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface SuggestionProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface SuggestionCollection {
  id: string;
  title: string;
  handle: string;
}

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<SuggestionProduct[]>([]);
  const [collections, setCollections] = useState<SuggestionCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input and lock scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle debouncing search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch predictive results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      setCollections([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search/predictive?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setCollections(data.collections || []);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  return (
    <>
      {/* Search Icon Trigger */}
      <button
        onClick={() => setIsOpen(true)}
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
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-center items-start pt-[10vh] px-4 md:px-0 transition-opacity duration-300">
          <div
            ref={modalRef}
            className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden transform transition-all duration-300 scale-100"
          >
            {/* Header / Search Input Area */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/20">
              <svg className="h-6 w-6 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-lg text-primary placeholder-on-surface-variant/50 focus:ring-0 p-0"
                placeholder="Search products, collections, or gear..."
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all"
                  aria-label="Clear query"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <span className="h-6 w-[1px] bg-outline-variant/30 hidden md:block" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="hidden md:block px-3 py-1 rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container transition-all"
              >
                ESC
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all md:hidden"
                aria-label="Close search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>

            {/* Results Panel */}
            <div className="flex-grow overflow-y-auto divide-y divide-outline-variant/10">
              {isLoading && (
                <div className="py-12 flex justify-center items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                </div>
              )}

              {!isLoading && !query.trim() && (
                <div className="px-6 py-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 font-display">
                    Popular Collections
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["Gear", "Expeditions", "Sustainability"].map((col) => (
                      <Link
                        key={col}
                        href={`/collections/${col.toLowerCase()}`}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-sm text-primary font-medium hover:bg-surface-container transition-all"
                      >
                        {col}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && query.trim() && products.length === 0 && collections.length === 0 && (
                <div className="py-16 text-center">
                  <svg className="mx-auto h-12 w-12 text-outline-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="mt-4 text-base font-medium text-primary">No results found for "{query}"</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Check your spelling or try search terms.</p>
                </div>
              )}

              {!isLoading && collections.length > 0 && (
                <div className="px-6 py-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 font-display">
                    Matching Collections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.handle}`}
                        onClick={() => setIsOpen(false)}
                        className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed border border-transparent hover:border-tertiary-fixed text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && products.length > 0 && (
                <div className="px-6 py-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 font-display">
                    Suggested Products
                  </h3>
                  <div className="flex flex-col gap-3">
                    {products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.handle}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-surface-container transition-all group"
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden">
                          {prod.featuredImage?.url ? (
                            <Image
                              src={prod.featuredImage.url}
                              alt={prod.featuredImage.altText || prod.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-on-surface-variant">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-semibold text-primary truncate group-hover:text-secondary transition-colors font-display">
                            {prod.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {formatPrice(prod.priceRange.minVariantPrice.amount, prod.priceRange.minVariantPrice.currencyCode)}
                          </p>
                        </div>
                        <svg className="h-5 w-5 text-on-surface-variant/40 group-hover:text-primary transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form Submit CTA */}
            {query.trim() && (
              <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
                <span>Press <kbd className="font-semibold bg-surface-container px-1 py-0.5 rounded">Enter</kbd> to search for all results</span>
                <button
                  onClick={handleSubmit}
                  className="font-bold text-secondary hover:text-secondary-container transition-colors"
                >
                  View All &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
