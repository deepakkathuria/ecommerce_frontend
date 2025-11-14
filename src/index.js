import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  Profile,
  OrderDetails,
  InvoicePage,
  PrivacyPolicy,
  PageNotFound,
  ReturnPolicy,
  Wishlist,
  Blog,
  BlogPost,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { syncCart } from "./redux/action"; // ✅ Import syncCart action

// ✅ Component to Fetch Cart on Load
const FetchCartOnLoad = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("apitoken");

    if (token) {
      fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Cart on App Load:", data.cartItems);
          dispatch(syncCart(data.cartItems || [])); // ✅ Sync Cart with Redux
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [dispatch]);

  return null;
};

// ✅ Include FetchCartOnLoad inside Provider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <FetchCartOnLoad /> {/* ✅ Fetch cart on load */}
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Product Routes */}
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/product/*" element={<PageNotFound />} /> {/* Handle unknown product routes */}

          {/* Profile & Order Routes */}
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/profile/orders/:orderId" element={<OrderDetails />} />

          <Route path="/invoice/:orderId" element={<InvoicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />


          {/* Catch-All Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
