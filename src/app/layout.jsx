import { Suspense } from "react";
import Script from "next/script";
import { Providers } from "./providers";
import ToasterClient from "./ToasterClient";
import ScrollToTop from "@/components/ScrollToTop";
import FetchCartOnLoad from "@/components/FetchCartOnLoad";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "@/index.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Zairi - Premium Jewelry & Antiques Collection",
  description:
    "Shop premium jewelry, antiques, and unique collectibles at zairi.in. Free shipping above ₹1000.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={<div className="container py-5 text-center">Loading…</div>}>
            <ScrollToTop>
              <FetchCartOnLoad />
              {children}
            </ScrollToTop>
          </Suspense>
        </Providers>
        <ToasterClient />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      </body>
    </html>
  );
}
