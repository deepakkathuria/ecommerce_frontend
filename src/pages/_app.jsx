"use client";

import Script from "next/script";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import store from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Component {...pageProps} />
        <Toaster />

        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      </Provider>
    </HelmetProvider>
  );
}

