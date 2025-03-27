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
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/products");
        const result = await response.json();

        const filtered = result.rows
          .filter((item) => item.is_trendy === 1 || item.is_trendy === true)
          .map((item) => ({
            id: item.item_id,
            title: item.name,
            price: item.price,
            images: Array.isArray(item.images)
              ? item.images
              : JSON.parse(item.images || "[]"),
          }));

        setTrending(filtered.slice(0, 8)); // Only top 8
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending:", err);
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
      <h2 className="text-center fw-bold mb-4">🔥 Trending Now</h2>
      <div className="row">
        {trending.map((product) => (
          <div className="col-md-3 col-sm-6 mb-4" key={product.id}>
            <Link to={`/product/${product.id}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    product.images?.[0] || "https://via.placeholder.com/200x200"
                  }
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: "230px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h6 className="card-title text-dark">{product.title}</h6>
                  <p className="fw-bold text-success mb-0">Rs. {product.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
