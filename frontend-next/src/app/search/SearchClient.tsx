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
  sizes: string[];
  colors: string[];
  outOfStock?: boolean;
}

const SEARCH_PRODUCTS: SearchProduct[] = [
  {
    id: "boots-1",
    title: "Summit Pro GTX Trekking Boot",
    series: "Alpine Series",
    rating: 4.9,
    price: 345.0,
    badge: "New Arrival",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUfGdTUzaykCpFcYG6A3i1UxgbfmMRzC6glBRosXuRN_LSDQ1wEMieB4yk6k2rMzrc_K94LtP3ORY7ezrCJGKlkGkq6dOZ1aS4-CgQ9vY-O6TxDnGw2vHQcT74WgWD2reROE7bu5Hgm0zjzXWZUPHFacZU9Ol9FzgFGoE-8t0bCBZb9oM369w-47D5s5_MebfKamD8l2U_yITJ7b1pdIz9fObMTDZt4UpN7Epx7H5p9bSrD2gUHioruryYisJl7jhwp1_J5LplcJI5",
    tags: ["Footwear", "Men's", "Waterproof", "Hiking Boots", "GTX"],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    colors: ["Deep Mountain Blue", "Obsidian Black"],
  },
  {
    id: "boots-2",
    title: "AeroRidge Approach Shoe",
    series: "Fast & Light",
    rating: 4.7,
    price: 210.0,
    badge: "Bestseller",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiDOK1YWQbPWwu5Kcy9lnZ6EbtW2loodJYM3ARoeBO2UVp-lLLlmVTnW92RU1OV7NFLBsAOHOUMYCQqQ8GapAV6OpDo8oScr46SBc4XV_HfuQP3Prqj71SOGt7an6_YgCupGJY238gysc4tgkj6pWr9T7l_nEdr22SrZ0ax5Lt_eETTBlSah9DHebGjAObqOd66f9pf8WXRJgpyzIkGDm9UW9ovjsTuxpQzbtdxq-wAOAEkKOq2JKc2sWaWZ2RBi5V1-TbdoE82ec3",
    tags: ["Footwear", "Approach", "Waterproof", "Agility"],
    sizes: ["US 8", "US 9", "US 10"],
    colors: ["Slate Mist", "Obsidian Black"],
  },
  {
    id: "boots-3",
    title: "Everest Ascent 8000 Series",
    series: "Expedition Grade",
    rating: 5.0,
    price: 650.0,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdh6lvMBTnmmF1e9Ux0slHggYJRHGT_LPQA1cKsRajYiTWRAKX0bymhSOJbLNg7S0tnQIHiQyKznumeqzXEEe6arC0Psp1FlkYuRzGfpj-nEBgcJTQvHEDGBXr8FO7C9ETWSNgRzO0kjhYo2SUaKrrm9aYaYU3IwJWBY5lKSCkc9Jqhl_8FtEPrK_a0GG9bMT0r0jzHisP8tzUy0w7kfZjHKFt_026vEk259FGxnQDE0M-7vLc9eYeQBKsT-FJ_xx6HAnqr8Izkhl7",
    tags: ["Footwear", "Mountaineering", "Waterproof", "Everest"],
    sizes: ["US 9", "US 10", "US 11"],
    colors: ["Alpine Red", "Obsidian Black"],
  },
  {
    id: "boots-4",
    title: "Nimbus Trail Crusher Mid",
    series: "Trail Runner",
    rating: 4.6,
    price: 144.5,
    originalPrice: 170.0,
    badge: "Sale 15%",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHP7pf-e5IJk3Gv2PgT7jk8ddccbyFFrQE8Kjj3k98GSJSBADGO-tFELj8Ye4Dp4AgJgzfHdhLQc2UM2W7E5K8efxReqV7VeTXD0OvEWnPFYvYeX9A2xUMMag50ReNd3aVQzFe1W1WzZ_4e1FpKe2quWrLr9kiBFClSgJQlZOby0KjTFEwZfrqMT-AH_uNupqKj05vdMOyGkM-LoEz4xOYAA6GzGANroZrryipcfLrSbhnxDboVF018-l6FpJOjAo2qGWBjSPxBl2K",
    tags: ["Footwear", "Men's", "Trail Running", "Nimbus"],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    colors: ["Deep Mountain Blue", "Obsidian Black", "Slate Mist"],
  },
  {
    id: "jacket-1",
    title: "Apex Pro Hardshell Jacket",
    series: "Alpine Series",
    rating: 4.5,
    price: 599.0,
    badge: "New Arrival",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHg6zQZ3zw8m92u-W_mTu-DsCknOb_WirwtjrHP0HDtz_bs7Tm4j_LUmxA_XujVxLJcHYE-8aVY6jAJekHWZmJesbRbxWZH8kTFxG7FIMDSza1DY5-Lh22qRL5qaMpjCdkDP1ZC-ezzGv122ycLcRAb3nz7j_mEBagAw39fg24PRQI2G11CY1ncgAQMAN_kZZ1-kJeXlZ1kIMosbhIh-VGhFxXRJ79_P6kAPgsabr0esOILHQmd33PKsA5YncbW2u3vqOdqVd5Fopw",
    tags: ["Outerwear", "Waterproof", "Alpine", "GORE-TEX"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sunset Terracotta", "Obsidian Black"],
  },
];

function mapShopifyProductToSearchProduct(prod: any): SearchProduct {
  const price = parseFloat(prod.priceRange?.minVariantPrice?.amount || "0");
  const compareAtPrice = prod.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(prod.compareAtPriceRange.minVariantPrice.amount)
    : undefined;

  let series = "Gear";
  const seriesTag = prod.tags?.find((tag: string) =>
    tag.toLowerCase().startsWith("series:"),
  );
  if (seriesTag) {
    series = seriesTag.split(":")[1]?.trim() || "Gear";
  } else if (prod.tags && prod.tags.length > 0) {
    series = prod.tags[0];
  }

  let badge = undefined;
  const badgeTag = prod.tags?.find((tag: string) =>
    tag.toLowerCase().startsWith("badge:"),
  );
  if (badgeTag) {
    badge = badgeTag.split(":")[1]?.trim();
  } else if (compareAtPrice && compareAtPrice > price) {
    const discount = Math.round(
      ((compareAtPrice - price) / compareAtPrice) * 100,
    );
    badge = `Sale ${discount}%`;
  }

  let rating = 4.5;
  if (prod.title) {
    const hash = prod.title
      .split("")
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    rating = 4.0 + (hash % 11) / 10;
  }

  const colorOption = prod.options?.find(
    (opt: any) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "màu sắc"
  );
  const colors = colorOption ? colorOption.values : ["Default"];

  const sizeOption = prod.options?.find(
    (opt: any) => opt.name.toLowerCase() === "size" || opt.name.toLowerCase() === "kích thước"
  );
  const sizes = sizeOption ? sizeOption.values : ["One Size"];

  const outOfStock =
    prod.variants?.edges?.length > 0 &&
    prod.variants.edges.every((edge: any) => edge.node.currentlyNotInStock);

  return {
    id: prod.handle,
    title: prod.title,
    series,
    rating: parseFloat(rating.toFixed(1)),
    price,
    originalPrice:
      compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    badge,
    imageUrl: prod.featuredImage?.url || "/placeholder.png",
    tags: prod.tags || [],
    sizes,
    colors,
    outOfStock,
  };
}

interface SearchClientProps {
  initialProducts?: any[];
  initialPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export default function SearchClient({
  initialProducts = [],
  initialPageInfo = { hasNextPage: false, endCursor: null },
}: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize search input from URL parameter or empty
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["boots-4"]); // Nimbus has favorite filled in design
  const [visibleCount, setVisibleCount] = useState(8);
  const [shopifyProducts, setShopifyProducts] = useState<SearchProduct[]>([]);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const baseProducts = useMemo(() => {
    return isUsingFallback ? SEARCH_PRODUCTS : shopifyProducts;
  }, [isUsingFallback, shopifyProducts]);

  const sizesList = useMemo(() => {
    const szs = new Set<string>();
    baseProducts.forEach((p) => {
      if (p.sizes) {
        p.sizes.forEach((s) => szs.add(s));
      }
    });
    return Array.from(szs);
  }, [baseProducts]);

  const colorsList = useMemo(() => {
    const colorMapping: Record<string, string> = {
      "deep mountain blue": "bg-primary",
      "sunset terracotta": "bg-secondary",
      "slate mist": "bg-outline-variant",
      "obsidian black": "bg-[#1A1A1A]",
      black: "bg-black",
      white: "bg-white border border-outline-variant",
      "alpine red": "bg-[#8C2A2A]",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      grey: "bg-gray-500",
      gray: "bg-gray-500",
      yellow: "bg-yellow-400",
      orange: "bg-orange-500",
    };

    const cls = new Set<string>();
    baseProducts.forEach((p) => {
      if (p.colors) {
        p.colors.forEach((c) => cls.add(c));
      }
    });

    return Array.from(cls).map((c) => {
      const lower = c.toLowerCase();
      let bgClass = "bg-primary"; // fallback
      for (const [key, val] of Object.entries(colorMapping)) {
        if (lower.includes(key)) {
          bgClass = val;
          break;
        }
      }
      return { name: c, class: bgClass };
    });
  }, [baseProducts]);

  const tagsList = useMemo(() => {
    const tgs = new Set<string>();
    baseProducts.forEach((p) => {
      if (p.tags) {
        p.tags.forEach((t) => {
          if (!t.includes(":")) {
            tgs.add(t);
          }
        });
      }
    });
    return Array.from(tgs).slice(0, 10);
  }, [baseProducts]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName],
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  // Initialize query on mount
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setDebouncedQuery(q);

    // If we have initialProducts and there is no search query, map and set them
    if (!q && initialProducts.length > 0) {
      const mapped = initialProducts.map(mapShopifyProductToSearchProduct);
      setShopifyProducts(mapped);
      setPageInfo(initialPageInfo);
      setIsUsingFallback(false);
    } else if (!q && initialProducts.length === 0) {
      setShopifyProducts([]);
      setPageInfo({ hasNextPage: false, endCursor: null });
      setIsUsingFallback(true);
    }
  }, [initialProducts, initialPageInfo]);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Update URL search params silently when debouncedQuery changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedQuery.trim()) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  }, [debouncedQuery]);

  // Fetch products from Shopify search API based on debouncedQuery
  useEffect(() => {
    // If query is empty, and we have initial products, we don't need to fetch - we already set it in mount or can set it here
    if (!debouncedQuery.trim()) {
      if (initialProducts.length > 0) {
        const mapped = initialProducts.map(mapShopifyProductToSearchProduct);
        setShopifyProducts(mapped);
        setPageInfo(initialPageInfo);
        setIsUsingFallback(false);
      } else {
        setShopifyProducts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setIsUsingFallback(true);
      }
      setIsLoading(false);
      return;
    }

    const fetchShopifyProducts = async () => {
      setIsLoading(true);
      setIsUsingFallback(false);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.products && data.products.length > 0) {
            const mapped = data.products.map(mapShopifyProductToSearchProduct);
            setShopifyProducts(mapped);
            setPageInfo(data.pageInfo || { hasNextPage: false, endCursor: null });
          } else {
            setShopifyProducts([]);
            setPageInfo({ hasNextPage: false, endCursor: null });
            setIsUsingFallback(true);
          }
        } else {
          setShopifyProducts([]);
          setPageInfo({ hasNextPage: false, endCursor: null });
          setIsUsingFallback(true);
        }
      } catch (err) {
        console.error("Error fetching Shopify products:", err);
        setShopifyProducts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopifyProducts();
  }, [debouncedQuery, initialProducts, initialPageInfo]);

  // Load More handler
  const loadMore = async () => {
    if (isUsingFallback) {
      setVisibleCount((prev) => prev + 8);
      return;
    }

    if (!pageInfo.hasNextPage || !pageInfo.endCursor) return;

    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}&cursor=${encodeURIComponent(pageInfo.endCursor)}&limit=8`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.products) {
          const mapped = data.products.map(mapShopifyProductToSearchProduct);
          setShopifyProducts((prev) => [...prev, ...mapped]);
          setPageInfo(data.pageInfo || { hasNextPage: false, endCursor: null });
        }
      }
    } catch (err) {
      console.error("Error loading more Shopify products:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle Search Submission (prevent page reload)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = isUsingFallback ? SEARCH_PRODUCTS : shopifyProducts;

    // Query filter
    if (isUsingFallback && debouncedQuery) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          product.series.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(debouncedQuery.toLowerCase()),
          )
      );
    }

    // Active tag filters (top pills)
    if (activeFilters.length > 0) {
      result = result.filter(
        (product) =>
          product.tags.some((t) => activeFilters.includes(t)) ||
          activeFilters.some((f) =>
            product.title.toLowerCase().includes(f.toLowerCase()),
          )
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(
        (product) =>
          product.sizes.includes("One Size") ||
          product.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Price filter
    result = result.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    return result;
  }, [debouncedQuery, activeFilters, shopifyProducts, isUsingFallback, selectedSizes, selectedColors, priceRange]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };



  return (
    <div className="w-full flex flex-col gap-12">
      {/* Search Header & Input Area */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto w-full gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-display">
          Explore Equipment
        </h1>
        <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Find the perfect gear for your next high-altitude pursuit or rugged
          trail exploration.
        </p>

        <form onSubmit={handleSearchSubmit} className="w-full relative mt-4">
          <div className="flex items-center w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full px-6 py-4 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <svg
              className="h-5 w-5 text-on-surface-variant mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/40 text-primary text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-1.5 font-display"
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Filters
          </button>

          {/* Active / Available Filter Pills */}
          {tagsList.map((filter) => {
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
                  <svg
                    className="h-3.5 w-3.5 ml-1 cursor-pointer hover:text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
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
          Results for{" "}
          <span className="text-secondary italic">
            "{debouncedQuery || "All Gear"}"
          </span>
        </h2>
        <span className="text-sm text-on-surface-variant font-medium font-sans">
          {isUsingFallback ? (
            <>Showing {Math.min(filteredProducts.length, visibleCount)} of {filteredProducts.length} items</>
          ) : (
            <>Showing {filteredProducts.length} {pageInfo.hasNextPage ? "items" : `of ${filteredProducts.length} items`}</>
          )}
        </span>
      </div>

      {/* Content Layout: Sidebar + Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar (Filters) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            {/* Price Filter */}
            <div className="border-b border-outline-variant/30 pb-6">
              <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: Number(e.target.value),
                        })
                      }
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-md py-2 pl-7 pr-2 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <span className="text-outline-variant">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-md py-2 pl-7 pr-2 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            {sizesList.length > 0 && (
              <div className="border-b border-outline-variant/30 pb-6">
                <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? "border-secondary bg-secondary text-white"
                            : "border-outline-variant/50 hover:border-primary text-primary bg-transparent"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {colorsList.length > 0 && (
              <div>
                <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colorsList.map((col) => {
                    const isSelected = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        onClick={() => toggleColor(col.name)}
                        title={col.name}
                        className={`w-8 h-8 rounded-full ${col.class} border border-outline-variant/30 transition-transform hover:scale-110 relative ${
                          isSelected ? "ring-2 ring-offset-2 ring-secondary" : ""
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid Column */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="py-24 text-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-outline-variant/50 rounded-xl max-w-xl mx-auto w-full">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-primary font-display">
                No results found
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                We couldn't find anything matching your search filters. Try adjusting them or clear all.
              </p>
              {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < 1000) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-primary transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(isUsingFallback ? filteredProducts.slice(0, visibleCount) : filteredProducts).map((product) => {
                  const isFavorite = favorites.includes(product.id);
                  const isSaleCard = product.badge?.includes("Sale");

                  return (
                    <article
                      key={product.id}
                      className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="relative aspect-square overflow-hidden bg-surface-container-low block"
                      >
                        <Image
                          alt={product.title}
                          src={product.imageUrl}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                                isSaleCard
                                  ? "bg-secondary text-white"
                                  : "bg-tertiary-fixed/90 text-on-tertiary-fixed"
                              }`}
                            >
                              {product.badge}
                            </span>
                          </div>
                        )}
                      </Link>


                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-display">
                            {product.series}
                          </p>
                          <div className="flex items-center gap-1 text-secondary">
                            <svg
                              className="h-3.5 w-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.828l-3.978 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.77-.577-.372-1.828.583-1.828h4.907a1 1 0 00.95-.69l1.519-4.674z"
                              />
                            </svg>
                            <span className="text-xs font-semibold text-primary">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="hover:text-secondary transition-colors"
                        >
                          <h3 className="text-base font-bold text-primary mb-2 line-clamp-2 font-display">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="mt-auto pt-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-lg font-bold font-display ${isSaleCard ? "text-secondary" : "text-primary"}`}
                              >
                                ${product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs line-through text-on-surface-variant font-medium">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {!isSaleCard && (
                              <Link
                                href={`/products/${product.id}`}
                                className="w-10 h-10 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-all shadow-sm"
                              >
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                  />
                                </svg>
                              </Link>
                            )}
                          </div>

                          {isSaleCard && (
                            <Link
                              href={`/products/${product.id}`}
                              className="w-full text-center mt-2 bg-primary hover:bg-secondary text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors font-display block"
                            >
                              Add to Cart
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              {/* Load More Button */}
              {((isUsingFallback && filteredProducts.length > visibleCount) || (!isUsingFallback && pageInfo.hasNextPage)) && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? "Loading..." : "Load More Results"}
                    {!isLoadingMore && (
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-6 px-6 shadow-xl transition-all">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-6">
              <h2 className="text-lg font-bold text-primary font-display">
                Filters
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-on-surface-variant hover:text-primary"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Price */}
            <div className="border-b border-outline-variant/30 pb-6 mb-6">
              <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: Number(e.target.value),
                        })
                      }
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-md py-2 pl-7 pr-2 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary focus:outline-none"
                    />
                  </div>
                  <span className="text-outline-variant">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-md py-2 pl-7 pr-2 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Size */}
            {sizesList.length > 0 && (
              <div className="border-b border-outline-variant/30 pb-6 mb-6">
                <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? "border-secondary bg-secondary text-white"
                            : "border-outline-variant/50 hover:border-primary text-primary bg-transparent"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile Color */}
            {colorsList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colorsList.map((col) => {
                    const isSelected = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        onClick={() => toggleColor(col.name)}
                        className={`w-8 h-8 rounded-full ${col.class} border border-outline-variant/30 transition-transform hover:scale-110 relative ${
                          isSelected ? "ring-2 ring-offset-2 ring-secondary" : ""
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-3 bg-surface-container-high text-primary hover:bg-surface-container font-semibold rounded-lg transition-all mb-3 text-sm"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-primary text-white hover:bg-secondary font-semibold rounded-lg transition-all text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
