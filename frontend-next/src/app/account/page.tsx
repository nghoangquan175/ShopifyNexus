import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { shopifyGetCustomer } from "@/lib/auth";
import { logoutAction } from "./actions";

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

  const orders = customer.orders?.edges || [];

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

        {/* Right Side: Order History */}
        <section className="w-full lg:w-2/3">
          <div className="border-b border-outline-variant/30 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-primary tracking-tight font-display">
              Order History
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
              Track the details and fulfillment status of your recent expedition gear orders.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest">
              <svg className="mx-auto h-12 w-12 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-primary font-display">No orders found</h3>
              <p className="mt-2 text-sm text-on-surface-variant max-w-xs mx-auto">
                You haven't placed any orders yet. Ready to start your adventure?
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-block px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden border border-outline-variant/30 rounded-2xl bg-surface-container-lowest shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20">
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Order</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Date</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Payment</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Fulfillment</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {orders.map(({ node: order }: any) => (
                      <tr key={order.id} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="p-4 font-bold text-primary">#{order.orderNumber}</td>
                        <td className="p-4 text-on-surface-variant font-medium">
                          {new Date(order.processedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.financialStatus === "PAID"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                              : "bg-error/10 text-error"
                          }`}>
                            {order.financialStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.fulfillmentStatus === "FULFILLED"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                              : "bg-secondary-fixed text-on-secondary-fixed-variant"
                          }`}>
                            {order.fulfillmentStatus || "UNFULFILLED"}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-primary">
                          ${parseFloat(order.totalPrice.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
