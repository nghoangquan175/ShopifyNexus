"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { activateAccountAction } from "../../../actions";

interface ActivatePageProps {
  params: Promise<{
    customerId: string;
    token: string;
  }>;
}

export default function ActivatePage({ params }: ActivatePageProps) {
  const { customerId, token } = React.use(params);
  const [state, formAction, isPending] = useActionState(activateAccountAction, null);

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
            <span className="text-primary font-medium">Activate Account</span>
          </li>
        </ol>
      </nav>

      {/* Main card */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-[0_24px_80px_rgba(26,43,60,0.06)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-display mb-2">Activate Account</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Please set a new secure password to activate your account and log in.
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="customerId" value={customerId} />
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary mb-2 font-display">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary mb-2 font-display">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-display cursor-pointer"
          >
            {isPending ? "Activating Account..." : "Activate Account"}
            {!isPending && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
