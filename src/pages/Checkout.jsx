import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../redux/action";
import PromoInput from "./PromoInput";

const Checkout = () => {
  const cart = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [stateVal, setStateVal] = useState("Delhi");
  const [zip, setZip] = useState("");

  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  // const shipping = 0;
  const shipping = subtotal > 1000 ? 0 : 49;

  const total = subtotal - discount + shipping;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/user", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.user) {
          const { name, email } = result.user;
          if (name) {
            setFirstName(name.split(' ')[0] || "");
            setLastName(name.split(' ')[1] || "");
          }
          if (email) {
            setEmail(email);
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
      }
    };

    fetchUserData();
  }, []);

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
                  full_name: `${firstName} ${lastName}`,
                  phone_number: phone,
                  street_address: address,
                  city: "Delhi",
                  state: stateVal,
                  postal_code: zip,
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
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone,
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

  if (!cart.length) {
    return (
      <>
        <Navbar />
        <div className="container my-3 py-5 text-center">
          <h4>No item in Cart</h4>
          <Link to="/" className="btn btn-outline-dark mt-3">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />

        <div className="row">
          {/* Billing Details */}
          <div className="col-md-7 col-lg-8 mb-4">
            <form onSubmit={handlePayment}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">First name</label>
                  <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Last name</label>
                  <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Address 2</label>
                  <input type="text" className="form-control" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Country</label>
                  <select className="form-select" disabled>
                    <option>India</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <select className="form-select" value={stateVal} onChange={(e) => setStateVal(e.target.value)} required>
                    <option>Delhi</option>
                    <option>Delhi NCR</option>
                    <option>Punjab</option>
                    <option>Maharashtra</option>
                    <option>others</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Zip</label>
                  <input type="text" className="form-control" value={zip} onChange={(e) => setZip(e.target.value)} required />
                </div>
              </div>
              <hr className="my-4" />
              <button className="btn btn-primary w-100" type="submit">
                Pay with Razorpay
              </button>
            </form>
          </div>

          {/* Order Summary + Promo Input */}
          <div className="col-md-5 col-lg-4">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    Products ({cart.reduce((acc, item) => acc + item.qty, 0)}) <span>₹{Math.round(subtotal)}</span>
                  </li>
                  {promoApplied && (
                    <li className="list-group-item d-flex justify-content-between text-success">
                      Discount <span>- ₹{discount}</span>
                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between">
                    Shipping <span>₹{shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Total</strong> <strong>₹{Math.round(total)}</strong>
                  </li>
                </ul>

                <PromoInput
                  subtotal={subtotal}
                  setDiscount={setDiscount}
                  setPromoApplied={setPromoApplied}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
