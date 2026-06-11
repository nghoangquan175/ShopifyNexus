import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginPage from "./LoginPage";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;

  if (token) {
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full flex justify-center items-center">
      <LoginPage />
    </div>
  );
}
