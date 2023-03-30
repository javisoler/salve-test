/**
 * Resolve a promise after a given delay.
 */
export const delay = (ttl = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ttl));
