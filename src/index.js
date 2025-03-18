// import React from "react";
// import ReactDOM from "react-dom/client";
// import "../node_modules/font-awesome/css/font-awesome.min.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./redux/store";

// import {
//   Home,
//   Product,
//   Products,
//   AboutPage,
//   ContactPage,
//   Cart,
//   Login,
//   Register,
//   Checkout,
//   Profile,
//   PageNotFound,
//   OrderDetails
// } from "./pages";
// import ScrollToTop from "./components/ScrollToTop";
// import { Toaster } from "react-hot-toast";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//     <ScrollToTop>
//       <Provider store={store}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/product" element={<Products />} />
//           <Route path="/product/:id" element={<Product />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="*" element={<PageNotFound />} />
//           <Route path="/profile/*" element={<Profile />} />

//           <Route path="/product/*" element={<PageNotFound />} />
//           <Route path="/profile/*" element={<Profile />} />
//           <Route path="/profile/orders/:orderId" element={<OrderDetails />} />
//         </Routes>
//       </Provider>
//     </ScrollToTop>
//     <Toaster />
//   </BrowserRouter>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
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
  PageNotFound,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
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

          {/* Catch-All Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
