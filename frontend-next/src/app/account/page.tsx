import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { shopifyGetCustomer } from "@/lib/auth";
import { logoutAction } from "./actions";
import AccountTabs from "./AccountTabs";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;

  if (!token) {
    redirect("/account/login");
  }

  const customer = await shopifyGetCustomer(token);

  // If customer is null, the token might be invalid or expired. Clear cookie and login again.
  if (!customer) {
    redirect("/api/auth/logout");
  }

  const rawOrders = customer.orders?.edges || [];
  const orders = [...rawOrders].sort((a: any, b: any) => {
    return new Date(b.node.processedAt).getTime() - new Date(a.node.processedAt).getTime();
  });
  const addresses = (customer.addresses?.edges || []).map(({ node }: any) => node);
  const defaultAddressId = customer.defaultAddress?.id || null;
  const customerProfile = {
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email || "",
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant mb-8 font-body-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1" aria-current="page">
            <svg className="h-3.5 w-3.5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-primary font-medium">My Account</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: Profile Information */}
        <aside className="w-full lg:w-1/3 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-[0_12px_40px_rgba(26,43,60,0.04)]">
          <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-6 mb-6">
            <div className="h-14 w-14 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-xl font-display uppercase">
              {customer.firstName?.[0] || customer.email[0]}
              {customer.lastName?.[0] || ""}
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary font-display">
                {customer.firstName} {customer.lastName}
              </h2>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider font-display">
                Expedition Member
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-on-surface-variant mb-8">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-1 font-display">
                Email Address
              </span>
              <span className="font-medium">{customer.email}</span>
            </div>
            {customer.phone && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-1 font-display">
                  Phone Number
                </span>
                <span className="font-medium">{customer.phone}</span>
              </div>
            )}
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full bg-surface-container-low hover:bg-error/10 hover:text-error text-primary font-bold py-3.5 px-6 rounded-xl border border-outline-variant/30 hover:border-error/20 transition-all text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </aside>

        {/* Right Side: Tabbed Interface (Orders & Addresses) */}
        <section className="w-full lg:w-2/3">
          <AccountTabs
            orders={orders}
            addresses={addresses}
            defaultAddressId={defaultAddressId}
            customerProfile={customerProfile}
          />
        </section>
      </div>
    </div>
  );
}
