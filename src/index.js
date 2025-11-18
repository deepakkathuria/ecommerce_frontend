import React, { useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { syncCart } from "./redux/action";
import store from "./redux/store";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const Products = lazy(() => import("./pages/Products"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const InvoicePage = lazy(() => import("./pages/InvoicePage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

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

const PageLoader = () => (
  <div className="page-loader">
    <span className="loader-dot" />
    <span className="loader-dot" />
    <span className="loader-dot" />
  </div>
);

// ✅ Include FetchCartOnLoad inside Provider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop>
        <Provider store={store}>
          <FetchCartOnLoad /> {/* ✅ Fetch cart on load */}
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </Provider>
      </ScrollToTop>
      <Toaster />
    </BrowserRouter>
  </HelmetProvider>
);
