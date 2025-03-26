import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-md-4 mb-4 text-center text-md-start">
            <h5 className="fw-bold">Zairi</h5>
            <p className="small">Your one-stop shop for the best products.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 text-center">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <NavLink to="/" className="text-light text-decoration-none">Home</NavLink>
              </li>
              <li>
                <NavLink to="/product" className="text-light text-decoration-none">Products</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-light text-decoration-none">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-light text-decoration-none">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-light text-decoration-none">Privacy Policy</NavLink>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 mb-4 text-center text-md-end">
            <h5 className="fw-bold">Follow Us</h5>
            <a
              href="https://www.instagram.com/zairi.in?igsh=MTJ0MXU4M3hvNzMzNQ%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="text-light mx-2 fs-4"
            >
              <i className="fa fa-instagram"></i>
            </a>
            {/* <a href="#" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-youtube"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-twitter"></i>
            </a> */}
          </div>
        </div>

        <hr className="bg-light" />

        {/* Copyright */}
        <div className="text-center">
          <p className="small mb-0">
            © {new Date().getFullYear()} Zairi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
