import React, { Suspense } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="hero-section">
      {/* Hero Background with Gradient */}
      <div className="hero-background">
        <div className="gradient-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-8 col-md-10 mx-auto text-center">
            <div className="hero-content">
              {/* Logo */}
              <div className="logo-container mb-4">
                <h1 className="brand-logo">
                  <span className="logo-text">ZAIRI</span>
                  <span className="logo-dot">.</span>
                </h1>
                <p className="logo-tagline">Your Style, Your Story</p>
              </div>

              {/* Main Headline */}
              <h2 className="hero-title mb-4">
                Discover Your Perfect{" "}
                <span className="highlight">Style</span>
              </h2>
              
              {/* Description */}
              <p className="hero-description mb-5">
                Explore our curated collection of premium accessories and lifestyle products. 
                From trendy fashion items to essential gadgets, find everything you need to 
                elevate your everyday experience.
              </p>

              {/* Call to Action Buttons */}
              <div className="hero-buttons">
                <Link to="/product" className="btn btn-warning btn-lg me-3 mb-2">
                  <i className="fa fa-shopping-bag me-2"></i>
                  Shop Now
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg mb-2">
                  <i className="fa fa-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>

              {/* Scroll Indicator */}
              <div className="scroll-indicator mt-5">
                <div className="scroll-text">Scroll to explore</div>
                <div className="scroll-arrow">
                  <i className="fa fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918447145941"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success position-fixed whatsapp-btn"
      >
        <i className="fa fa-whatsapp fa-lg"></i>
      </a>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 20%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 60%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        /* Logo Styling */
        .logo-container {
          margin-bottom: 2rem;
        }

        .brand-logo {
          font-size: 4rem;
          font-weight: 900;
          color: white;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .logo-text {
          background: linear-gradient(45deg, #ffffff, #ffc107);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          color: #ffc107;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .logo-tagline {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .highlight {
          color: #ffc107;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-description {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 2rem auto;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .hero-buttons .btn {
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .hero-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        /* Scroll Indicator */
        .scroll-indicator {
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .scroll-indicator:hover {
          opacity: 1;
        }

        .scroll-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }

        .scroll-arrow {
          color: white;
          font-size: 1.5rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .whatsapp-btn {
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .whatsapp-btn:hover {
          transform: scale(1.1);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .brand-logo {
            font-size: 3rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
            padding: 0 1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .hero-buttons .btn {
            width: 100%;
            max-width: 280px;
          }

          .shape {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .brand-logo {
            font-size: 2.5rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .logo-tagline {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Main;





