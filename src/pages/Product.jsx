import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.handleCart);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showOutOfStockOverlay, setShowOutOfStockOverlay] = useState(false);
  const dispatch = useDispatch();

  let touchStartX = 0;
  let touchEndX = 0;

  // Check if product is in wishlist
  const checkWishlist = useCallback(async () => {
    const token = localStorage.getItem("apitoken");
    if (!token) return;

    try {
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.items && Array.isArray(data.items)) {
        const inWishlist = data.items.some(item => 
          item.product_id === product.id || 
          item.id === product.id ||
          Number(item.product_id) === Number(product.id) ||
          Number(item.id) === Number(product.id)
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }, [product.id]);

  useEffect(() => {
    if (product.id) {
      checkWishlist();
    }
  }, [product.id, checkWishlist]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/wishlist/remove/${product.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setIsInWishlist(true);
          toast.success("Added to wishlist!");
          setTimeout(() => {
            checkWishlist();
          }, 500);
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          console.error("Wishlist API Error:", data);
          throw new Error(data.error || data.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.message || "Failed to update wishlist");
    }
  };

  const addProductToCart = async (product) => {
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("You need to log in to add items to the cart!");
      navigate("/login");
      return;
    }

    // 🚫 Check stock_quantity: if cart quantity >= stock_quantity, show OUT OF STOCK
    const existingCartItem = cartState.find((item) => item.id === product.id);
    const stockQuantity = product.stock_quantity || 1;
    const currentCartQty = existingCartItem ? (existingCartItem.qty || 1) : 0;
    
    if (currentCartQty >= stockQuantity) {
      setShowOutOfStockOverlay(true);
      toast.error("OUT OF STOCK");
      return;
    }

    try {
      const cartItem = {
        items: [
          {
            id: product.id,
            quantity: 1,
            name: product.title,
            price: product.price,
            image: selectedImage || images[0] || '',
            category: product.category || "General",
            categoryName: product.category || "General",
          },
        ],
      };

      const response = await fetch(
        "https://hammerhead-app-jkdit.ondigitalocean.app/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add product to cart: ${errorData.error}`);
      }

      toast.success("Product added to cart successfully!");
      dispatch(addCart(product));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://hammerhead-app-jkdit.ondigitalocean.app/product/${id}`
        );
        const result = await response.json();

        if (result.status === 200 && result.rows.length > 0) {
          const productData = result.rows[0];

          let productImages = [];
          try {
            if (typeof productData.images === 'string') {
              productImages = JSON.parse(productData.images);
            } else if (Array.isArray(productData.images)) {
              productImages = productData.images;
            }
          } catch (e) {
            productImages = [];
          }

          if (productImages.length === 0) {
            productImages = ["https://via.placeholder.com/400"];
          }

          setProduct({
            id: productData.item_id,
            title: productData.name || "No Title",
            price: Math.round(productData.price) || 0,
            description: productData.description || "No description available",
            category: productData.category || "Uncategorized",
            subcategory: productData.subcategory || "",
            code: productData.item_id || id,
            stock_quantity: productData.stock_quantity || 1,
          });

          setImages(productImages);
          setSelectedImage(productImages[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const index = images.indexOf(selectedImage);

    if (touchStartX - touchEndX > 50 && index < images.length - 1) {
      setSelectedImage(images[index + 1]);
    } else if (touchEndX - touchStartX > 50 && index > 0) {
      setSelectedImage(images[index - 1]);
    }
  };

  const ShowProduct = () => {
    return (
      <div className="product-detail-container">
        <div className="product-detail-row">
          {/* Left Side - Product Image */}
          <div className="product-image-section">
            <div className="product-main-image-wrapper">
              <img
                className="product-main-image"
                src={selectedImage || images[0]}
                alt={product.title}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                loading="lazy"
              />
              {showOutOfStockOverlay && (
                <div className="product-out-of-stock-overlay">
                  <span>OUT OF STOCK</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`product-thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.title}</h1>
              <button
                className={`product-wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleAddToWishlist}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <i className={`fa ${isInWishlist ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
              </button>
            </div>

            <div className="product-price-section">
              <div className="product-price">₹ {Number(product.price).toLocaleString('en-IN')}</div>
              <div className="product-tax-info">MRP INCL. OF ALL TAXES</div>
            </div>

            <hr className="product-divider" />

            <div className="product-code">
              <span className="product-code-label">Product Code:</span>
              <span className="product-code-value">{product.code || id}</span>
            </div>

            <button
              className="product-add-btn"
              onClick={() => addProductToCart(product)}
              disabled={showOutOfStockOverlay}
            >
              {showOutOfStockOverlay ? "OUT OF STOCK" : "ADD"}
            </button>

            <div className="product-description">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="container my-5">
          <Skeleton height={600} />
        </div>
      ) : (
        <ShowProduct />
      )}
      <Footer />

      <style>{`
        .product-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 15px 20px;
          background: #fafafa;
        }

        .product-detail-row {
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        /* Left Side - Image Section */
        .product-image-section {
          flex: 1;
          max-width: 50%;
        }

        .product-main-image-wrapper {
          width: 100%;
          background: #fff;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          min-height: 500px;
          margin-bottom: 12px;
          padding-top: 0;
          position: relative;
        }

        .product-main-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
          width: auto;
          height: auto;
          margin-top: 0;
        }

        .product-out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
        }

        .product-thumbnails {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0;
          max-width: 100%;
        }

        .product-thumbnail {
          width: 65px;
          height: 65px;
          object-fit: cover;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fff;
          padding: 2px;
          flex-shrink: 0;
        }

        .product-thumbnail:hover {
          border-color: #000;
        }

        .product-thumbnail.active {
          border-color: #000;
        }

        /* Right Side - Info Section */
        .product-info-section {
          flex: 1;
          max-width: 50%;
          padding-top: 0;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .product-title {
          font-size: 24px;
          font-weight: 400;
          color: #000;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
          flex: 1;
          padding-right: 20px;
        }

        .product-wishlist-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
          color: #000;
          padding: 5px;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-wishlist-btn:hover {
          color: #ff3f6c;
        }

        .product-wishlist-btn.active {
          color: #ff3f6c;
        }

        .product-price-section {
          margin-bottom: 20px;
        }

        .product-price {
          font-size: 28px;
          font-weight: 500;
          color: #000;
          margin-bottom: 8px;
        }

        .product-tax-info {
          font-size: 12px;
          color: #696e79;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-divider {
          border: none;
          border-top: 1px solid #eaeaec;
          margin: 20px 0;
        }

        .product-code {
          font-size: 13px;
          color: #282c3f;
          margin-bottom: 30px;
        }

        .product-code-label {
          margin-right: 8px;
        }

        .product-code-value {
          font-weight: 500;
        }

        .product-add-btn {
          width: 100%;
          background: #000;
          color: #fff;
          border: none;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 40px;
        }

        .product-add-btn:hover {
          background: #333;
        }

        .product-description {
          margin-bottom: 30px;
        }

        .product-description p {
          font-size: 14px;
          font-weight: 400;
          color: #282c3f;
          line-height: 1.6;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .product-detail-container {
            padding: 20px 15px;
          }

          .product-detail-row {
            flex-direction: column;
            gap: 30px;
          }

          .product-image-section {
            max-width: 100%;
          }

          .product-info-section {
            max-width: 100%;
          }

          .product-main-image-wrapper {
            min-height: 400px;
            margin-bottom: 15px;
          }

          .product-main-image {
            max-height: 400px;
          }
        }

        @media (max-width: 576px) {
          .product-detail-container {
            padding: 15px 15px;
          }

          .product-title {
            font-size: 18px;
          }

          .product-price {
            font-size: 24px;
          }

          .product-main-image-wrapper {
            min-height: 300px;
            margin-bottom: 10px;
          }

          .product-main-image {
            max-height: 300px;
          }

          .product-thumbnail {
            width: 60px;
            height: 60px;
          }

          .product-thumbnails {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Product;
