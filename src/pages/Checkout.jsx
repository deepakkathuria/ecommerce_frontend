// import React, { useRef } from "react";
// import { Footer, Navbar } from "../components";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../redux/action"; // adjust path if needed
// import store from "../redux/store";


// const Checkout = () => {
//   const cart = useSelector((state) => state.handleCart);
//   const dispatch = useDispatch();

//   const firstNameRef = useRef();
//   const lastNameRef = useRef();
//   const emailRef = useRef();
//   const addressRef = useRef();
//   const address2Ref = useRef();
//   const stateRef = useRef();
//   const zipRef = useRef();
//   const phoneRef = useRef();

//   const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//   const shipping = 0;
//   const total = subtotal + shipping;

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: total }),
//       });

//       const { order } = await res.json();

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         order_id: order.id,
//         name: "Your Store",
//         description: "Order Payment",
//         handler: async function (response) {
//           const token = localStorage.getItem("apitoken");

//           const verifyRes = await fetch(
//             "https://hammerhead-app-jkdit.ondigitalocean.app/verify-payment",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderData: {
//                   total_amount: total,
//                   products: cart.map((item) => ({
//                     product_id: item.id,
//                     quantity: item.qty,
//                     price: item.price,
//                   })),
//                   address: {
//                     full_name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
//                     phone_number: phoneRef.current.value,
//                     street_address: addressRef.current.value,
//                     city: "Delhi",
//                     state: stateRef.current.value,
//                     postal_code: zipRef.current.value,
//                     country: "India",
//                   },
//                 },
//               }),
//             }
//           );

//           const result = await verifyRes.json();
//           if (result.success) {
//             // ✅ Clear Redux state
//             dispatch(clearCart());
//             console.log("Redux cart cleared:", store.getState().handleCart);
//             console.log("LocalStorage cleared:", localStorage.getItem("cart"));

//             // ✅ Forcefully remove localStorage cart immediately
//             localStorage.removeItem("cart");

//             // ✅ Also call backend to clear user's cart if applicable
//             await fetch(
//               "https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear",
//               {
//                 method: "DELETE",
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );

//             // ✅ Add 1 second delay to ensure everything clears before redirect
//             setTimeout(() => {
//               alert("Payment successful and order placed!");
//               window.location.href = `/invoice/${result.orderId}`;
//             }, 1000);
//           } else {
//             alert("Payment verification failed.");
//           }
//         },
//         prefill: {
//           name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
//           email: emailRef.current.value,
//           contact: phoneRef.current.value,
//         },
//         theme: { color: "#3399cc" },
//         method: {
//           upi: true,
//           card: false,
//           netbanking: false,
//           wallet: false,
//         },
//       };
      

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Something went wrong!");
//     }
//   };

//   const ShowCheckout = () => {
//     let totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

//     return (
//       <div className="container py-5">
//         <div className="row my-4">
//           <div className="col-md-5 col-lg-4 order-md-last">
//             <div className="card mb-4">
//               <div className="card-header py-3 bg-light">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <ul className="list-group list-group-flush">
//                   <li className="list-group-item d-flex justify-content-between">
//                     Products ({totalItems}){" "}
//                     <span>Rs.{Math.round(subtotal)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between">
//                     Shipping <span>Rs.{shipping}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between">
//                     <strong>Total</strong>
//                     <strong>Rs.{Math.round(total)}</strong>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-7 col-lg-8">
//             <div className="card mb-4">
//               <div className="card-header py-3">
//                 <h4 className="mb-0">Billing address</h4>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handlePayment}>
//                   <div className="row g-3">
//                     <div className="col-sm-6 my-1">
//                       <label className="form-label">First name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={firstNameRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-sm-6 my-1">
//                       <label className="form-label">Last name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={lastNameRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12 my-1">
//                       <label className="form-label">Email</label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         ref={emailRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12 my-1">
//                       <label className="form-label">Phone Number</label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         ref={phoneRef}
//                         required
//                       />
//                     </div>

