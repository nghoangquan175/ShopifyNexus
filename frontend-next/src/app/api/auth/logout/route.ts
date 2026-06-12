import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("shopify_customer_token");
  cookieStore.delete("shopify_cart_id");
  redirect("/account/login");
}
