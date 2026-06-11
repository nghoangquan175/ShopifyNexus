"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface SearchProduct {
  id: string;
  title: string;
  series: string;
  rating: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  imageUrl: string;
  tags: string[];
}

const SEARCH_PRODUCTS: SearchProduct[] = [
  {
    id: "boots-1",
    title: "Summit Pro GTX Trekking Boot",
    series: "Alpine Series",
    rating: 4.9,
    price: 345.0,
    badge: "New Arrival",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUfGdTUzaykCpFcYG6A3i1UxgbfmMRzC6glBRosXuRN_LSDQ1wEMieB4yk6k2rMzrc_K94LtP3ORY7ezrCJGKlkGkq6dOZ1aS4-CgQ9vY-O6TxDnGw2vHQcT74WgWD2reROE7bu5Hgm0zjzXWZUPHFacZU9Ol9FzgFGoE-8t0bCBZb9oM369w-47D5s5_MebfKamD8l2U_yITJ7b1pdIz9fObMTDZt4UpN7Epx7H5p9bSrD2gUHioruryYisJl7jhwp1_J5LplcJI5",
    tags: ["Footwear", "Men's", "Waterproof", "Hiking Boots", "GTX"],
  },
  {
    id: "boots-2",
    title: "AeroRidge Approach Shoe",
    series: "Fast & Light",
    rating: 4.7,
    price: 210.0,
    badge: "Bestseller",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiDOK1YWQbPWwu5Kcy9lnZ6EbtW2loodJYM3ARoeBO2UVp-lLLlmVTnW92RU1OV7NFLBsAOHOUMYCQqQ8GapAV6OpDo8oScr46SBc4XV_HfuQP3Prqj71SOGt7an6_YgCupGJY238gysc4tgkj6pWr9T7l_nEdr22SrZ0ax5Lt_eETTBlSah9DHebGjAObqOd66f9pf8WXRJgpyzIkGDm9UW9ovjsTuxpQzbtdxq-wAOAEkKOq2JKc2sWaWZ2RBi5V1-TbdoE82ec3",
    tags: ["Footwear", "Approach", "Waterproof", "Agility"],
  },
  {
    id: "boots-3",
    title: "Everest Ascent 8000 Series",
    series: "Expedition Grade",
    rating: 5.0,
    price: 650.0,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdh6lvMBTnmmF1e9Ux0slHggYJRHGT_LPQA1cKsRajYiTWRAKX0bymhSOJbLNg7S0tnQIHiQyKznumeqzXEEe6arC0Psp1FlkYuRzGfpj-nEBgcJTQvHEDGBXr8FO7C9ETWSNgRzO0kjhYo2SUaKrrm9aYaYU3IwJWBY5lKSCkc9Jqhl_8FtEPrK_a0GG9bMT0r0jzHisP8tzUy0w7kfZjHKFt_026vEk259FGxnQDE0M-7vLc9eYeQBKsT-FJ_xx6HAnqr8Izkhl7",
    tags: ["Footwear", "Mountaineering", "Waterproof", "Everest"],
  },
  {
    id: "boots-4",
    title: "Nimbus Trail Crusher Mid",
    series: "Trail Runner",
    rating: 4.6,
    price: 144.5,
    originalPrice: 170.0,
    badge: "Sale 15%",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHP7pf-e5IJk3Gv2PgT7jk8ddccbyFFrQE8Kjj3k98GSJSBADGO-tFELj8Ye4Dp4AgJgzfHdhLQc2UM2W7E5K8efxReqV7VeTXD0OvEWnPFYvYeX9A2xUMMag50ReNd3aVQzFe1W1WzZ_4e1FpKe2quWrLr9kiBFClSgJQlZOby0KjTFEwZfrqMT-AH_uNupqKj05vdMOyGkM-LoEz4xOYAA6GzGANroZrryipcfLrSbhnxDboVF018-l6FpJOjAo2qGWBjSPxBl2K",
    tags: ["Footwear", "Men's", "Trail Running", "Nimbus"],
  },
  {
    id: "jacket-1",
    title: "Apex Pro Hardshell Jacket",
    series: "Alpine Series",
    rating: 4.5,
    price: 599.0,
    badge: "New Arrival",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHg6zQZ3zw8m92u-W_mTu-DsCknOb_WirwtjrHP0HDtz_bs7Tm4j_LUmxA_XujVxLJcHYE-8aVY6jAJekHWZmJesbRbxWZH8kTFxG7FIMDSza1DY5-Lh22qRL5qaMpjCdkDP1ZC-ezzGv122ycLcRAb3nz7j_mEBagAw39fg24PRQI2G11CY1ncgAQMAN_kZZ1-kJeXlZ1kIMosbhIh-VGhFxXRJ79_P6kAPgsabr0esOILHQmd33PKsA5YncbW2u3vqOdqVd5Fopw",
    tags: ["Outerwear", "Waterproof", "Alpine", "GORE-TEX"],
  }
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize search input from URL parameter or empty
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(["Footwear"]);
  const [favorites, setFavorites] = useState<string[]>(["boots-4"]); // Nimbus has favorite filled in design
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearQuery = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/search?${params.toString()}`);
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return SEARCH_PRODUCTS.filter((product) => {
      // Query filter
      const searchQuery = searchParams.get("q") || "";
      const matchesQuery = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      // Active filters
      const matchesFilters =
        activeFilters.length > 0
          ? product.tags.some((t) => activeFilters.includes(t)) ||
            activeFilters.some((f) => product.title.toLowerCase().includes(f.toLowerCase()))
          : true;

      return matchesQuery && matchesFilters;
    });
  }, [searchParams, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const searchQueryValue = searchParams.get("q") || "";

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Search Header & Input Area */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto w-full gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-display">
          Explore Equipment
        </h1>
        <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Find the perfect gear for your next high-altitude pursuit or rugged trail exploration.
        </p>

        <form onSubmit={handleSearchSubmit} className="w-full relative mt-4">
          <div className="flex items-center w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full px-6 py-4 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <svg className="h-5 w-5 text-on-surface-variant mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-primary placeholder-on-surface-variant/60 focus:ring-0 p-0 text-base"
              placeholder="Search for gear, brands, or activities..."
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="ml-2 p-1 text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/40 text-primary text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-1.5 font-display">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
          
          {/* Active / Available Filter Pills */}
          {["Footwear", "Men's", "Waterproof", "Outerwear"].map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1 font-display ${
                  isActive
                    ? "bg-tertiary-fixed text-on-tertiary-fixed border-transparent"
                    : "bg-surface-container-lowest border-outline-variant/40 text-primary hover:bg-surface-container-low"
                }`}
              >
                {filter}
                {isActive && (
                  <svg className="h-3.5 w-3.5 ml-1 cursor-pointer hover:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Info Bar */}
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-primary font-display">
          Results for <span className="text-secondary italic">"{searchQueryValue || "All Gear"}"</span>
        </h2>
        <span className="text-sm text-on-surface-variant font-medium">
          Showing {Math.min(filteredProducts.length, visibleCount)} of {filteredProducts.length} items
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-outline-variant/50 rounded-xl max-w-xl mx-auto w-full">
          <svg className="mx-auto h-12 w-12 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-primary font-display">No results found</h3>
          <p className="mt-2 text-sm text-on-surface-variant">We couldn't find anything matching your search term.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((product) => {
            const isFavorite = favorites.includes(product.id);
            const isSaleCard = product.badge?.includes("Sale");

            return (
              <article key={product.id} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-surface-container-low block">
                  <Image
                    alt={product.title}
                    src={product.imageUrl}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                        isSaleCard ? "bg-secondary text-white" : "bg-tertiary-fixed/90 text-on-tertiary-fixed"
                      }`}>
                        {product.badge}
                      </span>
                    </div>
                  )}
                </Link>
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Toggle favorite"
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-primary hover:text-secondary shadow-sm transition-colors"
                  >
                    <svg className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-display">
                      {product.series}
                    </p>
                    <div className="flex items-center gap-1 text-secondary">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.828l-3.978 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.77-.577-.372-1.828.583-1.828h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-xs font-semibold text-primary">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <Link href={`/products/${product.id}`} className="hover:text-secondary transition-colors">
                    <h3 className="text-base font-bold text-primary mb-2 line-clamp-2 font-display">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-lg font-bold font-display ${isSaleCard ? "text-secondary" : "text-primary"}`}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-on-surface-variant font-medium">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {!isSaleCard && (
                        <Link href={`/products/${product.id}`} className="w-10 h-10 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-all shadow-sm">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </Link>
                      )}
                    </div>

                    {isSaleCard && (
                      <Link href={`/products/${product.id}`} className="w-full text-center mt-2 bg-primary hover:bg-secondary text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors font-display block">
                        Add to Cart
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Load More Button */}
      {filteredProducts.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 text-sm"
          >
            Load More Results
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
