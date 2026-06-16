import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full flex justify-center items-center">
      <div className="w-full max-w-md mx-auto py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant mb-8 font-body-md justify-center">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-primary font-medium">Activate Account</span>
            </li>
          </ol>
        </nav>

        {/* Success Card */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-[0_24px_80px_rgba(26,43,60,0.06)] text-center">
          <div className="mx-auto w-16 h-16 bg-tertiary-fixed/15 text-secondary rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary font-display mb-4">Check Your Email</h1>
          
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            We have sent a verification link to your email address. Please open the email and click the link to activate your account.
          </p>

          <div className="bg-surface-container-low p-4 rounded-xl text-left border border-outline-variant/20 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 font-display">Next Steps:</h3>
            <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
              <li>Open your inbox and search for the confirmation email from us.</li>
              <li>Click the verification/activation link inside the email.</li>
              <li>Once verified, return here and log in using the email and password you set.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/account/login"
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display"
            >
              Go to Login Page
            </Link>
            
            <p className="text-xs text-on-surface-variant">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
