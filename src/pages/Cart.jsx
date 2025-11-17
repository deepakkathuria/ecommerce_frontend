import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, clearCart } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import { syncCart } from "../redux/action";
import toast from "react-hot-toast";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token) return;

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        dispatch(syncCart(data.cartItems || []));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, [dispatch]);

  const addItem = async (product) => {
    setIsUpdating(true);
    try {
      await dispatch(addCart(product));
      // ✅ Cart is already synced in addCart action, but refresh to get latest from backend
      const token = localStorage.getItem("apitoken");
      if (token) {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(syncCart(data.cartItems || []));
      }
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (product) => {
    setIsUpdating(true);
    try {
      await dispatch(delCart(product));
      
      // ✅ Cart is already synced in delCart action, but refresh to get latest from backend
      const token = localStorage.getItem("apitoken");
      if (token) {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(syncCart(data.cartItems || []));
      }
      
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  const moveToWishlist = async (item) => {
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      // Add to wishlist
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item.id }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove from cart
        await removeItem(item);
        toast.success("Moved to wishlist!");
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        throw new Error(data.error || data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error moving to wishlist:", error);
      toast.error(error.message || "Failed to move to wishlist");
    }
  };

  const EmptyCart = () => {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content">
          <i className="fa fa-shopping-bag cart-empty-icon"></i>
          <h3>Your Bag is Empty</h3>
          <p>Looks like you haven't added any items to your bag yet.</p>
          <Link to="/product" className="cart-empty-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  };

  const CartItem = ({ item }) => {
    const quantity = item.qty || 1;
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [stockQuantity, setStockQuantity] = useState(item.stock_quantity || 1);

    // Fetch stock_quantity from product API
    useEffect(() => {
      const fetchStock = async () => {
        try {
          const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/product/${item.id}`);
          const result = await response.json();
          if (result.status === 200 && result.rows.length > 0) {
            setStockQuantity(result.rows[0].stock_quantity || 1);
          }
        } catch (error) {
          console.error("Error fetching stock:", error);
        }
      };
      fetchStock();
    }, [item.id]);

    const handleIncreaseQuantity = async () => {
      // Check if current quantity >= stock_quantity
      if (quantity >= stockQuantity) {
        setShowOutOfStock(true);
        toast.error("OUT OF STOCK");
        return;
      }
      await addItem(item);
      setShowOutOfStock(false);
    };

    const handleDecreaseQuantity = async () => {
      if (quantity > 1) {
        await removeItem(item);
        setShowOutOfStock(false);
      }
    };

    return (
      <div className="cart-item-card">
        <div className="cart-item-header">
          <span className="cart-item-count">
            {state.length}/{state.length} ITEMS SELECTED
          </span>
          <div className="cart-item-actions">
            <button
              className="cart-action-btn"
              onClick={() => removeItem(item)}
              disabled={isUpdating}
            >
              REMOVE
            </button>
            <button
              className="cart-action-btn"
              onClick={() => moveToWishlist(item)}
              disabled={isUpdating}
            >
              MOVE TO WISHLIST
            </button>
          </div>
        </div>
        
        <div className="cart-item-content">
          <div className="cart-item-image-wrapper">
            <Link to={`/product/${item.id}`}>
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.title}
                className="cart-item-image"
              />
            </Link>
            {showOutOfStock && (
              <div className="cart-item-out-of-stock-overlay">
                <span>OUT OF STOCK</span>
              </div>
            )}
          </div>
          
          <div className="cart-item-details">
            <Link to={`/product/${item.id}`} className="cart-item-brand">
              {item.category || item.categoryName || "ZAIRI"}
            </Link>
            <Link to={`/product/${item.id}`} className="cart-item-title">
              {item.title}
            </Link>
            
            <div className="cart-item-controls">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <button
                  className="quantity-minus-btn"
                  onClick={handleDecreaseQuantity}
                  disabled={isUpdating || quantity <= 1}
                  title="Decrease quantity"
                >
                  <i className="fa fa-minus"></i>
                </button>
                <span className="quantity-fixed">{quantity}</span>
                <button
                  className="quantity-plus-btn"
                  onClick={handleIncreaseQuantity}
                  disabled={isUpdating}
                  title="Increase quantity"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="cart-item-price">
              <span className="current-price">₹{Number(item.price * quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
    const subtotal = state.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    const shipping = subtotal >= 1000 ? 0 : 49;
    const total = subtotal + shipping;
    const totalItems = state.reduce((acc, item) => acc + (item.qty || 1), 0);

    return (
      <div className="cart-container">
        <div className="cart-row">
          {/* Left Side - Cart Items */}
          <div className="cart-items-section">
            {state.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Right Side - Price Details */}
          <div className="cart-summary-section">
            <div className="price-details-card">
              <div className="price-details-header">
                PRICE DETAILS ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
              </div>
              
              <div className="price-details-content">
                <div className="price-row">
                  <span>Total MRP</span>
                  <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                </div>
                
                {shipping > 0 && (
                  <div className="price-row">
                    <span>Delivery Charges</span>
                    <span>₹{shipping}</span>
                  </div>
                )}
                
                {shipping === 0 && (
                  <div className="price-row shipping-free">
                    <span>Delivery Charges</span>
                    <span className="free-text">FREE</span>
                  </div>
                )}
                
                <hr className="price-divider" />
                
                <div className="price-row total-row">
                  <span>Total Amount</span>
                  <span>₹{Number(total).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="place-order-btn"
                disabled={state.length === 0}
              >
                PLACE ORDER
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {state.length === 0 ? <EmptyCart /> : <ShowCart />}
      <Footer />

      <style>{`
        .cart-empty-container {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: #fafafa;
        }

        .cart-empty-content {
          text-align: center;
          max-width: 400px;
        }

        .cart-empty-icon {
          font-size: 80px;
          color: #d4d5d9;
          margin-bottom: 20px;
        }

        .cart-empty-content h3 {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin-bottom: 12px;
        }

        .cart-empty-content p {
          font-size: 14px;
          color: #696e79;
          margin-bottom: 24px;
        }

        .cart-empty-btn {
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 12px 32px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: background 0.2s ease;
        }

        .cart-empty-btn:hover {
          background: #333;
          color: #fff;
          text-decoration: none;
        }

        /* Cart Container */
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
          min-height: 60vh;
        }

        .cart-row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        /* Left Side - Items */
        .cart-items-section {
          flex: 1;
          min-width: 0;
        }

        .cart-item-card {
          background: #fff;
          border: 1px solid #eaeaec;
          margin-bottom: 12px;
          padding: 16px;
        }

        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eaeaec;
        }

        .cart-item-count {
          font-size: 12px;
          font-weight: 600;
          color: #282c3f;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cart-item-actions {
          display: flex;
          gap: 16px;
        }

        .cart-action-btn {
          background: none;
          border: none;
          color: #ff3f6c;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }

        .cart-action-btn:hover {
          color: #ff1f4f;
        }

        .cart-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-item-content {
          display: flex;
          gap: 16px;
        }

        .cart-item-image-wrapper {
          position: relative;
          width: 120px;
          height: 160px;
          flex-shrink: 0;
          background: #f5f5f6;
          overflow: hidden;
        }

        .cart-item-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .cart-item-out-of-stock-overlay {
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
          z-index: 10;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-item-brand {
          font-size: 14px;
          font-weight: 600;
          color: #282c3f;
          text-decoration: none;
        }

        .cart-item-brand:hover {
          color: #ff3f6c;
          text-decoration: none;
        }

        .cart-item-title {
          font-size: 14px;
          font-weight: 400;
          color: #282c3f;
          text-decoration: none;
          line-height: 1.4;
        }

        .cart-item-title:hover {
          color: #ff3f6c;
          text-decoration: none;
        }

        .cart-item-controls {
          margin-top: 8px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quantity-selector label {
          font-size: 14px;
          color: #282c3f;
          font-weight: 500;
        }

        .quantity-fixed {
          font-size: 14px;
          color: #282c3f;
          font-weight: 500;
          min-width: 30px;
          text-align: center;
        }

        .quantity-minus-btn,
        .quantity-plus-btn {
          background: #000;
          color: #fff;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 12px;
        }

        .quantity-minus-btn:hover,
        .quantity-plus-btn:hover {
          background: #333;
        }

        .quantity-minus-btn:disabled,
        .quantity-plus-btn:disabled {
          background: #d4d5d9;
          cursor: not-allowed;
        }

        .quantity-dropdown {
          padding: 6px 12px;
          border: 1px solid #d4d5d9;
          border-radius: 4px;
          font-size: 14px;
          background: #fff;
          cursor: pointer;
        }

        .cart-item-price {
          margin-top: auto;
        }

        .current-price {
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }

        /* Right Side - Summary */
        .cart-summary-section {
          width: 350px;
          flex-shrink: 0;
        }

        .price-details-card {
          background: #fff;
          border: 1px solid #eaeaec;
          position: sticky;
          top: 100px;
        }

        .price-details-header {
          padding: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #282c3f;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #eaeaec;
        }

        .price-details-content {
          padding: 16px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #282c3f;
        }

        .price-row:last-of-type {
          margin-bottom: 0;
        }

        .shipping-free .free-text {
          color: #03a685;
          font-weight: 600;
        }

        .price-divider {
          border: none;
          border-top: 1px solid #eaeaec;
          margin: 16px 0;
        }

        .total-row {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin-top: 4px;
        }

        .place-order-btn {
          display: block;
          width: 100%;
          background: #ff3f6c;
          color: #fff;
          text-align: center;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          transition: background 0.2s ease;
          border: none;
          margin-top: 16px;
        }

        .place-order-btn:hover {
          background: #ff1f4f;
          color: #fff;
          text-decoration: none;
        }

        .place-order-btn:disabled {
          background: #d4d5d9;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .cart-row {
            flex-direction: column;
          }

          .cart-summary-section {
            width: 100%;
          }

          .price-details-card {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 576px) {
          .cart-container {
            padding: 15px;
          }

          .cart-item-card {
            padding: 12px;
          }

          .cart-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .cart-item-actions {
            width: 100%;
            justify-content: space-between;
          }

          .cart-item-content {
            flex-direction: column;
          }

          .cart-item-image-wrapper {
            width: 100%;
            height: 200px;
            margin: 0 auto;
          }

          .cart-item-count {
            font-size: 11px;
          }

          .cart-action-btn {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;
