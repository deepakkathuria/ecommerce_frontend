// // import React, { useState, useEffect } from "react";
// // import { NavLink, useNavigate } from "react-router-dom";
// // import { useSelector, useDispatch } from "react-redux";
// // import { clearCart } from "../redux/action";
// // import { isTokenExpired } from "../utils/isTokenExpired";

// // const Navbar = () => {
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const state = useSelector((state) => state.handleCart);
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   const token = localStorage.getItem("apitoken");
// //   const [isLoggedIn, setIsLoggedIn] = useState(token && !isTokenExpired(token));

// //   useEffect(() => {
// //     if (token && isTokenExpired(token)) {
// //       localStorage.removeItem("apitoken");
// //       dispatch(clearCart());
// //       setIsLoggedIn(false);
// //       navigate("/login");
// //     }
// //   }, [token, dispatch, navigate]);

// //   const handleLogout = async () => {
// //     try {
// //       await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
// //         method: "DELETE",
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       localStorage.removeItem("apitoken");
// //       dispatch(clearCart());
// //       setIsLoggedIn(false);
// //       navigate("/login");
// //     } catch (err) {
// //       console.error("Logout failed:", err);
// //     }
// //   };

// //   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
// //   const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

// //   return (
// //     <>
// //     <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
// //       <div className="container-fluid d-flex justify-content-between align-items-center px-3">

// //         {/* 🔹 Logo (Always Left) */}
// //         <NavLink className="navbar-brand fw-bold fs-4" to="/">
// //           <img src="/assets/logo1.png" alt="DK Ecommerce Logo" width="110" height="40" />
// //         </NavLink>

// //         {/* 🔹 Right Side (Icons for Mobile, Full Buttons for Desktop) */}
// //         <div className="d-flex align-items-center gap-3">
// //           {!isLoggedIn ? (
// //             <>
// //               {/* ✅ Mobile: Show Icons Only */}
// //               <NavLink to="/login" className="btn btn-dark btn-sm d-lg-none">
// //                 <i className="fa-solid fa-key"></i>
// //               </NavLink>
// //               <NavLink to="/register" className="btn btn-outline-dark btn-sm d-lg-none">
// //                 <i className="fa-solid fa-user-plus"></i>
// //               </NavLink>

// //               {/* ✅ Desktop: Show Full Buttons */}
// //               <NavLink to="/login" className="btn btn-dark btn-sm d-none d-lg-inline">
// //                 <i className="fa-solid fa-key"></i> Login
// //               </NavLink>
// //               <NavLink to="/register" className="btn btn-outline-dark btn-sm d-none d-lg-inline">
// //                 <i className="fa-solid fa-user-plus"></i> Register
// //               </NavLink>
// //             </>
// //           ) : (
// //             <>
// //               {/* ✅ Mobile: Cart Icon with Badge */}
// //               <NavLink to="/cart" className="btn btn-outline-dark btn-sm d-lg-none position-relative">
// //                 <i className="fa fa-shopping-cart"></i>
// //                 {state.length > 0 && (
// //                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
// //                     {state.length}
// //                   </span>
// //                 )}
// //               </NavLink>

// //               {/* ✅ Desktop: Full Cart Button with Count */}
// //               <NavLink to="/cart" className="btn btn-outline-dark btn-sm d-none d-lg-inline">
// //                 <i className="fa fa-shopping-cart"></i> Cart ({state.length})
// //               </NavLink>

// //               <div className="dropdown">
// //                 <button className="btn btn-outline-dark btn-sm dropdown-toggle" type="button" onClick={toggleDropdown}>
// //                   Profile
// //                 </button>
// //                 <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? "show" : ""}`}>
// //                   <li><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
// //                   <li><NavLink className="dropdown-item" to="/profile/orders">My Orders</NavLink></li>
// //                   <li><NavLink className="dropdown-item" to="/profile/wishlist">Wishlist</NavLink></li>
// //                   <li><NavLink className="dropdown-item" to="/profile/settings">Settings</NavLink></li>
// //                   <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
// //                 </ul>
// //               </div>
// //             </>
// //           )}

