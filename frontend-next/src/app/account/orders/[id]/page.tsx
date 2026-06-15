import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { shopifyGetCustomerOrder } from "@/lib/auth";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;

  if (!token) {
    redirect("/account/login");
  }

  const orderGid = `gid://shopify/Order/${orderId}`;
  const order = await shopifyGetCustomerOrder(token, orderGid);

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-16 w-full text-center">
        <h1 className="text-3xl font-bold text-primary font-display mb-4">
          Order Not Found
        </h1>
        <p className="text-on-surface-variant mb-8">
          The order you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link
          href="/account"
          className="inline-block px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm"
        >
          Return to My Account
        </Link>
      </div>
    );
  }

  const shipping = order.shippingAddress;
  const lineItems = order.lineItems?.edges || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex text-sm text-on-surface-variant mb-8 font-body-md"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-outline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/account"
              className="hover:text-primary transition-colors"
            >
              My Account
            </Link>
          </li>
          <li className="flex items-center gap-1" aria-current="page">
            <svg
              className="h-3.5 w-3.5 text-outline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-primary font-medium">
              Order #{order.orderNumber}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-display tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5 font-medium">
            Placed on{" "}
            {new Date(order.processedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 px-2.5 py-2.5 border border-outline-variant/50 hover:bg-surface-container-low text-primary rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-outline-variant/30 rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container-low">
              <h2 className="text-lg font-bold text-primary font-display">
                Items Ordered
              </h2>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {lineItems.map(({ node: item }: any) => {
                const variantImage = item.variant?.image;
                const itemSubtotal =
                  parseFloat(item.variant?.price?.amount || "0") *
                  item.quantity;
                const productHandle = item.variant?.product?.handle;

                return (
                  <div
                    key={item.variant?.id || item.title}
                    className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:bg-surface-container-low/5 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      {variantImage?.url ? (
                        productHandle ? (
                          <Link href={`/products/${productHandle}`}>
                            <img
                              src={variantImage.url}
                              alt={variantImage.altText || item.title}
                              className="w-16 h-16 rounded-xl object-cover border border-outline-variant/35 shrink-0 hover:scale-105 transition-transform duration-200"
                            />
                          </Link>
                        ) : (
                          <img
                            src={variantImage.url}
                            alt={variantImage.altText || item.title}
                            className="w-16 h-16 rounded-xl object-cover border border-outline-variant/35 shrink-0"
                          />
                        )
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-outline shrink-0">
                          <svg
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}

                      <div>
                        {productHandle ? (
                          <Link
                            href={`/products/${productHandle}`}
                            className="font-bold text-primary hover:text-secondary hover:underline transition-all line-clamp-1 font-display text-base"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <h3 className="font-bold text-primary line-clamp-1 font-display text-base">
                            {item.title}
                          </h3>
                        )}
                        {item.variant?.title &&
                          item.variant.title !== "Default Title" && (
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              Size/Color: {item.variant.title}
                            </p>
                          )}
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          Qty: {item.quantity} × $
                          {parseFloat(
                            item.variant?.price?.amount || "0",
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-outline-variant/10">
                      <span className="font-bold text-primary text-base font-display">
                        ${itemSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Cost summary inside item card */}
            <div className="p-6 bg-surface-container-low/40 border-t border-outline-variant/20 space-y-3">
              <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                <span>Subtotal</span>
                <span>${parseFloat(order.totalPrice.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-outline-variant/20">
                <span className="font-display">Total Paid</span>
                <span className="font-display">
                  ${parseFloat(order.totalPrice.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Shipping & Status details */}
        <div className="space-y-6">
          {/* Order Status Card */}
          <div className="border border-outline-variant/30 rounded-2xl bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-primary font-display border-b border-outline-variant/20 pb-3">
              Order Status
            </h2>

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                  Payment Status
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.financialStatus === "PAID"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {order.financialStatus}
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                  Fulfillment Status
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.fulfillmentStatus === "FULFILLED"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      : "bg-secondary-fixed text-on-secondary-fixed-variant"
                  }`}
                >
                  {order.fulfillmentStatus || "UNFULFILLED"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border border-outline-variant/30 rounded-2xl bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-primary font-display border-b border-outline-variant/20 pb-3">
              Delivery Destination
            </h2>

            {shipping ? (
              <div className="text-sm text-on-surface-variant font-medium space-y-1.5">
                <p className="font-bold text-primary text-base mb-1">
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p>{shipping.address1}</p>
                {shipping.address2 && <p>{shipping.address2}</p>}
                <p>
                  {shipping.city}, {shipping.province} {shipping.zip}
                </p>
                <p className="text-xs uppercase tracking-wider font-bold text-primary/80 mt-1">
                  {shipping.country}
                </p>
                {shipping.phone && (
                  <p className="text-xs text-outline mt-3 flex items-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {shipping.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                No shipping address provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
