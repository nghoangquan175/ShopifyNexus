import CollectionClient from "./CollectionClient";
import { shopifyFetch } from "@/lib/shopify";

export async function generateStaticParams() {
  return [
    { handle: "gear" },
    { handle: "expeditions" },
    { handle: "sustainability" },
  ];
}

const COLLECTION_PRODUCTS_QUERY = `
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            handle
            productType
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
            images(first: 1) {
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
            variants(first: 20) {
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
                  currentlyNotInStock
                }
              }
            }
          }
        }
      }
    }
  }
`;

const ALL_PRODUCTS_QUERY = `
  query getAllProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          handle
          productType
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
          images(first: 1) {
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
          variants(first: 20) {
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
                currentlyNotInStock
              }
            }
          }
        }
      }
    }
  }
`;

export async function shopifyGetCollectionProducts(handle: string) {
  try {
    const res = await shopifyFetch<any>({
      query: COLLECTION_PRODUCTS_QUERY,
      variables: { handle },
      cache: "no-store",
    });
    return res.body.data?.collection || null;
  } catch (err) {
    console.error("Error fetching shopify collection products:", err);
    return null;
  }
}

export async function shopifyGetProducts() {
  try {
    const res = await shopifyFetch<any>({
      query: ALL_PRODUCTS_QUERY,
      cache: "no-store",
    });
    return res.body.data?.products || null;
  } catch (err) {
    console.error("Error fetching shopify all products:", err);
    return null;
  }
}

export function mapShopifyCollectionProduct(node: any) {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const imageUrl = node.images.edges[0]?.node?.url || "/placeholder.png";

  const colorOption = node.options.find(
    (opt: any) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "màu sắc"
  );
  const colors = colorOption ? colorOption.values : ["Default"];

  const sizeOption = node.options.find(
    (opt: any) => opt.name.toLowerCase() === "size" || opt.name.toLowerCase() === "kích thước"
  );
  const sizes = sizeOption ? sizeOption.values : ["One Size"];

  const outOfStock =
    node.variants.edges.length > 0 &&
    node.variants.edges.every((edge: any) => edge.node.currentlyNotInStock);

  return {
    id: node.handle, // use handle for dynamic URL mapping to /products/[handle]
    title: node.title,
    description: node.description || "",
    price,
    rating: 4.8,
    reviewsCount: Math.floor(Math.random() * 45) + 12,
    imageUrl,
    category: node.productType || "Gear",
    sizes,
    colors,
    outOfStock,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  let products: any[] = [];
  let title = handle;
  let description = "";

  // 1. Try to fetch from collection
  const collectionData = await shopifyGetCollectionProducts(handle);

  if (collectionData) {
    title = collectionData.title;
    description = collectionData.description;
    products = collectionData.products.edges.map((edge: any) =>
      mapShopifyCollectionProduct(edge.node)
    );
  }

  // 2. Fallback to all products if collection empty or doesn't exist
  if (products.length === 0) {
    const allProducts = await shopifyGetProducts();
    if (allProducts) {
      products = allProducts.edges.map((edge: any) =>
        mapShopifyCollectionProduct(edge.node)
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <CollectionClient
        handle={handle}
        initialProducts={products}
        initialTitle={title}
        initialDescription={description}
      />
    </div>
  );
}
