"use client";

import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "@/redux/store";

export function Providers({ children }) {
  return (
    <HelmetProvider>
      <Provider store={store}>{children}</Provider>
    </HelmetProvider>
  );
}
