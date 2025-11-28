import { Navbar, Main, Product, Footer } from "../components";
import TrendingProducts from "../components/TrendingProducts";
import SEO from "../components/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Zairi - Premium Jewelry & Antiques Collection | zairi.in"
        description="Zairi - Shop premium jewelry, antiques, and unique collectibles at zairi.in. Discover exquisite vintage jewelry, handpicked premium pieces, and authentic antique treasures. Free shipping above ₹1000. COD available."
        keywords="zairi, zairi.in, jewelry, antiques, vintage jewelry, antique jewelry, collectibles, premium jewelry, handmade jewelry, unique jewelry, jewelry store, antique store, vintage collectibles, jewelry online, buy jewelry, jewelry shop, antique shop, zairi jewelry, zairi antiques"
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
      
      {/* SEO Hero Section - Visible Text for Google */}
      <div className="seo-hero-section">
        <div className="container py-4">
          <h1 className="seo-hero-title">Welcome to Zairi - Premium Jewelry & Antiques</h1>
          <p className="seo-hero-text">
            <strong>Zairi</strong> is your destination for exquisite jewelry, antiques, and unique collectibles. 
            Shop authentic vintage jewelry and premium pieces at <strong>zairi.in</strong>. 
            Discover handpicked jewelry collections, antique treasures, and vintage accessories. 
            <strong>Zairi</strong> offers free shipping above ₹1000 and COD available.
          </p>
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

        /* SEO Hero Section */
        .seo-hero-section {
          background: #f8f9fa;
          text-align: center;
          margin-bottom: 20px;
        }

        .seo-hero-title {
          font-size: 28px;
          font-weight: 700;
          color: #000;
          margin-bottom: 15px;
        }

        .seo-hero-text {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
        }

        .seo-hero-text strong {
          color: #000;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .seo-hero-title {
            font-size: 24px;
          }
          .seo-hero-text {
            font-size: 14px;
            padding: 0 15px;
          }
        }
      `}</style>
    </>
  )
}

export default Home