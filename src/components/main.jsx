import React, { Suspense } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      {/* Main Promotional Banner - Sale Event */}
      <div className="promo-banner-main">
        <div className="container-fluid px-0">
          <div className="sale-banner">
            <div className="sale-banner-left">
              <div className="sale-bag-icon">
                <i className="fa fa-shopping-bag" style={{ fontSize: '120px', color: '#FFD700' }}></i>
                <div className="sale-bag-text">ZAIRI COLLECTIONS</div>
              </div>
            </div>
            <div className="sale-banner-center">
              <div className="sale-title-large">WELCOME TO ZAIRI</div>
              <div className="sale-title-subtitle">JEWELLERY FOR EVERY STORY</div>
              <Link to="/product" className="sale-shop-button">
                EXPLORE
              </Link>
            </div>
            <div className="sale-banner-right">
              <div className="sale-models-placeholder">
                <div className="sale-decoration-circle circle-1"></div>
                <div className="sale-decoration-circle circle-2"></div>
                <div className="sale-decoration-text">NEW ARRIVALS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Main Promotional Banner - Sale */
        .promo-banner-main {
          background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
          padding: 40px 0;
          margin-bottom: 40px;
        }

        .sale-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px 60px;
          position: relative;
          min-height: 400px;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.9) 0%, rgba(255, 165, 0, 0.9) 100%);
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            );
        }

        .sale-banner-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sale-bag-icon {
          text-align: center;
        }

        .sale-bag-text {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          margin-top: 10px;
          letter-spacing: 2px;
        }

        .sale-banner-center {
          flex: 1.5;
          text-align: center;
        }

        .sale-title-large {
          font-size: 72px;
          font-weight: 900;
          color: #000;
          line-height: 1;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .sale-title-subtitle {
          font-size: 36px;
          font-weight: 700;
          color: #000;
          margin-bottom: 30px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .sale-shop-button {
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .sale-shop-button:hover {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
          color: #fff;
        }

        .sale-banner-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .sale-models-placeholder {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sale-decoration-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          animation: float 6s ease-in-out infinite;
        }

        .circle-1 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 10%;
          animation-delay: 2s;
        }

        .sale-decoration-text {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
          z-index: 2;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Mobile Responsive */
        @media (max-width: 991px) {
          .sale-banner {
            flex-direction: column;
            padding: 30px 20px;
            min-height: auto;
          }

          .sale-title-large {
            font-size: 48px;
          }

          .sale-title-subtitle {
            font-size: 24px;
          }

          .sale-bag-icon i {
            font-size: 80px !important;
          }

          .sale-models-placeholder {
            width: 200px;
            height: 200px;
          }
        }

        @media (max-width: 576px) {
          .sale-title-large {
            font-size: 36px;
          }

          .sale-title-subtitle {
            font-size: 20px;
          }

          .sale-shop-button {
            padding: 12px 30px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default Main;
