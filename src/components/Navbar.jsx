import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import { isTokenExpired } from "../utils/isTokenExpired";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categories, setCategories] = useState([]);
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("apitoken");
  const [isLoggedIn, setIsLoggedIn] = useState(token && !isTokenExpired(token));

  // Fetch categories for navigation
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/products?limit=1000");
        const result = await response.json();
        
        if (result.rows) {
          const uniqueCategories = [...new Set(result.rows.map(item => item.category?.toLowerCase()).filter(Boolean))];
          setCategories(uniqueCategories.slice(0, 5)); // Show top 5 categories
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(e);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <style>{`
        .navbar {
          z-index: 1000;
          position: relative;
        }
        
        .dropdown-menu {
          z-index: 9999 !important;
          position: absolute !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border: 1px solid #dee2e6 !important;
        }
        
        .dropdown-menu.show {
          z-index: 9999 !important;
        }
        
        .navbar-brand {
          font-weight: bold;
          font-size: 1.5rem;
        }
        
        .search-input {
          max-width: 400px;
        }
        
        .mobile-menu {
          z-index: 1040;
        }
        
        .category-nav {
          z-index: 1020;
        }
        
        /* Ensure cart content is not affected */
        .container, .row, .col-lg-8, .col-lg-4 {
          position: relative;
          z-index: 1;
        }
      `}</style>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand fw-bold fs-4" to="/">
            <img 
              src="/assets/logo1.png" 
              alt="DK Ecommerce Logo" 
              width="120" 
              height="45"
              className="d-inline-block align-text-top"
            />
          </NavLink>

          {/* Search Bar - Desktop */}
          <div className="d-none d-lg-flex flex-grow-1 mx-4">
            <form onSubmit={handleSearch} className="w-100">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-end-0"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    borderTopLeftRadius: "25px",
                    borderBottomLeftRadius: "25px",
                    borderColor: isSearchFocused ? "#007bff" : "#dee2e6",
                  }}
                />
                <button
                  className="btn btn-primary border-start-0"
                  type="submit"
                  style={{
                    borderTopRightRadius: "25px",
                    borderBottomRightRadius: "25px",
                  }}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart - Desktop */}
            {isLoggedIn && (
              <NavLink 
                to="/cart" 
                className="btn btn-outline-primary position-relative d-none d-lg-inline-flex align-items-center gap-2"
              >
                <i className="fa fa-shopping-cart"></i>
                <span>Cart</span>
                {state.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {state.reduce((total, item) => total + (item.qty || 1), 0)}
                  </span>
                )}
              </NavLink>
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button" 
                  onClick={toggleDropdown}
                >
                  <i className="fa fa-user-circle"></i>
                  <span className="d-none d-md-inline">Profile</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? "show" : ""}`} style={{ zIndex: 9999 }}>
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fa fa-user"></i>
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/profile/orders" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fa fa-shopping-bag"></i>
                      My Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/profile/wishlist" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fa fa-heart"></i>
                      Wishlist
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/profile/settings" onClick={() => setIsDropdownOpen(false)}>
                      <i className="fa fa-cog"></i>
                      Settings
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center gap-2 text-danger" 
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <i className="fa fa-sign-out"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <NavLink to="/login" className="btn btn-primary btn-sm">
                  <i className="fa fa-sign-in"></i>
                  <span className="d-none d-md-inline ms-1">Login</span>
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-primary btn-sm">
                  <i className="fa fa-user-plus"></i>
                  <span className="d-none d-md-inline ms-1">Register</span>
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-toggler border-0"
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-light border-top">
            <div className="container py-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button className="btn btn-primary" type="submit" disabled={!searchQuery.trim()}>
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="row g-2">
                <div className="col-6">
                  <NavLink 
                    to="/" 
                    className="btn btn-outline-primary w-100"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-home"></i> Home
                  </NavLink>
                </div>
                <div className="col-6">
                  <NavLink 
                    to="/product" 
                    className="btn btn-outline-primary w-100"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-shopping-bag"></i> Products
                  </NavLink>
                </div>
                <div className="col-6">
                  <NavLink 
                    to="/about" 
                    className="btn btn-outline-primary w-100"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-info-circle"></i> About
                  </NavLink>
                </div>
                <div className="col-6">
                  <NavLink 
                    to="/contact" 
                    className="btn btn-outline-primary w-100"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-envelope"></i> Contact
                  </NavLink>
                </div>
              </div>

              {/* Mobile Cart */}
              {isLoggedIn && (
                <div className="mt-3">
                  <NavLink 
                    to="/cart" 
                    className="btn btn-primary w-100 position-relative"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-shopping-cart"></i> Cart
                    {state.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {state.reduce((total, item) => total + (item.qty || 1), 0)}
                      </span>
                    )}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-primary to-info text-white py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <i className="fa fa-truck"></i>
              <span className="small">Free Delivery on Orders Above ₹1000</span>
            </div>
            <div className="d-none d-md-flex align-items-center gap-3">
              <i className="fa fa-shield"></i>
              <span className="small">UPI Payments Only</span>
              <i className="fa fa-headphones"></i>
              <span className="small">Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-light border-bottom">
        <div className="container">
          <div className="d-flex justify-content-center py-2">
            <div className="d-flex gap-4 overflow-auto">
              <NavLink to="/product" className="text-decoration-none text-dark small fw-bold">
                All Products
              </NavLink>
              {categories.map((category, index) => (
                <NavLink 
                  key={index}
                  to={`/product?category=${encodeURIComponent(category)}`} 
                  className="text-decoration-none text-muted small"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
