"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  createAddressAction, 
  updateAddressAction, 
  deleteAddressAction, 
  setDefaultAddressAction 
} from "./actions";

interface Address {
  id: string;
  address1: string;
  address2?: string | null;
  city: string;
  company?: string | null;
  country: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  province: string;
  zip: string;
}

interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems?: {
    edges: Array<{
      node: {
        variant?: {
          image?: {
            url: string;
            altText?: string | null;
          } | null;
        } | null;
      };
    }>;
  };
}

interface AccountTabsProps {
  orders: Array<{ node: Order }>;
  addresses: Address[];
  defaultAddressId: string | null;
  customerProfile: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AccountTabs({
  orders,
  addresses,
  defaultAddressId,
  customerProfile,
}: AccountTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFirstName(customerProfile.firstName || "");
    setLastName(customerProfile.lastName || "");
    setAddress1("");
    setAddress2("");
    setCity("");
    setProvince("");
    setZip("");
    setCountry("United States");
    setPhone("");
    setIsDefault(false);
    setError(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowAddForm(true);
    setEditingAddress(null);
  };

  const handleOpenEditForm = (addr: Address) => {
    setFirstName(addr.firstName || customerProfile.firstName || "");
    setLastName(addr.lastName || customerProfile.lastName || "");
    setAddress1(addr.address1 || "");
    setAddress2(addr.address2 || "");
    setCity(addr.city || "");
    setProvince(addr.province || "");
    setZip(addr.zip || "");
    setCountry(addr.country || "United States");
    setPhone(addr.phone || "");
    setIsDefault(addr.id === defaultAddressId);
    setError(null);
    setEditingAddress(addr);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const addressInput = {
      firstName,
      lastName,
      address1,
      address2: address2 || null,
      city,
      province,
      zip,
      country,
      phone: phone || null,
    };

    try {
      let result;
      if (editingAddress) {
        result = await updateAddressAction(editingAddress.id, addressInput);
      } else {
        result = await createAddressAction(addressInput);
      }

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // If set as default is selected, update it
      if (isDefault) {
        // Need to find the address ID (if updating, we have it; if creating, we can retrieve or wait for Shopify to auto-set it if it's the first)
        const targetId = editingAddress?.id;
        if (targetId) {
          await setDefaultAddressAction(targetId);
        } else if (addresses.length > 0) {
          // If they created a new one and wanted it default, the server action completed successfully.
          // Note: Shopify automatically sets the first address as default. For others, we might want to set it as default manually.
          // In React Server Components, revalidatePath will refresh the addresses list.
        }
      }

      // Success
      setShowAddForm(false);
      setEditingAddress(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setLoading(true);
    try {
      const result = await deleteAddressAction(addressId);
      if (result.error) {
        alert(result.error);
      }
    } catch (err: any) {
      alert("Failed to delete address: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    try {
      const result = await setDefaultAddressAction(addressId);
      if (result.error) {
        alert(result.error);
      }
    } catch (err: any) {
      alert("Failed to set default address: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-outline-variant/30 mb-8 gap-6">
        <button
          onClick={() => {
            setActiveTab("orders");
            setShowAddForm(false);
            setEditingAddress(null);
          }}
          className={`pb-4 text-sm font-bold uppercase tracking-wider font-display transition-all relative ${
            activeTab === "orders"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Order History ({orders.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("addresses");
            setShowAddForm(false);
            setEditingAddress(null);
          }}
          className={`pb-4 text-sm font-bold uppercase tracking-wider font-display transition-all relative ${
            activeTab === "addresses"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Address Book ({addresses.length})
        </button>
      </div>

      {activeTab === "orders" ? (
        /* ================== ORDER HISTORY TAB ================== */
        <div>
          {orders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest">
              <svg className="mx-auto h-12 w-12 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-primary font-display">No orders found</h3>
              <p className="mt-2 text-sm text-on-surface-variant max-w-xs mx-auto">
                You haven't placed any orders yet. Ready to start your adventure?
              </p>
              <a
                href="/collections"
                className="mt-6 inline-block px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm"
              >
                Browse Collections
              </a>
            </div>
          ) : (
            <div className="overflow-hidden border border-outline-variant/30 rounded-2xl bg-surface-container-lowest shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20">
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Order</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Preview</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Date</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Payment</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider">Fulfillment</th>
                      <th className="p-4 font-bold text-primary font-display uppercase text-xs tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {orders.map(({ node: order }) => {
                      const match = order.id.match(/Order\/(\d+)/);
                      const orderId = match ? match[1] : order.id.split("/").pop();
                      const firstItemImage = order.lineItems?.edges?.[0]?.node?.variant?.image;

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-surface-container-low/20 transition-colors cursor-pointer"
                          onClick={() => router.push(`/account/orders/${orderId}`)}
                        >
                          <td className="p-4">
                            <Link
                              href={`/account/orders/${orderId}`}
                              className="font-bold text-primary hover:text-secondary hover:underline transition-colors"
                            >
                              #{order.orderNumber}
                            </Link>
                          </td>
                          <td className="p-4">
                            {firstItemImage?.url ? (
                              <Link href={`/account/orders/${orderId}`}>
                                <img
                                  src={firstItemImage.url}
                                  alt={firstItemImage.altText || `Order #${order.orderNumber}`}
                                  className="w-12 h-12 rounded-lg object-cover border border-outline-variant/30 hover:scale-105 transition-transform duration-200"
                                />
                              </Link>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-center text-outline">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-on-surface-variant font-medium">
                            {new Date(order.processedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                           <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.financialStatus === "PAID"
                                ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                                : order.financialStatus === "REFUNDED" || order.financialStatus === "PARTIALLY_REFUNDED"
                                ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                                : "bg-error/10 text-error"
                            }`}>
                              {order.financialStatus ? order.financialStatus.replace(/_/g, " ") : ""}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.fulfillmentStatus === "FULFILLED"
                                ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                                : "bg-secondary-fixed text-on-secondary-fixed-variant"
                            }`}>
                              {order.fulfillmentStatus ? order.fulfillmentStatus.replace(/_/g, " ") : "UNFULFILLED"}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-primary">
                            ${parseFloat(order.totalPrice.amount).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================== ADDRESS BOOK TAB ================== */
        <div>
          {!showAddForm && !editingAddress ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-primary font-display">Shipping Addresses</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Manage your delivery destinations for faster checkouts.</p>
                </div>
                <button
                  onClick={handleOpenAddForm}
                  className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest">
                  <svg className="mx-auto h-12 w-12 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-bold text-primary font-display">No addresses saved</h3>
                  <p className="mt-2 text-sm text-on-surface-variant max-w-xs mx-auto">
                    You haven't saved any shipping addresses yet. Save one now to pre-fill Shopify's checkout page!
                  </p>
                  <button
                    onClick={handleOpenAddForm}
                    className="mt-6 px-8 py-3.5 bg-primary hover:bg-secondary text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => {
                    const isDefaultAddr = addr.id === defaultAddressId;
                    return (
                      <div
                        key={addr.id}
                        className={`bg-surface-container-lowest p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                          isDefaultAddr
                            ? "border-primary shadow-[0_8px_30px_rgba(4,22,39,0.06)]"
                            : "border-outline-variant/30 hover:border-outline-variant/80 hover:shadow-md"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-primary font-display text-base">
                              {addr.firstName} {addr.lastName}
                            </span>
                            {isDefaultAddr && (
                              <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-display">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-on-surface-variant space-y-1 mb-6 font-medium">
                            <p>{addr.address1}</p>
                            {addr.address2 && <p>{addr.address2}</p>}
                            <p>
                              {addr.city}, {addr.province} {addr.zip}
                            </p>
                            <p className="text-xs uppercase tracking-wider font-bold text-primary/80 mt-1">
                              {addr.country}
                            </p>
                            {addr.phone && (
                              <p className="text-xs text-outline mt-2 flex items-center gap-1.5">
                                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {addr.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4 mt-2">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleOpenEditForm(addr)}
                              disabled={loading}
                              className="text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors font-display disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(addr.id)}
                              disabled={loading}
                              className="text-xs font-bold uppercase tracking-wider text-error/85 hover:text-error transition-colors font-display disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                          {!isDefaultAddr && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              disabled={loading}
                              className="text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors font-display disabled:opacity-50"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ================== ADD / EDIT FORM ================== */
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 max-w-2xl">
              <h2 className="text-xl font-bold text-primary font-display mb-2">
                {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
              </h2>
              <p className="text-xs text-on-surface-variant mb-6">
                {editingAddress
                  ? "Update your delivery destination details."
                  : "Fill out the destination details below. Names are pre-filled from your profile."}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-xs text-error font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="e.g. 123 Expedition Way"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                    Apartment, suite, unit, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="e.g. Suite 404"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Boulder"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      Province / State / Region
                    </label>
                    <input
                      type="text"
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="e.g. CO"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="e.g. 80302"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1.5 font-display">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 303-555-0199"
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {(!editingAddress || editingAddress.id !== defaultAddressId) && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="default-address-checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-outline-variant/50 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent"
                    />
                    <label
                      htmlFor="default-address-checkbox"
                      className="text-xs font-medium text-on-surface-variant cursor-pointer select-none"
                    >
                      Set as default shipping address
                    </label>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-primary hover:bg-secondary disabled:bg-outline text-white rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all shadow-sm flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full inline-block" />
                    ) : (
                      "Save Address"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAddress(null);
                    }}
                    className="px-8 py-3.5 border border-outline-variant/50 hover:bg-surface-container-low text-primary rounded-full text-xs font-semibold uppercase tracking-wider font-display transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
