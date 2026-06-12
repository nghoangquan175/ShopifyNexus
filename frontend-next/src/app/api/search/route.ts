import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int!, $after: String) {
    search(query: $query, types: [PRODUCT], first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Product {
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
  }
`;

const ALL_PRODUCTS_QUERY = `
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const cursor = searchParams.get("cursor") || null;
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  try {
    let products: any[] = [];
    let pageInfo = { hasNextPage: false, endCursor: null };

    if (query.trim()) {
      const res = await shopifyFetch<any>({
        query: SEARCH_PRODUCTS_QUERY,
        variables: { query, first: limit, after: cursor },
        cache: "no-store",
      });
      const searchData = res.body.data?.search;
      if (searchData) {
        products = (searchData.edges || []).map((edge: any) => edge.node);
        pageInfo = searchData.pageInfo || pageInfo;
      }
    } else {
      const res = await shopifyFetch<any>({
        query: ALL_PRODUCTS_QUERY,
        variables: { first: limit, after: cursor },
        cache: "no-store",
      });
      const productsData = res.body.data?.products;
      if (productsData) {
        products = (productsData.edges || []).map((edge: any) => edge.node);
        pageInfo = productsData.pageInfo || pageInfo;
      }
    }

    return NextResponse.json({ products, pageInfo });
  } catch (error: any) {
    console.error("Search API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform search" },
      { status: 500 }
    );
  }
}
