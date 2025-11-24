import { Navbar, Main, Product, Footer } from "../components";
import TrendingProducts from "../components/TrendingProducts";
import SEO from "../components/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Zairi - Premium Jewelry & Antiques Collection"
        description="Discover exquisite jewelry, antiques, and unique collectibles at Zairi. Handpicked premium pieces for every story. Shop authentic vintage jewelry and antique collectibles online."
        keywords="jewelry, antiques, vintage jewelry, antique jewelry, collectibles, premium jewelry, handmade jewelry, unique jewelry, jewelry store, antique store, vintage collectibles, jewelry online, buy jewelry, jewelry shop, antique shop"
        url="https://zairi.in"
      />
      <Navbar />
      {/* Black Friday Sale Banner */}
      <div className="black-friday-banner">
        <div className="container">
          <div className="banner-content">
            <span className="banner-text">
              🎉 <strong>Black Friday Sale</strong> - Starts 26th Nov - Use Promo Code <strong>BLAFRI20</strong> FOR FLAT 20% OFF | <strong>Free Shipping Above ₹1000</strong> 🎉
            </span>
          </div>
        </div>
      </div>
      <Main />
      <TrendingProducts />

      {/* <Product /> */}
      <Footer />

      <style>{`
        .black-friday-banner {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: #fff;
          padding: 12px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .black-friday-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .banner-content {
          position: relative;
          z-index: 1;
        }

        .banner-text {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.5px;
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
        }

        .banner-text strong {
          color: #ffd700;
          font-weight: 700;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @media (max-width: 768px) {
          .banner-text {
            font-size: 13px;
            padding: 0 10px;
          }
        }

        @media (max-width: 576px) {
          .banner-text {
            font-size: 12px;
            line-height: 1.4;
          }
        }
      `}</style>
    </>
  )
}

export default Home