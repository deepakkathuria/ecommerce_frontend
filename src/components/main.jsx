import React, { Suspense } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      {/* Main Promotional Banner - Image Banner */}
      <div className="promo-banner-main">
        <div className="container-fluid px-0">
          <Link to="/product" className="banner-image-link">
            <img 
              src="/a.png" 
              alt="Zairi - Jewellery For Every Story" 
              className="banner-image"
            />
          </Link>
        </div>
      </div>

      <style>{`
        /* Main Promotional Banner - Image Banner */
        .promo-banner-main {
          margin-bottom: 40px;
          width: 100%;
          overflow: hidden;
        }

        .banner-image-link {
          display: block;
          width: 100%;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .banner-image-link:hover {
          opacity: 0.95;
        }

        .banner-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .banner-image {
            width: 100%;
            height: auto;
          }
        }

        @media (max-width: 576px) {
          .promo-banner-main {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default Main;
