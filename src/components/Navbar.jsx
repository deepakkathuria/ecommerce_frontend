import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/action";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("apitoken");
      await fetch(
        "https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          <img
            src="/assets/logo1.png"
            alt="DK Ecommerce Logo"
            className="d-block mx-auto d-md-none"
            width="100"
            height="50"
          />
          <img
            src="/assets/logo1.png"
            alt="DK Ecommerce Logo"
            className="d-none d-md-block mx-auto"
            width="150"
            height="100"
          />
        </NavLink>

        {/* Cart Button (Now outside the collapsible menu) */}
        <NavLink to="/cart" className="btn btn-outline-dark mx-2 d-lg-none">
          <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
        </NavLink>

        {/* Hamburger Toggle */}
        <button
          className="navbar-toggler mx-2 p-1 p-md-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            width: "35px", 
            height: "35px", 
          }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              width: "22px", 
              height: "22px", 
            }}
          ></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>

            {/* Profile Dropdown (Now visible in mobile view as well) */}
            <li className="nav-item dropdown d-lg-none">
              <button
                className="btn btn-outline-dark dropdown-toggle w-100"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                Profile
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end w-100 ${
                  isDropdownOpen ? "show" : ""
                }`}
              >
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/orders">
                    My Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/wishlist">
                    Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/settings">
                    Settings
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right Side Buttons (Only for Desktop) */}
          <div className="buttons text-center d-none d-lg-block">
            <NavLink to="/cart" className="btn btn-outline-dark m-2">
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
            </NavLink>

            {localStorage.getItem("apitoken") ? (
              <button onClick={handleLogout} className="btn btn-outline-dark m-2">
                <i className="fa fa-sign-out-alt mr-1"></i> Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-dark m-2">
                  <i className="fa fa-sign-in-alt mr-1"></i> Login
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-dark m-2">
                  <i className="fa fa-user-plus mr-1"></i> Register
                </NavLink>
              </>
            )}

            {/* Profile Dropdown for Desktop */}
            <div className="dropdown d-inline">
              <button
                className="btn btn-outline-dark dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                Profile
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end ${
                  isDropdownOpen ? "show" : ""
                }`}
              >
                <li>
                  <NavLink className="dropdown-item" to="/profile">
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/orders">
                    My Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/wishlist">
                    Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/profile/settings">
                    Settings
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
