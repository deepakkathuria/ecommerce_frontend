import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TrendingProducts = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/products/trending");
        const result = await response.json();

        const filtered = result.rows.map((item) => ({
          id: item.item_id,
          title: item.name,
          price: item.price,
          images: Array.isArray(item.images)
            ? item.images
            : JSON.parse(item.images || "[]"),
        }));

        setTrending(filtered); // Already limited in backend
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="row">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-md-3 col-sm-6 mb-4">
            <Skeleton height={300} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ fontSize: '28px', fontWeight: 600, color: '#000', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Trending Now
      </h2>
      <div className="row">
        {trending.map((product) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="product-card-zara">
              <div className="product-image-container">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/200x200"}
                    alt={product.title}
                    className="product-image"
                  />
                </Link>
              </div>
              <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-title">
                  {product.title}
                </Link>
                <div className="product-price">₹ {Number(product.price).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        /* Reuse ZARA style product cards from Products.jsx */
        .product-card-zara {
          background: #fff;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          padding-bottom: 125%;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card-zara:hover .product-image {
          transform: scale(1.05);
        }

        .product-info {
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-title {
          font-size: 13px;
          font-weight: 400;
          color: #000;
          text-decoration: none;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          transition: color 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-title:hover {
          color: #666;
          text-decoration: none;
        }

        .product-price {
          font-size: 15px;
          font-weight: 500;
          color: #000;
          letter-spacing: 0.3px;
        }

        @media (max-width: 575.98px) {
          .product-image-container {
            padding-bottom: 130%;
          }

          .product-title {
            font-size: 11px;
          }

          .product-price {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default TrendingProducts;