// //           {/* 🔹 Hamburger Icon (Always Last) */}
// //           <button
// //             className="navbar-toggler"
// //             type="button"
// //             onClick={toggleMobileMenu}
// //             aria-expanded={isMobileMenuOpen}
// //             aria-label="Toggle navigation"
// //           >
// //             <span className="navbar-toggler-icon"></span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* 🔹 Mobile Menu Links (Inside Hamburger) */}
// //       {isMobileMenuOpen && (
// //         <div className="bg-light p-3 d-lg-none">
// //           <ul className="navbar-nav text-center">
// //             <li className="nav-item"><NavLink className="nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink></li>
// //             <li className="nav-item"><NavLink className="nav-link" to="/product" onClick={toggleMobileMenu}>Products</NavLink></li>
// //             <li className="nav-item"><NavLink className="nav-link" to="/about" onClick={toggleMobileMenu}>About</NavLink></li>
// //             <li className="nav-item"><NavLink className="nav-link" to="/contact" onClick={toggleMobileMenu}>Contact</NavLink></li>
// //           </ul>
// //         </div>
// //       )}
// //     </nav>
// //     {/* 🔻 Scrolling Offer Bar Below Navbar */}
// // <div
// //   style={{
// //     background: "#222",
// //     color: "#fff",
// //     whiteSpace: "nowrap",
// //     overflow: "hidden",
// //     position: "relative",
// //     fontSize: "14px",
// //     height: "35px",
// //     display: "flex",
// //     alignItems: "center",
// //   }}
// // >
// //   <div
// //     style={{
// //       display: "inline-block",
// //       paddingLeft: "100%",
// //       animation: "scroll-text 15s linear infinite",
// //     }}
// //   >
// //     🛍️ FREE DELIVERY ON ALL ORDERS – LIMITED TIME ONLY 🚚 &nbsp;&nbsp;&nbsp;&nbsp;
// //     🎁 Exclusive Offers Every Week – Stay Tuned 💥 &nbsp;&nbsp;&nbsp;&nbsp;
// //   </div>

// //   {/* ✅ Animation CSS inside JSX */}
// //   <style>
// //     {`
// //       @keyframes scroll-text {
// //         0% { transform: translateX(0); }
// //         100% { transform: translateX(-100%); }
// //       }
// //     `}
// //   </style>
// // </div>

// //     </>

// //   );
// // };

// // export default Navbar;

// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { clearCart } from "../redux/action";
// import { isTokenExpired } from "../utils/isTokenExpired";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const state = useSelector((state) => state.handleCart);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const token = localStorage.getItem("apitoken");
//   const [isLoggedIn, setIsLoggedIn] = useState(token && !isTokenExpired(token));

//   useEffect(() => {
//     if (token && isTokenExpired(token)) {
//       localStorage.removeItem("apitoken");
//       dispatch(clearCart());
//       setIsLoggedIn(false);
//       navigate("/login");
//     }
//   }, [token, dispatch, navigate]);

//   const handleLogout = async () => {
//     try {
//       await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       localStorage.removeItem("apitoken");
//       dispatch(clearCart());
//       setIsLoggedIn(false);
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
//   const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
//         <div className="container-fluid d-flex justify-content-between align-items-center px-3">
//           {/* 🔹 Logo (Always Left) */}
//           <NavLink className="navbar-brand fw-bold fs-4" to="/">
//             <img src="/assets/logo1.png" alt="DK Ecommerce Logo" width="110" height="40" />
//           </NavLink>

//           {/* 🔹 Nav Links in Web View */}
//           <div className="d-none d-lg-block">
//             <ul className="navbar-nav flex-row gap-4 ms-4">
//               <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/product">Products</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
//             </ul>
//           </div>

//           {/* 🔹 Right Side Icons & Buttons */}
//           <div className="d-flex align-items-center gap-3">
//             {!isLoggedIn ? (
//               <>
//                 <NavLink to="/login" className="btn btn-dark btn-sm d-lg-none">
//                   <i className="fa-solid fa-key"></i>
//                 </NavLink>
//                 <NavLink to="/register" className="btn btn-outline-dark btn-sm d-lg-none">
//                   <i className="fa-solid fa-user-plus"></i>
//                 </NavLink>

//                 <NavLink to="/login" className="btn btn-dark btn-sm d-none d-lg-inline">
//                   <i className="fa-solid fa-key"></i> Login
//                 </NavLink>
//                 <NavLink to="/register" className="btn btn-outline-dark btn-sm d-none d-lg-inline">
//                   <i className="fa-solid fa-user-plus"></i> Register
//                 </NavLink>
//               </>
//             ) : (
//               <>
//                 <NavLink to="/cart" className="btn btn-outline-dark btn-sm d-lg-none position-relative">
//                   <i className="fa fa-shopping-cart"></i>
//                   {state.length > 0 && (
//                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                       {state.length}
//                     </span>
//                   )}
//                 </NavLink>