//                     <div className="col-12 my-1">
//                       <label className="form-label">Address</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={addressRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Address 2 (Optional)</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={address2Ref}
//                       />
//                     </div>
//                     <div className="col-md-5 my-1">
//                       <label className="form-label">Country</label>
//                       <select
//                         className="form-select"
//                         defaultValue="India"
//                         disabled
//                       >
//                         <option>India</option>
//                       </select>
//                     </div>
//                     <div className="col-md-4 my-1">
//                       <label className="form-label">State</label>
//                       <select className="form-select" ref={stateRef} required>
//                         <option>Delhi</option>
//                         <option>Delhi NCR</option>
//                         <option>Punjab</option>
//                         <option>Maharashtra</option>
//                         {/* Add more if needed */}
//                       </select>
//                     </div>
//                     <div className="col-md-3 my-1">
//                       <label className="form-label">Zip</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={zipRef}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <hr className="my-4" />
//                   <button className="btn btn-primary w-100" type="submit">
//                     Pay with Razorpay
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const EmptyCart = () => (
//     <div className="container text-center py-5">
//       <h4 className="display-5">No item in Cart</h4>
//       <Link to="/" className="btn btn-outline-dark mt-3">
//         <i className="fa fa-arrow-left"></i> Continue Shopping
//       </Link>
//     </div>
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="container my-3 py-3">
//         <h1 className="text-center">Checkout</h1>
//         <hr />
//         {cart.length ? <ShowCheckout /> : <EmptyCart />}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Checkout;






















































// import React, { useRef } from "react";
// import { Footer, Navbar } from "../components";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../redux/action"; // adjust path if needed
// import store from "../redux/store";


// const Checkout = () => {
//   const cart = useSelector((state) => state.handleCart);
//   const dispatch = useDispatch();

//   const firstNameRef = useRef();
//   const lastNameRef = useRef();
//   const emailRef = useRef();
//   const addressRef = useRef();
//   const address2Ref = useRef();
//   const stateRef = useRef();
//   const zipRef = useRef();
//   const phoneRef = useRef();

//   const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//   const shipping = 0;
//   const total = subtotal + shipping;

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: total }),
//       });

//       const { order } = await res.json();

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         order_id: order.id,
//         name: "Your Store",
//         description: "Order Payment",
//         handler: async function (response) {
//           const token = localStorage.getItem("apitoken");

//           const verifyRes = await fetch(
//             "https://hammerhead-app-jkdit.ondigitalocean.app/verify-payment",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderData: {
//                   total_amount: total,
//                   products: cart.map((item) => ({
//                     product_id: item.id,
//                     quantity: item.qty,
//                     price: item.price,
//                   })),
//                   address: {
//                     full_name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
//                     phone_number: phoneRef.current.value,
//                     street_address: addressRef.current.value,
//                     city: "Delhi",
//                     state: stateRef.current.value,
//                     postal_code: zipRef.current.value,
//                     country: "India",
//                   },
//                 },
//               }),
//             }
//           );

//           const result = await verifyRes.json();
//           if (result.success) {
//             // ✅ Clear Redux state
//             dispatch(clearCart());
//             console.log("Redux cart cleared:", store.getState().handleCart);
//             console.log("LocalStorage cleared:", localStorage.getItem("cart"));

//             // ✅ Forcefully remove localStorage cart immediately
//             localStorage.removeItem("cart");

//             // ✅ Also call backend to clear user's cart if applicable
//             await fetch(
//               "https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear",
//               {
//                 method: "DELETE",
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );

//             // ✅ Add 1 second delay to ensure everything clears before redirect
//             setTimeout(() => {
//               alert("Payment successful and order placed!");
//               window.location.href = `/invoice/${result.orderId}`;
//             }, 1000);
//           } else {
//             alert("Payment verification failed.");
//           }
//         },
//         prefill: {
//           name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
//           email: emailRef.current.value,
//           contact: phoneRef.current.value,
//         },
//         theme: { color: "#3399cc" },
//         method: {
//           upi: true,
//           card: false,
//           netbanking: false,
//           wallet: false,
//         },
//       };
      

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Something went wrong!");
//     }
//   };

