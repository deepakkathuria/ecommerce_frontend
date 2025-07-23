import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Company Info - Zairi (Left Aligned) */}
          <div className="col-lg-4 col-md-6">
            <div className="text-start">
              <h4 className="fw-bold mb-3 text-white">Zairi</h4>
              <p className="text-light mb-3">
                Your one-stop shop for the best products.
              </p>
            </div>
          </div>

          {/* Quick Links (Center Aligned) */}
          <div className="col-lg-4 col-md-6">
            <div className="text-center">
              <h6 className="fw-bold mb-3 text-white">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <NavLink to="/" className="text-light text-decoration-none">
                    Home
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/product" className="text-light text-decoration-none">
                    Products
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/about" className="text-light text-decoration-none">
                    About Us
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/contact" className="text-light text-decoration-none">
                    Contact
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/privacy-policy" className="text-light text-decoration-none">
                    Privacy Policy
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/return-policy" className="text-light text-decoration-none">
                    Return Policy
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Follow Us (Right Aligned) */}
          <div className="col-lg-4 col-md-6">
            <div className="text-end">
              <h6 className="fw-bold mb-3 text-white">Follow Us</h6>
              <div className="d-flex justify-content-end">
                <a 
                  href="#" 
                  className="text-white text-decoration-none instagram-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fa fa-instagram fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-top border-secondary">
        <div className="container py-3">
          <div className="text-center">
            <p className="text-light mb-0">
              © {currentYear} Zairi. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918447145941"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <i className="fa fa-whatsapp fa-lg"></i>
      </a>

      <style>{`
        footer {
          background-color: #343a40 !important;
        }
        
        footer a:hover {
          color: #fff !important;
          text-decoration: none;
        }

        footer .text-light:hover {
          color: #fff !important;
        }

        .instagram-icon:hover {
          background-color: white !important;
          color: #343a40 !important;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .text-end {
            text-align: center !important;
          }
          
          .text-start {
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