//                 <NavLink to="/cart" className="btn btn-outline-dark btn-sm d-none d-lg-inline">
//                   <i className="fa fa-shopping-cart"></i> Cart ({state.length})
//                 </NavLink>

//                 <div className="dropdown">
//                   <button className="btn btn-outline-dark btn-sm dropdown-toggle" onClick={toggleDropdown}>
//                     Profile
//                   </button>
//                   <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? "show" : ""}`}>
//                     <li><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
//                     <li><NavLink className="dropdown-item" to="/profile/orders">My Orders</NavLink></li>
//                     <li><NavLink className="dropdown-item" to="/profile/wishlist">Wishlist</NavLink></li>
//                     <li><NavLink className="dropdown-item" to="/profile/settings">Settings</NavLink></li>
//                     <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
//                   </ul>
//                 </div>
//               </>
//             )}

//             {/* 🔹 Hamburger */}
//             <button
//               className="navbar-toggler"
//               type="button"
//               onClick={toggleMobileMenu}
//               aria-expanded={isMobileMenuOpen}
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//           </div>
//         </div>

//         {/* 🔹 Mobile Menu Links */}
//         {isMobileMenuOpen && (
//           <div className="bg-light p-3 d-lg-none">
//             <ul className="navbar-nav text-center">
//               <li className="nav-item"><NavLink className="nav-link" to="/" onClick={toggleMobileMenu}>Home</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/product" onClick={toggleMobileMenu}>Products</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/about" onClick={toggleMobileMenu}>About</NavLink></li>
//               <li className="nav-item"><NavLink className="nav-link" to="/contact" onClick={toggleMobileMenu}>Contact</NavLink></li>
//             </ul>
//           </div>
//         )}
//       </nav>

//       {/* 🔻 Scrolling Offer Bar Below Navbar */}
//       <div
//         style={{
//           background: "#222",
//           color: "#fff",
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           position: "relative",
//           fontSize: "14px",
//           height: "35px",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "inline-block",
//             paddingLeft: "100%",
//             animation: "scroll-text 15s linear infinite",
//           }}
//         >
//           🛍️ FREE DELIVERY ON ALL ORDERS – LIMITED TIME ONLY 🚚 &nbsp;&nbsp;&nbsp;&nbsp;
//           🎁 Exclusive Offers Every Week – Stay Tuned 💥 &nbsp;&nbsp;&nbsp;&nbsp;
//         </div>

//         {/* ✅ Keyframe Animation */}
//         <style>
//           {`
//             @keyframes scroll-text {
//               0% { transform: translateX(0); }
//               100% { transform: translateX(-100%); }
//             }
//           `}
//         </style>
//       </div>
//     </>
//   );
// };

