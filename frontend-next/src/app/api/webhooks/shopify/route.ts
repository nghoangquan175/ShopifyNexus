import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";
import { completedCheckouts } from "@/lib/checkoutStore";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic") || "";

    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const isMock = process.env.NODE_ENV === "development" && request.headers.get("x-mock-webhook") === "true";

    if (secret && !isMock) {
      const calculatedHmac = crypto
        .createHmac("sha256", secret)
        .update(rawBody, "utf8")
        .digest("base64");

      if (calculatedHmac !== hmacHeader) {
        console.warn("[Shopify Webhook] Invalid signature verification.");
        return new NextResponse("Unauthorized Signature", { status: 401 });
      }
    } else {
      if (isMock) {
        console.log("[Shopify Webhook] Bypassing signature verification for local development mock request.");
      } else {
        console.warn(
          "[Shopify Webhook] SHOPIFY_WEBHOOK_SECRET is not configured. Skipping signature verification for local testing."
        );
      }
    }


    console.log(`[Shopify Webhook] Received webhook topic: ${topic}`);

    // Parse payload to extract product or collection identifiers
    let payload: any = {};
    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch (err) {
        console.error("[Shopify Webhook] Failed to parse JSON body:", err);
      }
    }

    // Determine revalidation logic based on topic
    if (topic.startsWith("products/")) {
      // Purge products list caches
      revalidateTag("products", "max");
      revalidateTag("homepage-products", "max");
      revalidateTag("collections", "max");

      // Purge specific product page cache if ID/handle is available
      if (payload.handle) {
        revalidateTag(`product-${payload.handle}`, "max");
        revalidatePath(`/products/${payload.handle}`);
      }
      if (payload.id) {
        revalidateTag(`product-${payload.id}`, "max");
      }

      // Purge layout listing paths
      revalidatePath("/");
      revalidatePath("/search");
      revalidatePath("/collections/all");
      console.log(`[Shopify Webhook] Revalidated product tags and paths.`);
    } else if (topic.startsWith("collections/")) {
      // Purge collections lists and products lists
      revalidateTag("collections", "max");
      revalidateTag("products", "max");
      revalidateTag("homepage-products", "max");

      if (payload.handle) {
        revalidateTag(`collection-${payload.handle}`, "max");
        revalidatePath(`/collections/${payload.handle}`);
      }

    } else if (topic === "orders/create") {
      const cartToken = payload.cart_token;
      if (cartToken) {
        completedCheckouts.add(cartToken);
        console.log(`[Shopify Webhook] Marked cart token as completed: ${cartToken}`);
      } else {
        console.warn("[Shopify Webhook] Received orders/create webhook but payload.cart_token is missing.");
      }
    } else {
      // Generic fallback purge
      revalidateTag("products", "max");
      revalidateTag("collections", "max");
      revalidateTag("homepage-products", "max");
      revalidatePath("/");
      console.log(`[Shopify Webhook] General revalidation triggered for topic: ${topic}`);
    }

    return NextResponse.json({ revalidated: true, topic });
  } catch (error: any) {
    console.error("[Shopify Webhook] Error processing webhook:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
