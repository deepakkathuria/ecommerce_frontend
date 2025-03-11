import React from "react";

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
              {["Home", "Products", "About Us", "Contact"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-light text-decoration-none">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 mb-4 text-center text-md-end">
            <h5 className="fw-bold">Follow Us</h5>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-youtube"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light mx-2 fs-4">
              <i className="fa fa-twitter"></i>
            </a>
          </div>
        </div>

        <hr className="bg-light" />

        {/* Copyright Section */}
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
