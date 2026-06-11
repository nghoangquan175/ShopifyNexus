import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CartClient from "./CartClient";

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;



  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <CartClient />
    </div>
  );
}
