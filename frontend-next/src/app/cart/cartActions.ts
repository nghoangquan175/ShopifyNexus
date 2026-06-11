"use server";

import { cookies } from "next/headers";
import {
  shopifyCreateCart,
  shopifyAddLinesToCart,
  shopifyUpdateCartLine,
  shopifyRemoveCartLine,
  shopifyGetCart,
  shopifyUpdateCartBuyer,
} from "@/lib/cart";
import { shopifyFetch } from "@/lib/shopify";

// Helper to get first variant ID of first product in Shopify store
async function getFallbackVariantId(): Promise<string | null> {
  try {
    const query = `
      query getFirstProductVariant {
        products(first: 1) {
          edges {
            node {
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;
    const res = await shopifyFetch<any>({ query, cache: "force-cache" });
    const variantId = res.body.data?.products?.edges?.[0]?.node?.variants?.edges?.[0]?.node?.id;
    return variantId || null;
  } catch (err) {
    console.error("Error fetching fallback variant:", err);
    return null;
  }
}

export async function getCartAction() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return null;

  try {
    const cart = await shopifyGetCart(cartId);
    if (!cart) return null;

    // Format cart to match CartItem interface
    const items = cart.lines.edges.map((edge: any) => {
      const line = edge.node;
      const variant = line.merchandise;
      const product = variant.product;
      const imageUrl = product.images.edges[0]?.node?.url || "/placeholder.png";

      return {
        id: line.id, // line item ID for update/delete
        variantId: variant.id, // product variant ID
        title: product.title,
        price: parseFloat(variant.price.amount),
        imageUrl,
        color: variant.selectedOptions.find((o: any) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "màu sắc")?.value || "Default",
        variantInfo: variant.title,
        quantity: line.quantity,
        stockStatus: "In Stock",
      };
    });

    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      items,
      totalQuantity: cart.totalQuantity,
      subtotal: parseFloat(cart.cost.subtotalAmount.amount),
    };
  } catch (err) {
    console.error("getCartAction error:", err);
    return null;
  }
}

export async function addToCartAction(variantId: string, quantity: number) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("shopify_cart_id")?.value;
  const customerToken = cookieStore.get("shopify_customer_token")?.value;

  // Intercept mock/non-Shopify variant IDs to map to a real Shopify fallback variant
  if (!variantId.startsWith("gid://shopify/")) {
    const fallback = await getFallbackVariantId();
    if (fallback) {
      variantId = fallback;
    } else {
      return { error: "No products available in the Shopify store." };
    }
  }

  try {
    let result;
    if (!cartId) {
      result = await shopifyCreateCart(variantId, quantity, customerToken);
      if (result.cart?.id) {
        cartId = result.cart.id;
        cookieStore.set("shopify_cart_id", result.cart.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
      }
    } else {
      result = await shopifyAddLinesToCart(cartId, variantId, quantity);
      if (customerToken) {
        // Associate buyer if logged in
        await shopifyUpdateCartBuyer(cartId, customerToken);
      }
    }

    if (result.userErrors && result.userErrors.length > 0) {
      return { error: result.userErrors[0].message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("addToCartAction error:", err);
    return { error: err.message || "Failed to add item to cart." };
  }
}

export async function updateCartLineAction(lineId: string, quantity: number) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return { error: "No cart found." };

  try {
    const result = await shopifyUpdateCartLine(cartId, lineId, quantity);
    if (result.userErrors && result.userErrors.length > 0) {
      return { error: result.userErrors[0].message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update cart." };
  }
}

export async function removeCartLineAction(lineId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  if (!cartId) return { error: "No cart found." };

  try {
    const result = await shopifyRemoveCartLine(cartId, lineId);
    if (result.userErrors && result.userErrors.length > 0) {
      return { error: result.userErrors[0].message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to remove item." };
  }
}

export async function checkoutAction(mockItems?: any[]) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopify_cart_id")?.value;
  const customerToken = cookieStore.get("shopify_customer_token")?.value;

  try {
    if (cartId) {
      const cart = await shopifyGetCart(cartId);
      if (cart && cart.checkoutUrl) {
        if (customerToken) {
          await shopifyUpdateCartBuyer(cartId, customerToken);
        }
        return { checkoutUrl: cart.checkoutUrl };
      }
    }

    // Fallback: If no real Shopify cart exists, but user wants to checkout (with mock items)
    // Create a new Shopify cart using a real fallback variant ID to let them test checkout
    const fallbackVariantId = await getFallbackVariantId();
    if (!fallbackVariantId) {
      return { error: "Could not initialize Shopify checkout. No products available in the store." };
    }

    const result = await shopifyCreateCart(fallbackVariantId, 1, customerToken);
    if (result.cart?.checkoutUrl) {
      return { checkoutUrl: result.cart.checkoutUrl };
    }

    return { error: "Checkout initialization failed." };
  } catch (err: any) {
    return { error: err.message || "Checkout failed." };
  }
}
