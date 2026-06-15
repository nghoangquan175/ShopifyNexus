"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/app/cart/cartActions";

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  specs: { title: string; desc: string; icon: string }[];
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    selectedOptions: Array<{ name: string; value: string }>;
  }>;
  productType?: string;
  collection?: { title: string; handle: string };
}

// Map of mock products
const PRODUCT_CATALOG: Record<string, ProductDetail> = {
  "1": {
    id: "1",
    title: "Apex Pro Hardshell Jacket",
    description: "The ultimate shield for high-altitude pursuits, engineered for uncompromising performance and minimalist elegance.",
    price: 450.0,
    originalPrice: 550.0,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlqEcwQIL60Z80x5qVlRFXo6ODje7DxGhqRdkquL96JH3XSr3OBryCTlUfNTN39-EMMG5xw6uR-Z_Rp0osW-nWg5T4B-BmTVoqnxpcXsp8hBc-TAvGaX0xtXKETY2FJDH5Zh8NdeCxMyI5pZ5WuuT5pPdQfAIg8CNeuyO6xUXa9D4O8Bxs6n6LJFfMcUl4BrJ7B6VtQGZGPlaPkUm1sdcJf8DCqfP0lFGC_-Zr4YHcWJObI_hRQPXDyVTpgs9jKpG_86HnXiC9fT0N",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO1IQ-zcqcm_U1dJUjpn15Av8FOqqMfbIWmxnn2Dm3n-nFA_oQgClA2WPkzszJfu1D9WXwLMbyiEO3QLdRNc_VRsp6PLVkjOuy3rSBJcj6CYz5XFR1JUOUaTvgIawmQ6_jwcWb92p_IqLYPfvxkSLCZ_GvhahaZTwwMXF9Uuk8DUdRjWgj3nOAMUyADNeAq3e1MajOUgH57bFyupzmrGK51cCWECseXNZq7xJuJrvjS2iBx7xNG2vNRnGNM47MPrZCbmE4Pg4e3EU0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLeyU34gFc9QTMTJRilGfIpTJEktG1eD10_6FlXMNLmxFTzHfWFjkVMoGSk3MMVawISWBR9H5O3J9a4tocYtRKQcuzSUx_o_69UR37hEG0s_2x2pkW0gKK3mQoQEO7HDtBEZwww_9gzgiSqqGw-1FjpVZ-WGTjoAO-tnY1Ue9j59sFD7oIBzVKme4mwG7439sfUayohZ8l96rEMbQw3z-fzSLwMOSki1x226tizYCXW69M1bWlFJ0ZrpucLpMtqexgqJ8U0ieMLcLf"
    ],
    colors: [
      { name: "Deep Mountain Blue", hex: "#041627" },
      { name: "Sunset Terracotta", hex: "#a23f00" },
      { name: "Slate Mist", hex: "#8192a7" }
    ],
    sizes: ["S", "M", "L", "XL"], // XL will be disabled in UI
    specs: [
      {
        title: "Waterproofing",
        desc: "3-layer Gore-Tex Pro shell with DWR finish. 28,000mm hydrostatic head rating ensures total protection in torrential downpours.",
        icon: "water"
      },
      {
        title: "Breathability",
        desc: "Exceptional moisture vapor transfer rate (RET < 6) keeps you dry from the inside out during high-output activities.",
        icon: "wind"
      },
      {
        title: "Weight",
        desc: "Ultralight design weighing only 340g (Size M). Packs down to the size of a grapefruit in its own integrated pocket.",
        icon: "scale"
      },
      {
        title: "Materials",
        desc: "100% recycled nylon face fabric. YKK AquaGuard® zippers throughout. Cohaesive™ embedded cord-lock system.",
        icon: "layers"
      }
    ]
  }
};

// Return Apex Alpine Jacket by default if ID not found, so page never breaks
function getProductById(id: string): ProductDetail {
  return PRODUCT_CATALOG[id] || PRODUCT_CATALOG["1"];
}