// export default Navbar;

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
      await fetch(
        "https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center px-3">
          {/* Logo */}
          <NavLink className="navbar-brand fw-bold fs-4" to="/">
            <img
              src="/assets/logo1.png"
              alt="Zairi Logo"
              width="110"
              height="40"
            />
          </NavLink>

          {/* Center NavLinks (Desktop) */}
          <ul className="navbar-nav d-none d-lg-flex mx-auto gap-4">
            {["/", "/product", "/about", "/contact"].map((path, i) => (
              <li key={i} className="nav-item">
                <NavLink
                  to={path}
                  className="nav-link fw-bold text-dark"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "500",
                    borderBottom: isActive ? "2px solid #007bff" : "none",
                  })}
                >
                  {path === "/"
                    ? "Home"
                    : path
                        .replace("/", "")
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Side - Auth/Cart/Profile */}
          <div className="d-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className="btn btn-dark btn-sm d-lg-none">
                  <i className="fa-solid fa-key"></i>
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-outline-dark btn-sm d-lg-none"
                >
                  <i className="fa-solid fa-user-plus"></i>
                </NavLink>

                <NavLink
                  to="/login"
                  className="btn btn-dark btn-sm d-none d-lg-inline"
                >
                  <i className="fa-solid fa-key"></i> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-outline-dark btn-sm d-none d-lg-inline"
                >
                  <i className="fa-solid fa-user-plus"></i> Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/cart"
                  className="btn btn-outline-dark btn-sm d-lg-none position-relative"
                >
                  <i className="fa fa-shopping-cart"></i>
                  {state.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {state.length}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/cart"
                  className="btn btn-outline-dark btn-sm d-none d-lg-inline"
                >
                  <i className="fa fa-shopping-cart"></i> Cart ({state.length})
                </NavLink>

                <div className="dropdown">
                  <button
                    className="btn btn-outline-dark btn-sm dropdown-toggle"
                    type="button"
                    onClick={toggleDropdown}
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
                    {/* <li><NavLink className="dropdown-item" to="/profile/wishlist">Wishlist</NavLink></li> */}
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
              </>
            )}

            {/* Hamburger */}
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

        {/* Mobile Nav Links */}
        {isMobileMenuOpen && (
          <div className="bg-light p-3 text-center d-lg-none">
            <ul className="navbar-nav">
              {["/", "/product", "/about", "/contact"].map((path, i) => (
                <li key={i} className="nav-item py-1">
                  <NavLink
                    to={path}
                    className="nav-link fw-bold"
                    onClick={toggleMobileMenu}
                  >
                    {path === "/"
                      ? "Home"
                      : path
                          .replace("/", "")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔔 Razorpay Notice (Global Banner) */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            borderBottom: "1px solid #ffeeba",
          }}
        ></div>
      </nav>

      {/* Scrolling Banner */}
      <div
        style={{
          background: "#222",
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: "14px",
          height: "32px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            paddingLeft: "100%",
            animation: "scroll-text 20s linear infinite",
          }}
        >
          🛍️ FREE DELIVERY ON ALL ORDERS – LIMITED TIME ONLY 🚚
          {/* &nbsp;&nbsp;&nbsp;&nbsp; 🎁 Exclusive Offers Every Week – Stay Tuned */}
          💥 &nbsp;&nbsp;&nbsp;&nbsp; 
          {/* 📸 ₹80 OFF on every product –
          #SelfieWithPoster Challenge is LIVE! Check Insta Now! 🔥 */}
          📣 Good Friday Sale is LIVE! 🕊️  
          Use code <strong>GDFRI</strong> to get 10% OFF on your bill! 🔥
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <style>
          {`
      @keyframes scroll-text {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }
    `}
        </style>
      </div>

      {/* 🔒 Razorpay Alert Banner - Safe for Web & Mobile */}
      {/* <div
  style={{
    width: "100vw",
    overflowX: "hidden",
    backgroundColor: "#fff3cd",
    borderBottom: "1px solid #ffeeba",
    padding: "10px 16px",
    boxSizing: "border-box",
    textAlign: "center",
    fontSize: "14px",
    fontFamily: "Poppins, sans-serif",
    color: "#664d03",
    zIndex: 9999,
  }}
>
  <div
    style={{
      maxWidth: "1140px",
      margin: "0 auto",
      padding: "0 10px",
    }}
  >
    <strong>🔒 Payments Update:</strong> Razorpay UPI is under review. Live soon! Till then, contact us on{" "}
    <a
      href="https://wa.me/91XXXXXXXXXX" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "underline",
        fontWeight: "bold",
        color: "#000",
      }}
    >
      WhatsApp 📱
    </a>
  </div>
</div> */}

      <div
        style={{
          width: "100vw",
          overflowX: "hidden",
          backgroundColor: "#fff3cd",
          borderBottom: "1px solid #ffeeba",
          padding: "10px 16px 4px",
          boxSizing: "border-box",
          textAlign: "center",
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          color: "#664d03",
          zIndex: 9999,
        }}
      >
        <div
          style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 10px" }}
        >
          <strong>Need Help?</strong> If you face any difficulty while buying
          from the website, feel free to ping us on{" "}
          <a
            href="https://wa.me/8447145941"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: "bold",
              color: "#000",
              textDecoration: "underline",
            }}
          >
            WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="https://www.instagram.com/zairi.in?igsh=MTJ0MXU4M3hvNzMzNQ%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: "bold",
              color: "#000",
              textDecoration: "underline",
            }}
          >
            Instagram
          </a>
        </div>
      </div>
      {/* <div
        style={{
          backgroundColor: "#e0f7fa",
          color: "#004d40",
          textAlign: "center",
          fontSize: "15px",
          padding: "8px 16px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        📸 <strong>#SelfieWithPoster</strong> Challenge is LIVE! Take a selfie
        with our poster & get ₹80 OFF.
        <a
          href="https://www.instagram.com/yourbrandusername" // change to your actual Insta handle
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "6px",
            fontWeight: "bold",
            color: "#00796b",
            textDecoration: "underline",
          }}
        >
          Check Instagram →
        </a>
      </div> */}
    </>
  );
};

export default Navbar;
