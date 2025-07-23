import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, clearCart } from "../redux/action";
import { Link } from "react-router-dom";
import { syncCart } from "../redux/action";
import toast from "react-hot-toast";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
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
        dispatch(syncCart(data.cartItems));
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
      toast.success("Item added to cart!");
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
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  const EmptyCart = () => {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="empty-cart-container">
              <div className="empty-cart-icon mb-4">
                <i className="fa fa-shopping-cart fa-4x text-muted"></i>
              </div>
              <h3 className="mb-3">Your Cart is Empty</h3>
              <p className="text-muted mb-4">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to discover amazing products!
              </p>
              <Link to="/product" className="btn btn-primary btn-lg">
                <i className="fa fa-shopping-bag me-2"></i>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.qty || 1);

    const updateQuantity = async (newQty) => {
      if (newQty < 1) return;
      
      setQuantity(newQty);
      const updatedProduct = { ...item, qty: newQty };
      
      if (newQty > (item.qty || 1)) {
        await addItem(updatedProduct);
      } else if (newQty < (item.qty || 1)) {
        await removeItem(updatedProduct);
      }
    };

    return (
      <div className="card mb-3 shadow-sm">
        <div className="row g-0">
          <div className="col-md-3 col-4">
            <div className="cart-item-image">
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid rounded-start h-100 w-100"
                style={{ objectFit: "cover", minHeight: "150px" }}
              />
            </div>
          </div>
          <div className="col-md-9 col-8">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h6 className="card-title mb-2">{item.title}</h6>
                  <p className="text-muted small mb-2">
                    Category: {item.category || item.categoryName || "General"}
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="quantity-controls">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={isUpdating}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                      <span className="mx-3 fw-bold">{quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(quantity + 1)}
                        disabled={isUpdating}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <h6 className="text-primary mb-0">₹{item.price}</h6>
                  <small className="text-muted">per item</small>
                </div>
                <div className="col-md-2 text-center">
                  <h6 className="text-success mb-0">₹{item.price * quantity}</h6>
                  <small className="text-muted">total</small>
                </div>
                <div className="col-md-1 text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeItem(item)}
                    disabled={isUpdating}
                    title="Remove item"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
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
    const remainingForFreeShipping = Math.max(0, 1000 - subtotal);

    return (
      <div className="container py-4">
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fa fa-shopping-cart me-2"></i>
                  Shopping Cart ({totalItems} items)
                </h5>
              </div>
              <div className="card-body">
                {state.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "100px" }}>
              <div className="card-header bg-light">
                <h6 className="mb-0">Order Summary</h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="fw-bold">₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? "text-success fw-bold" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold text-primary fs-5">₹{total}</span>
                </div>

                {/* Promo Code */}
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Promo code"
                    />
                    <button className="btn btn-outline-primary" type="button">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <Link
                    to="/checkout"
                    className="btn btn-primary btn-lg"
                    disabled={state.length === 0}
                  >
                    <i className="fa fa-credit-card me-2"></i>
                    Proceed to Checkout
                  </Link>
                  <Link to="/product" className="btn btn-outline-primary">
                    <i className="fa fa-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear your cart?")) {
                        dispatch(clearCart());
                        toast.success("Cart cleared!");
                      }
                    }}
                    disabled={state.length === 0}
                  >
                    <i className="fa fa-trash me-2"></i>
                    Clear Cart
                  </button>
                </div>

                {/* Shipping Info */}
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <i className="fa fa-truck text-primary me-2"></i>
                    Shipping Information
                  </h6>
                  <small className="text-muted">
                    {shipping === 0 
                      ? "🎉 Free shipping on orders above ₹1000" 
                      : `Add ₹${remainingForFreeShipping} more for free shipping`
                    }
                  </small>
                </div>
              </div>
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
        .empty-cart-container {
          padding: 3rem 0;
        }

        .empty-cart-icon {
          opacity: 0.5;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-item-image {
          position: relative;
          overflow: hidden;
        }

        .cart-item-image img {
          transition: transform 0.3s ease;
        }

        .cart-item-image:hover img {
          transform: scale(1.05);
        }

        .sticky-top {
          z-index: 1020;
        }

        @media (max-width: 768px) {
          .sticky-top {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;
