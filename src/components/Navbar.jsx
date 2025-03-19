import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/action";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Fix for mobile menu
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
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev); // Fix for mobile menu

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

        {/* Cart Button (Visible in Mobile View) */}
        <NavLink to="/cart" className="btn btn-outline-dark mx-2 d-lg-none">
          <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
        </NavLink>

        {/* Hamburger Toggle (Fixed) */}
        <button
          className="navbar-toggler mx-2 p-1 p-md-2"
          type="button"
          onClick={toggleMobileMenu} // Using React state
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
          style={{ width: "35px", height: "35px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`} id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={toggleMobileMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product" onClick={toggleMobileMenu}>
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={toggleMobileMenu}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={toggleMobileMenu}>
                Contact
              </NavLink>
            </li>

            {/* Profile Dropdown (Mobile View) */}
            <li className="nav-item dropdown d-lg-none">
              <button
                className="btn btn-outline-dark dropdown-toggle w-100"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                Profile
              </button>
              <ul className={`dropdown-menu dropdown-menu-end w-100 ${isDropdownOpen ? "show" : ""}`}>
                <li><NavLink className="dropdown-item" to="/profile" onClick={toggleMobileMenu}>My Profile</NavLink></li>
                <li><NavLink className="dropdown-item" to="/profile/orders" onClick={toggleMobileMenu}>My Orders</NavLink></li>
                <li><NavLink className="dropdown-item" to="/profile/wishlist" onClick={toggleMobileMenu}>Wishlist</NavLink></li>
                <li><NavLink className="dropdown-item" to="/profile/settings" onClick={toggleMobileMenu}>Settings</NavLink></li>
                <li>
                  <button className="dropdown-item" onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>

            {/* Login/Register (Mobile View - FIXED) */}
            {!localStorage.getItem("apitoken") ? (
              <>
                <li className="nav-item d-lg-none">
                  <NavLink to="/login" className="btn btn-outline-dark m-2 w-100" onClick={toggleMobileMenu}>
                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                  </NavLink>
                </li>
                <li className="nav-item d-lg-none">
                  <NavLink to="/register" className="btn btn-outline-dark m-2 w-100" onClick={toggleMobileMenu}>
                    <i className="fa fa-user-plus mr-1"></i> Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item d-lg-none">
                <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="btn btn-outline-dark m-2 w-100">
                  <i className="fa fa-sign-out-alt mr-1"></i> Logout
                </button>
              </li>
            )}
          </ul>

          {/* Right Side Buttons (Desktop View) */}
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
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
