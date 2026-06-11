import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-16 w-full">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        }
      >
        <SearchClient />
      </Suspense>
    </div>
  );
}