export default function ProductClient({
  productId,
  initialShopifyProduct,
  isLoggedIn = false,
}: {
  productId: string;
  initialShopifyProduct?: ProductDetail | null;
  isLoggedIn?: boolean;
}) {
  const product = initialShopifyProduct || getProductById(productId);

  const [activeImage, setActiveImage] = useState(product.images[0] || "/placeholder.png");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: "Default", hex: "#7F7F7F" });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [cartAdded, setCartAdded] = useState(false);

  const router = useRouter();

  const handleAddToCart = async () => {
    setCartAdded(true);

    let targetVariantId = product.id;

    if (product.variants && product.variants.length > 0) {
      const matchedVariant = product.variants.find((v) => {
        return v.selectedOptions.every((opt) => {
          const optName = opt.name.toLowerCase();
          if (optName === "color" || optName === "màu sắc") {
            return opt.value === selectedColor.name;
          }
          if (optName === "size" || optName === "kích thước") {
            return opt.value === selectedSize;
          }
          return true;
        });
      });
      if (matchedVariant) {
        targetVariantId = matchedVariant.id;
      } else {
        targetVariantId = product.variants[0].id;
      }
    }

    try {
      const res = await addToCartAction(targetVariantId, 1);
      if (res?.error) {
        console.error("Error adding to Shopify cart:", res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to execute addToCartAction:", err);
    }

    setTimeout(() => setCartAdded(false), 2000);
  };

  const collectionTitle = product.collection?.title || "Gear";
  const collectionHandle = product.collection?.handle || "gear";
  const productType = product.productType || "Jackets";

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant mb-8 font-body-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/collections/${collectionHandle}`} className="hover:text-primary transition-colors capitalize">
              {collectionTitle}
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-on-surface-variant capitalize">
              {productType}
            </span>
          </li>
          <li className="flex items-center gap-1" aria-current="page">
            <svg className="h-3.5 w-3.5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-primary font-medium">{product.title}</span>
          </li>
        </ol>
      </nav>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] md:aspect-square bg-surface-container rounded-xl overflow-hidden shadow-sm group">
            <Image
              alt={product.title}
              src={activeImage}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white text-primary font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm font-display">
                New Arrival
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square bg-surface-container rounded-lg overflow-hidden shadow-sm transition-all ${
                  activeImage === img ? "ring-2 ring-primary" : "hover:opacity-90"
                }`}
              >
                <Image
                  alt={`${product.title} gallery ${index + 1}`}
                  src={img}
                  fill
                  sizes="150px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 font-display">
              {product.title}
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mb-8 flex items-baseline gap-4 border-b border-outline-variant/30 pb-6">
            <span className="text-3xl font-bold text-primary font-display">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg line-through text-on-surface-variant font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-display">Color</h3>
              <span className="text-sm font-medium text-on-surface-variant">
                {selectedColor.name}
              </span>
            </div>
            <div className="flex gap-4">
              {product.colors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-12 h-12 rounded-full border border-outline-variant/50 transition-all ${
                      isSelected ? "ring-4 ring-offset-2 ring-primary scale-105" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-display">Size</h3>
              <button className="text-xs font-bold text-secondary hover:underline uppercase tracking-wider font-display">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((size) => {
                const isDisabled = size === "XL"; // Keep XL disabled to match design system spec
                const isSelected = selectedSize === size;
                
                return (
                  <button
                    key={size}
                    disabled={isDisabled}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border rounded-lg text-sm font-bold transition-all font-display ${
                      isDisabled
                        ? "border-outline-variant bg-surface-container-low text-outline cursor-not-allowed opacity-55"
                        : isSelected
                        ? "border-primary bg-primary text-white scale-[1.02] shadow-sm"
                        : "border-outline-variant bg-transparent text-primary hover:border-primary hover:bg-surface-container-low"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-bold py-4 rounded-lg transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display ${
                cartAdded
                  ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                  : "bg-secondary hover:bg-secondary-container text-white"
              }`}
            >
              {cartAdded ? "Added to Cart!" : "Add to Cart"}
              {!cartAdded && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

          </div>

          {/* Trust Badges / Shipping Info */}
{/* Trust Badges / Shipping Info */}
          <div className="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80 bg-surface-container-low p-4 rounded-lg">
            <div>• Free priority shipping on orders over $200</div>
            <div>• Free 30-day returns & exchanges</div>
            <div>• Lifetime warranty on manufacturing defects</div>
          </div>
        </div>
      </div>

      {/* Details & Specs Section */}
      <div className="border-t border-outline-variant/20 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 font-display">Technical Specifications</h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Designed meticulously in our Alpine Lab, every stitch serves a purpose. The Apex series redefines weight-to-warmth ratio.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {product.specs.map((spec) => (
              <div key={spec.title}>
                <h4 className="text-base font-bold text-primary mb-2 flex items-center gap-2 font-display">
                  {spec.icon === "water" && (
                    <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  )}
                  {spec.icon === "wind" && (
                    <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {spec.icon === "scale" && (
                    <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  )}
                  {spec.icon === "layers" && (
                    <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {spec.title}
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
