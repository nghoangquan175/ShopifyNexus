const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// API version for Shopify Storefront API
const API_VERSION = "2024-07";

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, any>;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
};

type ShopifyResponse<T> = {
  status: number;
  body: {
    data: T;
    errors?: Array<{ message: string }>;
  };
};

/**
 * Helper function to query the Shopify Storefront API using GraphQL.
 * Accepts dynamic query, variables, caching options, and revalidation tags.
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  headers = {},
  cache = "force-cache",
  tags = [],
}: ShopifyFetchParams): Promise<ShopifyResponse<T>> {
  if (!domain || !accessToken) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in environment variables.");
  }

  const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
        ...headers,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags },
    });

    const body = await res.json();

    if (body.errors) {
      console.error("Shopify GraphQL errors:", body.errors);
      throw new Error(body.errors[0].message || "GraphQL Error");
    }

    return {
      status: res.status,
      body,
    };
  } catch (error) {
    console.error("Shopify Fetch Error:", error);
    throw error;
  }
}

/**
 * Retrieves the shop's numeric ID dynamically from the Storefront API.
 */
export async function shopifyGetShopId(): Promise<string | null> {
  const envShopId = process.env.SHOPIFY_SHOP_ID || process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
  if (envShopId) {
    return envShopId;
  }

  try {
    const res = await shopifyFetch<{ shop: { id: string } }>({
      query: `{ shop { id } }`,
      cache: "force-cache",
    });
    const id = res.body.data?.shop?.id;
    if (id) {
      // id is like "gid://shopify/Shop/101276778628"
      const parts = id.split("/");
      return parts[parts.length - 1];
    }
  } catch (err) {
    console.error("Error fetching shop ID:", err);
  }
  return null;
}

