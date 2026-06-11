"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  outOfStock?: boolean;
}

const CATEGORIES = [
  "Outerwear",
  "Technical Footwear",
  "Expedition Packs",
  "Shelters & Tents",
  "Accessories",
];
const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
  { name: "Deep Mountain Blue", class: "bg-primary" },
  { name: "Sunset Terracotta", class: "bg-secondary" },
  { name: "Slate Mist", class: "bg-outline-variant" },
  { name: "Obsidian Black", class: "bg-[#1A1A1A]" },
  { name: "Alpine Red", class: "bg-[#8C2A2A]" },
];

export default function CollectionClient({
  handle,
  initialProducts = [],
  initialTitle,
  initialDescription,
}: {
  handle: string;
  initialProducts?: Product[];
  initialTitle?: string;
  initialDescription?: string;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("Recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Map handle to header title/desc (fallback if props not provided)
  const collectionInfo = useMemo(() => {
    if (initialTitle) {
      return {
        title: initialTitle,
        description: initialDescription || "",
      };
    }
    const formatted = handle.replace(/-/g, " ");
    const title = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return {
      title: title === "Gear" ? "Expedition Gear" : title,
      description:
        "Engineered for the extremes. Explore our premium collection of high-altitude apparel, technical packs, and advanced shelter systems designed to elevate your next ascent.",
    };
  }, [handle, initialTitle, initialDescription]);

  // Dynamically compute filters from initialProducts
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [initialProducts]);

  const sizesList = useMemo(() => {
    const szs = new Set<string>();
    initialProducts.forEach((p) => {
      p.sizes.forEach((s) => szs.add(s));
    });
    return Array.from(szs);
  }, [initialProducts]);

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
    initialProducts.forEach((p) => {
      p.colors.forEach((c) => cls.add(c));
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
  }, [initialProducts]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(
        (p) =>
          p.sizes.includes("One Size") ||
          p.sizes.some((s) => selectedSizes.includes(s)),
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c)),
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max,
    );

    // Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest Arrivals") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [
    initialProducts,
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    sortBy,
  ]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

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
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex text-sm text-on-primary-container mb-8"
      >
        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="h-3 w-3 text-outline"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/collections"
              className="hover:text-primary transition-colors"
            >
              Collections
            </Link>
          </li>
          <li className="flex items-center gap-2" aria-current="page">
            <svg
              className="h-3 w-3 text-outline"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-primary font-semibold">
              {collectionInfo.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-16 border-b border-outline-variant/30 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            {collectionInfo.title}
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {collectionInfo.description}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-surface-container-low border border-outline-variant/50 rounded-lg text-primary font-semibold transition-all hover:bg-surface-container"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filter & Sort
        </button>

        {/* Desktop Sort */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-on-surface-variant text-sm font-medium">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-primary font-semibold focus:ring-0 cursor-pointer p-0 pr-8 text-sm focus:outline-none"
          >
            <option>Recommended</option>
            <option>Newest Arrivals</option>
            <option>Price: High to Low</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Content Layout: Sidebar + Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar (Filters) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            {/* Category Filter */}
            <div className="border-b border-outline-variant/30 pb-6">
              <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                Category
              </h3>
              <ul className="space-y-3">
                {categoriesList.map((cat) => (
                  <li key={cat} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`cat-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-outline-variant text-secondary focus:ring-secondary w-4.5 h-4.5"
                    />
                    <label
                      htmlFor={`cat-${cat}`}
                      className="text-sm text-on-surface-variant hover:text-primary cursor-pointer select-none"
                    >
                      {cat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

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
                      className={`w-10 h-10 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
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

            {/* Color Filter */}
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
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filters & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-sm text-on-surface-variant font-medium">
              Showing{" "}
              <span className="font-semibold text-primary">
                {filteredProducts.length}
              </span>{" "}
              results
            </p>
            {(selectedCategories.length > 0 ||
              selectedSizes.length > 0 ||
              selectedColors.length > 0) && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-semibold text-primary cursor-pointer hover:bg-surface-container hover:text-secondary transition-all"
                  >
                    {cat}
                    <svg
                      className="h-3 w-3"
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
                  </span>
                ))}
                {selectedSizes.map((size) => (
                  <span
                    key={size}
                    onClick={() => toggleSize(size)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-semibold text-primary cursor-pointer hover:bg-surface-container hover:text-secondary transition-all"
                  >
                    Size: {size}
                    <svg
                      className="h-3 w-3"
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
                  </span>
                ))}
                {selectedColors.map((col) => (
                  <span
                    key={col}
                    onClick={() => toggleColor(col)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-semibold text-primary cursor-pointer hover:bg-surface-container hover:text-secondary transition-all"
                  >
                    {col}
                    <svg
                      className="h-3 w-3"
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
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-secondary hover:underline font-bold transition-all"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Grid Layout */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-outline-variant rounded-xl">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-primary font-display">
                No products found
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Try modifying your filters or search terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-full text-sm font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">
              {filteredProducts.map((product) => {
                if (product.isFeatured) {
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col sm:col-span-2 lg:col-span-1 bg-primary text-white rounded-xl shadow-[0_12px_40px_rgba(4,22,39,0.12)] hover:shadow-[0_20px_50px_rgba(4,22,39,0.2)] transition-all duration-300 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/30">
                          Pro Choice
                        </span>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="relative w-full h-64 bg-primary-container overflow-hidden block"
                      >
                        <Image
                          alt={product.title}
                          src={product.imageUrl}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </Link>
                      <div className="p-6 flex flex-col flex-grow relative z-10">
                        <Link
                          href={`/products/${product.id}`}
                          className="hover:text-secondary-fixed transition-colors"
                        >
                          <h3 className="text-xl font-bold text-white mb-2 font-display">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-on-primary-container/90 mb-6 flex-grow leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-2xl font-bold text-white font-display">
                            ${product.price.toFixed(2)}
                          </span>
                          <Link
                            href={`/products/${product.id}`}
                            className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary-container text-white font-bold transition-all text-sm shadow-[0_4px_12px_rgba(162,63,0,0.3)]"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={product.id}
                    className={`group flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative ${
                      product.outOfStock ? "opacity-75" : ""
                    }`}
                  >
                    {/* Badges */}
                    {product.isNew && !product.outOfStock && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          New Arrival
                        </span>
                      </div>
                    )}
                    {product.outOfStock && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-outline-variant/80 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    <button className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full text-on-surface-variant hover:text-secondary hover:bg-white transition-all">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>

                    <Link
                      href={`/products/${product.id}`}
                      className="relative w-full h-64 bg-surface-container-low overflow-hidden block"
                    >
                      <Image
                        alt={product.title}
                        src={product.imageUrl}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-secondary">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const isHalf = i + 0.5 === product.rating;
                            const isFull = i < Math.floor(product.rating);
                            return (
                              <svg
                                key={i}
                                className="h-4 w-4"
                                fill={
                                  isFull || isHalf ? "currentColor" : "none"
                                }
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
                            );
                          })}
                        </div>
                        <span className="text-xs text-outline-variant font-medium">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="hover:text-secondary transition-colors"
                      >
                        <h3 className="text-lg font-bold text-primary leading-tight mb-1 font-display">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-on-surface-variant mb-4 flex-grow line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-primary font-display">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.outOfStock ? (
                          <button className="px-4 py-2 rounded-full border border-outline-variant text-outline hover:border-primary hover:text-primary transition-all text-xs font-bold bg-transparent">
                            Notify Me
                          </button>
                        ) : (
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-outline hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
              disabled
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold">
              1
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              3
            </button>
            <span className="text-on-surface-variant">...</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              8
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-primary hover:border-primary transition-colors">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
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

            {/* Mobile Category */}
            <div className="border-b border-outline-variant/30 pb-6 mb-6">
              <h3 className="text-sm font-bold tracking-wider text-primary uppercase mb-4 font-display">
                Category
              </h3>
              <ul className="space-y-3">
                {categoriesList.map((cat) => (
                  <li key={cat} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`mob-cat-${cat}`}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-outline-variant text-secondary focus:ring-secondary w-4.5 h-4.5"
                    />
                    <label
                      htmlFor={`mob-cat-${cat}`}
                      className="text-sm text-on-surface-variant hover:text-primary cursor-pointer select-none"
                    >
                      {cat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Size */}
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
                      className={`w-10 h-10 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
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

            {/* Mobile Color */}
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
