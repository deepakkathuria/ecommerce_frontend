import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import UserDetails from "./UserDetails";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Addresses from "./Addresses";
import Settings from "./Settings";
import { Navbar, Footer } from "../components";

const Profile = () => {
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
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) =>
                    isActive ? "active text-decoration-none" : "text-decoration-none"
                  }
                >
                  User Details
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink
                  to="/profile/orders"
                  className={({ isActive }) =>
                    isActive ? "active text-decoration-none" : "text-decoration-none"
                  }
                >
                  My Orders
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink
                  to="/profile/wishlist"
                  className={({ isActive }) =>
                    isActive ? "active text-decoration-none" : "text-decoration-none"
                  }
                >
                  Wishlist
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink
                  to="/profile/addresses"
                  className={({ isActive }) =>
                    isActive ? "active text-decoration-none" : "text-decoration-none"
                  }
                >
                  Addresses
                </NavLink>
              </li>
              <li className="list-group-item">
                <NavLink
                  to="/profile/settings"
                  className={({ isActive }) =>
                    isActive ? "active text-decoration-none" : "text-decoration-none"
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="col-md-9">
            <div className="card p-4">
              <Routes>
                <Route path="/" element={<UserDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/addresses" element={<Addresses />} />
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
