import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/action";
import { Navbar, Footer } from "../components";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outOfStockMap, setOutOfStockMap] = useState({});
  const cartState = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("apitoken");
    if (!token) {
      setWishlist([]);
      setLoading(false);
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      console.log("Wishlist Fetch Response:", { status: response.status, data });
      
      if (response.ok && data.items && Array.isArray(data.items)) {
        console.log("Wishlist items:", data.items);
        setWishlist(data.items);
      } else if (response.ok && Array.isArray(data)) {
        console.log("Wishlist items (direct array):", data);
        setWishlist(data);
      } else {
        console.error("Wishlist fetch error - Status:", response.status, "Data:", data);
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ✅ Update outOfStockMap when cart or wishlist changes
  useEffect(() => {
    if (wishlist.length > 0) {
      const outOfStockItems = {};
      wishlist.forEach((item) => {
        const productId = item.product_id || item.id;
        const cartItem = cartState.find((cartItem) => cartItem.id === productId);
        const stockQuantity = item.stock_quantity || 1;
        const currentCartQty = cartItem ? (cartItem.qty || 1) : 0;
        
        if (currentCartQty >= stockQuantity) {
          outOfStockItems[productId] = true;
        }
      });
      setOutOfStockMap(outOfStockItems);
    }
  }, [cartState, wishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    try {
      const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Removed from wishlist");
        // Refresh wishlist
        fetchWishlist();
        // Notify Navbar to update wishlist count
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        console.error("Remove from wishlist error:", data);
        toast.error(data.error || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const productId = item.product_id || item.id;

    // 🚫 Check stock_quantity: if cart quantity >= stock_quantity, show OUT OF STOCK
    const existingCartItem = cartState.find((cartItem) => cartItem.id === productId);
    const stockQuantity = item.stock_quantity || 1;
    const currentCartQty = existingCartItem ? (existingCartItem.qty || 1) : 0;
    
    if (currentCartQty >= stockQuantity) {
      setOutOfStockMap((prev) => ({ ...prev, [productId]: true }));
      toast.error("OUT OF STOCK");
      return;
    }

    try {
      const cartItemPayload = {
        items: [{
          id: productId,
          quantity: 1,
          name: item.name,
          price: item.price,
          image: item.image || '',
        }],
      };

      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify(cartItemPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to cart");
      }

      const productWithCategory = {
        id: productId,
        title: item.name,
        price: item.price,
        images: item.image ? [item.image] : [],
        category: "General",
      };

      dispatch(addCart(productWithCategory));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      toast.error(error.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <h4 className="mb-4">My Wishlist</h4>
          <div className="row">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3 mb-4">
                <Skeleton height={400} />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h4 className="mb-4">My Wishlist</h4>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa fa-heart-o fa-4x text-muted mb-3"></i>
            <h5>Your wishlist is empty</h5>
            <p className="text-muted mb-4">Start adding items you love!</p>
            <Link to="/product" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row">
            {wishlist.map((item) => {
              const productId = item.product_id || item.id;
              const isOutOfStock = !!outOfStockMap[productId];
              return (
              <div key={productId} className="col-6 col-md-4 col-lg-3 mb-4">
                <div className="product-card-zara position-relative">
                  <div className="product-image-container">
                    <Link to={`/product/${productId}`}>
                      <img
                        src={item.image || "https://via.placeholder.com/300"}
                        alt={item.name}
                        className="product-image"
                      />
                    </Link>
                    {isOutOfStock && (
                      <div className="product-card-out-of-stock-overlay">
                        <span>OUT OF STOCK</span>
                      </div>
                    )}
                    <button
                      className="wishlist-button active"
                      onClick={() => handleRemoveFromWishlist(productId)}
                      title="Remove from wishlist"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                    <button
                      className="quick-add-button"
                      onClick={() => handleAddToCart(item)}
                      title={isOutOfStock ? "Out of stock" : "Add to Bag"}
                      disabled={isOutOfStock}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                  <div className="product-info">
                    <Link to={`/product/${productId}`} className="product-title">
                      {item.name}
                    </Link>
                    <div className="product-price">₹ {Number(item.price || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
      <Footer />
      
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

        .product-card-out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          pointer-events: none;
          z-index: 5;
        }

        .product-card-zara:hover .product-image {
          transform: scale(1.05);
        }

        .wishlist-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .wishlist-button:hover {
          background: #fff;
          transform: scale(1.1);
        }

        .wishlist-button i {
          font-size: 16px;
          color: #ff3f6c;
        }

        .wishlist-button.active {
          background: rgba(255, 63, 108, 0.1);
        }

        .quick-add-button {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          touch-action: manipulation;
          opacity: 1;
        }

        .quick-add-button:hover {
          background: #000;
          transform: scale(1.1);
        }

        .quick-add-button i {
          font-size: 14px;
          color: #000;
          transition: color 0.3s ease;
        }

        .quick-add-button:hover i {
          color: #fff;
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

          .wishlist-button {
            width: 40px;
            height: 40px;
            top: 8px;
            right: 8px;
          }

          .quick-add-button {
            width: 36px;
            height: 36px;
            bottom: 8px;
            left: 8px;
          }

          .product-title {
            font-size: 11px;
          }

          .product-price {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default Wishlist;
