import { NextRequest, NextResponse } from "next/server";
import { completedCheckouts } from "@/lib/checkoutStore";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
  }

  // Extract the token part from the cart ID (e.g. gid://shopify/Cart/xxx -> xxx)
  const cartToken = cartId.split("/").pop() || cartId;

  const isCompleted = completedCheckouts.has(cartToken);

  return NextResponse.json({
    status: isCompleted ? "completed" : "pending",
    cartToken,
  });
}
