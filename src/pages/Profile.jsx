import React, { useEffect, useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import UserDetails from "./UserDetails";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Addresses from "./Addresses";
import Settings from "./Settings";
import { Navbar, Footer } from "../components";

const Profile = () => {
  const [latestOrderId, setLatestOrderId] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.orders.length > 0) {
          setLatestOrderId(data.orders[0].order_id); // Get the most recent order
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
      }
    };

    fetchLatestOrder();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">My Profile</h1>
        <hr />
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <ul className="list-group">
              <li className="list-group-item">
                <NavLink to="/profile" end className={({ isActive }) => (isActive ? "active fw-bold" : "")}>
                  User Details
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink to="/profile/orders" className={({ isActive }) => (isActive ? "active fw-bold" : "")}>
                  My Orders
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink to={`/profile/addresses/${latestOrderId}`} className={({ isActive }) => (isActive ? "active fw-bold" : "")}>
                  Addresses
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink to="/profile/settings" className={({ isActive }) => (isActive ? "active fw-bold" : "")}>
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="col-md-9">
            <div className="card p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/profile/details" />} />
                <Route path="/details" element={<UserDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/addresses/:orderId" element={<Addresses />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
