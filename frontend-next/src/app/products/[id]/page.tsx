import ProductClient from "./ProductClient";
import { shopifyFetch } from "@/lib/shopify";
import { cookies } from "next/headers";

// Define TypeScript interfaces for Shopify response
interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
        };
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface ShopifyProductData {
  product: ShopifyProduct | null;
}

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

// Helper to map Shopify product to ProductDetail interface
function mapShopifyProduct(shopifyProduct: ShopifyProduct) {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const originalPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : undefined;

  const images = shopifyProduct.images.edges.map((edge) => edge.node.url) || [];

  // Extract color values from options
  const colorOption = shopifyProduct.options.find(
    (opt) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "màu sắc"
  );
  
  const colorHexMap: Record<string, string> = {
    "black": "#1A1A1A",
    "black/charcoal": "#2A2A2A",
    "blue": "#041627",
    "navy": "#0B1D3A",
    "gray": "#8192a7",
    "grey": "#8192a7",
    "white": "#FFFFFF",
    "red": "#8C2A2A",
    "orange": "#a23f00",
    "terracotta": "#a23f00",
    "sunset terracotta": "#a23f00",
    "deep mountain blue": "#041627",
    "slate mist": "#8192a7",
  };

  const colors = colorOption
    ? colorOption.values.map((val) => {
        const lowerVal = val.toLowerCase();
        const hex =
          colorHexMap[lowerVal] ||
          colorHexMap[
            Object.keys(colorHexMap).find((k) => lowerVal.includes(k)) || ""
          ] ||
          "#7F7F7F";
        return { name: val, hex };
      })
    : [{ name: "Default", hex: "#7F7F7F" }];

  // Extract size values from options
  const sizeOption = shopifyProduct.options.find(
    (opt) => opt.name.toLowerCase() === "size" || opt.name.toLowerCase() === "kích thước"
  );
  const sizes = sizeOption ? sizeOption.values : ["One Size"];

  const specs = [
    {
      title: "Materials",
      desc: "Premium grade materials built for sustainability and extreme longevity in rugged environments.",
      icon: "layers",
    },
    {
      title: "Weight & Packability",
      desc: "Designed to optimize weight-to-performance ratio, making it easy to carry on long treks.",
      icon: "scale",
    },
    {
      title: "Weather Resistance",
      desc: "Engineered to withstand natural elements and keep you protected in changing weather conditions.",
      icon: "water",
    },
  ];

  const variants = shopifyProduct.variants?.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    price: parseFloat(edge.node.price.amount),
    selectedOptions: edge.node.selectedOptions.map((opt) => ({
      name: opt.name,
      value: opt.value,
    })),
  })) || [];

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    description: shopifyProduct.description || "No description provided.",
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    images: images.length > 0 ? images : ["/placeholder.png"],
    colors,
    sizes,
    specs,
    variants,
  };
}

export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" }
  ];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let shopifyProductMapped = null;

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("shopify_customer_token")?.value;

  // If ID is not a numeric string (which is used for mock details), try fetching from Shopify
  const isMockId = /^\d+$/.test(id);

  if (!isMockId) {
    try {
      const res = await shopifyFetch<ShopifyProductData>({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle: id },
        cache: "no-store", // Check latest details
      });

      if (res.body.data.product) {
        shopifyProductMapped = mapShopifyProduct(res.body.data.product);
      }
    } catch (err) {
      console.error("Failed to fetch Shopify product for handle:", id, err);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <ProductClient key={id} productId={id} initialShopifyProduct={shopifyProductMapped} isLoggedIn={isLoggedIn} />
    </div>
  );
}
