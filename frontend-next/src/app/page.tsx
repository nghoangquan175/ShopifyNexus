import Link from "next/link";
import Image from "next/image";
import { shopifyFetch } from "@/lib/shopify";
import Hero from "./components/Hero";
import FeaturedCollections from "./components/FeaturedCollections";
import Sustainability from "./components/Sustainability";

type ImageNode = {
  url: string;
  altText: string | null;
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: Array<{
      node: ImageNode;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

type HomepageProductsData = {
  products: {
    edges: Array<{
      node: ProductNode;
    }>;
  };
};

const PRODUCTS_QUERY = `
  query getHomepageProducts {
    products(first: 8) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export default async function Home() {
  let products: ProductNode[] = [];
  let errorMsg = "";

  try {
    const res = await shopifyFetch<HomepageProductsData>({
      query: PRODUCTS_QUERY,
      cache: "force-cache",
      tags: ["homepage-products"],
    });
    
    products = res.body.data.products?.edges?.map((e) => e.node) || [];
  } catch (err: any) {
    console.error("Error fetching homepage products:", err);
    errorMsg = err.message || "Failed to load products.";
  }

  // Format currency helper
  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Collections Bento Grid */}
      <FeaturedCollections />

      {/* 3. Dynamic Shopify Products Grid */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full border-t border-outline-variant/30">
        <div className="mb-12 flex items-baseline justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Top Gear & Essentials
          </h2>
          <Link
            href="/collections/gear"
            className="text-sm font-semibold text-secondary hover:text-secondary-container transition-colors"
          >
            Shop All Gear &rarr;
          </Link>
        </div>

        {errorMsg ? (
          <div className="bg-red-50/50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm max-w-xl">
            <strong className="font-semibold">Shopify Connection Note: </strong>
            <span>{errorMsg}</span>
            <p className="text-xs mt-1 text-red-500">
              Please double check that .env.local contains the correct credentials.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant text-sm">
            No products found. Please add products to your Shopify store.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => {
              const firstImg = product.images.edges[0]?.node;
              const price = product.priceRange.minVariantPrice;

              return (
                <div key={product.id} className="group relative flex flex-col justify-between">
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/30 group-hover:shadow-md transition-all duration-300">
                    {firstImg ? (
                      <Image
                        src={firstImg.url}
                        alt={firstImg.altText || product.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-secondary transition-colors">
                      <Link href={`/products/${product.handle}`}>
                        <span className="absolute inset-0" />
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(price.amount, price.currencyCode)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Sustainability Section */}
      <Sustainability />
    </div>
  );
}
