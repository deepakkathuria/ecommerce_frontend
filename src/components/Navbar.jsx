import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import { isTokenExpired } from "../utils/isTokenExpired";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("apitoken");
  const [isLoggedIn, setIsLoggedIn] = useState(token && !isTokenExpired(token));

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        
        {/* 🔹 Logo (Left) */}
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          <img src="/assets/logo1.png" alt="DK Ecommerce Logo" width="140" height="50" />
        </NavLink>

        {/* 🔹 Centered Navbar Links (Only Visible in Desktop) */}
        <div className="d-none d-lg-block mx-auto">
          <ul className="navbar-nav flex-row gap-4 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        {/* 🔹 Right Side Buttons - Properly Aligned in One Row */}
        <div className="d-flex align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className="btn btn-dark btn-sm">
                <i className="fa fa-sign-in-alt"></i> Login
              </NavLink>
              <NavLink to="/register" className="btn btn-outline-dark btn-sm">
                <i className="fa fa-user-plus"></i> Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/cart" className="btn btn-outline-dark btn-sm">
                <i className="fa fa-cart-shopping"></i> Cart ({state.length})
              </NavLink>

              <div className="dropdown">
                <button className="btn btn-outline-dark btn-sm dropdown-toggle" type="button" onClick={toggleDropdown}>
                  Profile
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? "show" : ""}`}>
                  <li><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/profile/orders">My Orders</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/profile/wishlist">Wishlist</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/profile/settings">Settings</NavLink></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </>
          )}

          {/* 🔹 Hamburger Icon (Always Last) */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>

      {/* 🔹 Mobile Menu Links (Inside Hamburger) */}
      {isMobileMenuOpen && (
        <div className="bg-light p-3 d-lg-none">
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product" onClick={toggleMobileMenu}>Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={toggleMobileMenu}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={toggleMobileMenu}>Contact</NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
