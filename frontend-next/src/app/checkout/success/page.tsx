import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
      {/* Decorative success card */}
      <div className="bg-surface-container-lowest p-10 md:p-12 rounded-3xl border border-outline-variant/30 shadow-[0_24px_60px_rgba(26,43,60,0.08)] max-w-lg w-full flex flex-col items-center relative overflow-hidden">
        {/* Animated green ring */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
            <svg
              className="h-10 w-10 text-emerald-600 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animationDuration: '2s' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-display mb-4">
          Order Completed!
        </h1>
        
        <p className="text-base text-on-surface-variant font-medium mb-2 leading-relaxed">
          Your payment was processed successfully. Thank you for equipping your next adventure with Shopify Nexus!
        </p>
        
        <p className="text-xs text-outline font-medium mb-8 leading-relaxed max-w-sm">
          A confirmation email with your order details has been sent. You can track your shipment status in your account dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href="/collections"
            className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-display transition-all shadow-md hover:shadow-lg text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="flex-1 bg-surface-container-low hover:bg-outline-variant/40 text-primary font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-display border border-outline-variant/50 transition-all text-center"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
