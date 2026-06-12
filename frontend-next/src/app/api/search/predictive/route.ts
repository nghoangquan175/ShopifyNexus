import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

const PREDICTIVE_SEARCH_QUERY = `
  query getPredictiveSearch($query: String!) {
    predictiveSearch(query: $query, limit: 5, types: [PRODUCT, COLLECTION]) {
      products {
        id
        title
        handle
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
      }
      collections {
        id
        title
        handle
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ products: [], collections: [] });
  }

  try {
    const res = await shopifyFetch<any>({
      query: PREDICTIVE_SEARCH_QUERY,
      variables: { query },
      cache: "no-store",
    });
    const results = res.body.data?.predictiveSearch || { products: [], collections: [] };
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Predictive search API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
