/**
 * Browser API base for Next.js (same-origin /api/* by default).
 */
export function apiUrl(path) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
