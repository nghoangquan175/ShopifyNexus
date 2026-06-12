import { Suspense } from "react";
import SearchClient from "./SearchClient";
import { shopifyFetch } from "@/lib/shopify";

const GET_ALL_PRODUCTS_FOR_SEARCH = `
  query getAllProductsForSearch {
    products(first: 8) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          tags
          featuredImage {
            url
            altText
          }
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
        }
      }
    }
  }
`;

async function getInitialProducts() {
  try {
    const res = await shopifyFetch<any>({
      query: GET_ALL_PRODUCTS_FOR_SEARCH,
      cache: "force-cache",
      tags: ["products"],
    });
    const productsData = res.body.data?.products;
    const edges = productsData?.edges || [];
    const products = edges.map((edge: any) => edge.node);
    const pageInfo = productsData?.pageInfo || { hasNextPage: false, endCursor: null };
    return { products, pageInfo };
  } catch (err) {
    console.error("Error fetching initial search products:", err);
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export default async function SearchPage() {
  const { products, pageInfo } = await getInitialProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        }
      >
        <SearchClient initialProducts={products} initialPageInfo={pageInfo} />
      </Suspense>
    </div>
  );
}
