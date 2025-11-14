import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hm-footer">
      <div className="container py-5">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h4 className="footer-logo">ZAIRI</h4>
            <p className="footer-text">
              Contemporary jewellery and accessories curated for every story.
            </p>
            <div className="newsletter-box">
              <input
                type="email"
                placeholder="Join our newsletter"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="footer-heading">Shop</p>
            <ul className="footer-links">
              <li><NavLink to="/product?category=jewellery">Jewellery</NavLink></li>
              <li><NavLink to="/product?category=combo">Combos</NavLink></li>
              <li><NavLink to="/product?category=accessories">Accessories</NavLink></li>
              <li><NavLink to="/product">New Arrivals</NavLink></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              <li><NavLink to="/about">About Zairi</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              <li><NavLink to="/privacy-policy">Privacy</NavLink></li>
              <li><NavLink to="/return-policy">Returns</NavLink></li>
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <p className="footer-heading">Need Help?</p>
            <ul className="footer-links">
              <li><a href="mailto:enquiryzairi@gmail.com">enquiryzairi@gmail.com</a></li>
              <li><a href="tel:+918447145941">+91 84471 45941</a></li>
              <li>Support hours: 10AM - 7PM IST</li>
              <li>Live chat available every day</li>
            </ul>
            <div className="footer-socials">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fa fa-instagram"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} Zairi. Crafted with love in India.</span>
          <div className="footer-bottom-links">
            <NavLink to="/privacy-policy">Privacy</NavLink>
            <NavLink to="/return-policy">Returns</NavLink>
            <NavLink to="/contact">Support</NavLink>
          </div>
        </div>
      </div>

      {/* Chat Floating Button */}
      <a
        href="https://wa.me/918447145941"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-float-button"
      >
        Chat
      </a>

      <style>{`
        .hm-footer {
          background: #f7f7f7;
          color: #111;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
        }

        .footer-logo {
          font-family: 'Georgia', 'Times New Roman', serif;
          letter-spacing: 4px;
          font-size: 32px;
          margin-bottom: 16px;
        }

        .footer-text {
          font-size: 14px;
          color: #555;
          margin-bottom: 20px;
        }

        .newsletter-box {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .newsletter-input {
          flex: 1;
          min-width: 200px;
          border: 1px solid #d4d5d9;
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 14px;
        }

        .newsletter-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 10px 20px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .footer-heading {
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
        }

        .footer-links a {
          color: #111;
          text-decoration: none;
        }

        .footer-links a:hover {
          color: #000;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .footer-socials a {
          width: 36px;
          height: 36px;
          border: 1px solid #d4d5d9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
        }

        .footer-bottom {
          border-top: 1px solid #e5e5e5;
          margin-top: 40px;
          padding-top: 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 12px;
          font-size: 13px;
          color: #111;
        }

        .footer-bottom-links {
          display: flex;
          gap: 16px;
        }

        .footer-bottom-links a {
          color: #111;
          text-decoration: none;
        }

        .footer-bottom-links a:hover {
          color: #000;
        }

        .chat-float-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background: #000;
          color: #fff;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-float-button:hover {
          background: #333;
          color: #fff;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        @media (max-width: 576px) {
          .chat-float-button {
            bottom: 15px;
            right: 15px;
            padding: 10px 20px;
            font-size: 13px;
          }
        }

      `}</style>
    </footer>
  );
};

export default Footer;