//   const ShowCheckout = () => {
//     let totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

//     return (
//       <div className="container py-5">
//         <div className="row my-4">
//           <div className="col-md-5 col-lg-4 order-md-last">
//             <div className="card mb-4">
//               <div className="card-header py-3 bg-light">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <ul className="list-group list-group-flush">
//                   <li className="list-group-item d-flex justify-content-between">
//                     Products ({totalItems}){" "}
//                     <span>Rs.{Math.round(subtotal)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between">
//                     Shipping <span>Rs.{shipping}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between">
//                     <strong>Total</strong>
//                     <strong>Rs.{Math.round(total)}</strong>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-7 col-lg-8">
//             <div className="card mb-4">
//               <div className="card-header py-3">
//                 <h4 className="mb-0">Billing address</h4>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handlePayment}>
//                   <div className="row g-3">
//                     <div className="col-sm-6 my-1">
//                       <label className="form-label">First name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={firstNameRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-sm-6 my-1">
//                       <label className="form-label">Last name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={lastNameRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12 my-1">
//                       <label className="form-label">Email</label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         ref={emailRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12 my-1">
//                       <label className="form-label">Phone Number</label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         ref={phoneRef}
//                         required
//                       />
//                     </div>

//                     <div className="col-12 my-1">
//                       <label className="form-label">Address</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={addressRef}
//                         required
//                       />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Address 2 (Optional)</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={address2Ref}
//                       />
//                     </div>
//                     <div className="col-md-5 my-1">
//                       <label className="form-label">Country</label>
//                       <select
//                         className="form-select"
//                         defaultValue="India"
//                         disabled
//                       >
//                         <option>India</option>
//                       </select>
//                     </div>
//                     <div className="col-md-4 my-1">
//                       <label className="form-label">State</label>
//                       <select className="form-select" ref={stateRef} required>
//                         <option>Delhi</option>
//                         <option>Delhi NCR</option>
//                         <option>Punjab</option>
//                         <option>Maharashtra</option>
//                         {/* Add more if needed */}
//                       </select>
//                     </div>
//                     <div className="col-md-3 my-1">
//                       <label className="form-label">Zip</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         ref={zipRef}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <hr className="my-4" />
//                   <button className="btn btn-primary w-100" type="submit">
//                     Pay with Razorpay
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const EmptyCart = () => (
//     <div className="container text-center py-5">
//       <h4 className="display-5">No item in Cart</h4>
//       <Link to="/" className="btn btn-outline-dark mt-3">
//         <i className="fa fa-arrow-left"></i> Continue Shopping
//       </Link>
//     </div>
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="container my-3 py-3">
//         <h1 className="text-center">Checkout</h1>
//         <hr />
//         {cart.length ? <ShowCheckout /> : <EmptyCart />}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Checkout;









import React, { useRef, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../redux/action";
import PromoInput from "./PromoInput";

const Checkout = () => {
  const cart = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const address2Ref = useRef();
  const stateRef = useRef();
  const zipRef = useRef();

  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const { order } = await res.json();
      const token = localStorage.getItem("apitoken");

      const rzp = new window.Razorpay({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Your Store",
        description: "Order Payment",
        handler: async function (response) {
          const verifyRes = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                total_amount: total,
                products: cart.map((item) => ({
                  product_id: item.id,
                  quantity: item.qty,
                  price: item.price,
                })),
                address: {
                  full_name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
                  phone_number: phoneRef.current.value,
                  street_address: addressRef.current.value,
                  city: "Delhi",
                  state: stateRef.current.value,
                  postal_code: zipRef.current.value,
                  country: "India",
                },
              },
            }),
          });

          const result = await verifyRes.json();
          if (result.success) {
            dispatch(clearCart());
            localStorage.removeItem("cart");

            await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Payment successful!");
            window.location.href = `/invoice/${result.orderId}`;
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
          email: emailRef.current.value,
          contact: phoneRef.current.value,
        },
        theme: { color: "#3399cc" },
        method: { upi: true },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong!");
    }
  };

  const EmptyCart = () => (
    <div className="container text-center py-5">
      <h4 className="display-5">No item in Cart</h4>
      <Link to="/" className="btn btn-outline-dark mt-3">
        <i className="fa fa-arrow-left"></i> Continue Shopping
      </Link>
    </div>
  );

  const ShowCheckout = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
      <div className="container py-5">
        <div className="row my-4">
          <div className="col-md-5 col-lg-4 order-md-last">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    Products ({totalItems}) <span>Rs.{Math.round(subtotal)}</span>
                  </li>
                  {promoApplied && (
                    <li className="list-group-item d-flex justify-content-between text-success">
                      Discount <span>- Rs.{discount}</span>
                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between">
                    Shipping <span>Rs.{shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Total</strong> <strong>Rs.{Math.round(total)}</strong>
                  </li>
                </ul>

                {/* Promo Code Input (outside billing inputs to prevent rerender issue) */}
                <PromoInput
                  subtotal={subtotal}
                  setDiscount={setDiscount}
                  setTotal={() => {}} // optional if you're using only `discount`

                  // setPromoApplied={setPromoApplied}
                  // setTotal={(val) => setDiscount(subtotal - val)} // ❌ wrong

                />
              </div>
            </div>
          </div>

          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="mb-0">Billing address</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handlePayment}>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label">First name</label>
                      <input type="text" className="form-control" ref={firstNameRef} required />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Last name</label>
                      <input type="text" className="form-control" ref={lastNameRef} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" ref={emailRef} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" ref={phoneRef} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" ref={addressRef} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address 2</label>
                      <input type="text" className="form-control" ref={address2Ref} />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Country</label>
                      <select className="form-select" disabled>
                        <option>India</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <select className="form-select" ref={stateRef} required>
                        <option>Delhi</option>
                        <option>Delhi NCR</option>
                        <option>Punjab</option>
                        <option>Maharashtra</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Zip</label>
                      <input type="text" className="form-control" ref={zipRef} required />
                    </div>
                  </div>

                  <hr className="my-4" />
                  <button className="btn btn-primary w-100" type="submit">
                    Pay with Razorpay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {cart.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;




















// import React, { useState, useEffect, useMemo } from "react";
// import { Footer, Navbar } from "../components";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { clearCart } from "../redux/action";
// import PromoInput from "./PromoInput";

// const Checkout = () => {
//   const cart = useSelector((state) => state.handleCart);
//   const dispatch = useDispatch();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [stateVal, setStateVal] = useState("Delhi");
//   const [zip, setZip] = useState("");

//   const [discount, setDiscount] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [promoApplied, setPromoApplied] = useState(false);

//   const subtotal = useMemo(() => {
//     return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//   }, [cart]);

//   const shipping = 0;

//   useEffect(() => {
//     const token = localStorage.getItem("apitoken");
//     if (!token) return;

//     fetch("http://localhost:5000/api/user/basic", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setFirstName(data.first_name || "");
//         setLastName(data.last_name || "");
//         setEmail(data.email || "");
//       })
//       .catch((err) => {
//         console.error("Error fetching user info:", err);
//       });
//   }, []);

//   useEffect(() => {
//     if (!promoApplied) {
//       setTotal(subtotal);
//     }
//   }, [subtotal, promoApplied]);

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: total }),
//       });

//       const { order } = await res.json();
//       const token = localStorage.getItem("apitoken");

//       const rzp = new window.Razorpay({
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         order_id: order.id,
//         name: "Your Store",
//         description: "Order Payment",
//         handler: async function (response) {
//           const verifyRes = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               orderData: {
//                 total_amount: total,
//                 products: cart.map((item) => ({
//                   product_id: item.id,
//                   quantity: item.qty,
//                   price: item.price,
//                 })),
//                 address: {
//                   full_name: `${firstName} ${lastName}`,
//                   phone_number: phone,
//                   street_address: address,
//                   city: "Delhi",
//                   state: stateVal,
//                   postal_code: zip,
//                   country: "India",
//                 },
//               },
//             }),
//           });

//           const result = await verifyRes.json();
//           if (result.success) {
//             dispatch(clearCart());
//             localStorage.removeItem("cart");
//             await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
//               method: "DELETE",
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("✅ Payment successful!");
//             window.location.href = `/invoice/${result.orderId}`;
//           } else {
//             alert("❌ Payment verification failed.");
//           }
//         },
//         prefill: {
//           name: `${firstName} ${lastName}`,
//           email,
//           contact: phone,
//         },
//         theme: { color: "#3399cc" },
//         method: { upi: true },
//       });

//       rzp.open();
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Something went wrong!");
//     }
//   };

//   const EmptyCart = () => (
//     <div className="container text-center py-5">
//       <h4 className="display-5">No item in Cart</h4>
//       <Link to="/" className="btn btn-outline-dark mt-3">
//         <i className="fa fa-arrow-left"></i> Continue Shopping
//       </Link>
//     </div>
//   );

//   const ShowCheckout = () => {
//     let totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

//     return (
//       <div className="container py-5">
//         <div className="row my-4">
//           <div className="col-md-5 col-lg-4 order-md-last">
//             <div className="card mb-4">
//               <div className="card-header bg-light">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <ul className="list-group list-group-flush">
//                   <li className="list-group-item d-flex justify-content-between">
//                     Products ({totalItems}) <span>Rs.{Math.round(subtotal)}</span>
//                   </li>
//                   {promoApplied && (
//                     <li className="list-group-item d-flex justify-content-between text-success">
//                       Discount <span>- Rs.{discount}</span>
//                     </li>
//                   )}
//                   <li className="list-group-item d-flex justify-content-between">
//                     Shipping <span>Rs.{shipping}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between">
//                     <strong>Total</strong> <strong>Rs.{Math.round(total)}</strong>
//                   </li>
//                 </ul>

//                 <PromoInput
//                   subtotal={subtotal}
//                   setDiscount={setDiscount}
//                   setTotal={setTotal}
//                   promoApplied={promoApplied}
//                   setPromoApplied={setPromoApplied}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Billing Form */}
//           <div className="col-md-7 col-lg-8">
//             <div className="card mb-4">
//               <div className="card-header">
//                 <h4 className="mb-0">Billing address</h4>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handlePayment}>
//                   <div className="row g-3">
//                     <div className="col-sm-6">
//                       <label className="form-label">First name</label>
//                       <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//                     </div>
//                     <div className="col-sm-6">
//                       <label className="form-label">Last name</label>
//                       <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Email</label>
//                       <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Phone</label>
//                       <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Address</label>
//                       <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label">Address 2</label>
//                       <input type="text" className="form-control" value={address2} onChange={(e) => setAddress2(e.target.value)} />
//                     </div>
//                     <div className="col-md-5">
//                       <label className="form-label">Country</label>
//                       <select className="form-select" disabled>
//                         <option>India</option>
//                       </select>
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label">State</label>
//                       <select className="form-select" value={stateVal} onChange={(e) => setStateVal(e.target.value)} required>
//                         <option>Delhi</option>
//                         <option>Delhi NCR</option>
//                         <option>Punjab</option>
//                         <option>Maharashtra</option>
//                       </select>
//                     </div>
//                     <div className="col-md-3">
//                       <label className="form-label">Zip</label>
//                       <input type="text" className="form-control" value={zip} onChange={(e) => setZip(e.target.value)} required />
//                     </div>
//                   </div>
//                   <hr className="my-4" />
//                   <button className="btn btn-primary w-100" type="submit">
//                     Pay with Razorpay
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container my-3 py-3">
//         <h1 className="text-center">Checkout</h1>
//         <hr />
//         {cart.length ? <ShowCheckout /> : <EmptyCart />}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Checkout;
