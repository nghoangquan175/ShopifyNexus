"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const searchParams = useSearchParams();
  const isActivated = searchParams.get("activated") === "true";
  const redirectPath = searchParams.get("redirect") || "/account";

  return (
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
            <span className="text-primary font-medium">Account Login</span>
          </li>
        </ol>
      </nav>

      {/* Main card */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-[0_24px_80px_rgba(26,43,60,0.06)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-display mb-2">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Enter your credentials to access your gear list and orders.
          </p>
        </div>

        {isActivated && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-xl flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Account activated successfully! Please sign in with your password.</span>
          </div>
        )}

        {state?.error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="redirect" value={redirectPath} />
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-primary mb-2 font-display">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary font-display">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display"
          >
            {isPending ? "Signing In..." : "Sign In"}
            {!isPending && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
          <p className="text-sm text-on-surface-variant">
            New to ShopifyNexus?{" "}
            <Link href={`/account/register?redirect=${encodeURIComponent(redirectPath)}`} className="font-bold text-secondary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
