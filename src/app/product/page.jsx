import { Suspense } from "react";
import Products from "@/pages/Products";

export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading catalogue…</div>}>
      <Products />
    </Suspense>
  );
}
