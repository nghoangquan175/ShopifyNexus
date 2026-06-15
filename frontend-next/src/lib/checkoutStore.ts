// Shared in-memory store for completed checkouts
// Using globalThis ensures state is preserved during Next.js hot-reloading in development.

declare global {
  var completedCheckouts: Set<string> | undefined;
}

if (!globalThis.completedCheckouts) {
  globalThis.completedCheckouts = new Set<string>();
}

export const completedCheckouts = globalThis.completedCheckouts;
