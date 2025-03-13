import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  /**
   * Add Product to Cart with Token Authentication
   */
  const addProductToCart = async (product) => {
    const token = localStorage.getItem("apitoken");

    if (!token) {
      toast.error("You need to log in to add items to the cart!");
      navigate("/login");
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
            image: selectedImage || product.image,
          },
        ],
      };

      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      toast.success("Product added to cart successfully!");
      dispatch(addCart(product));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  /**
   * Fetch Product and Images
   */
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/product/${id}`);
        const result = await response.json();

        if (result.status === 200 && result.rows.length > 0) {
          const productData = result.rows[0];

          // Extract images or use placeholder
          const productImages = productData.images?.length > 0 ? productData.images : [
            "https://via.placeholder.com/400",
          ];

          setProduct({
            id: productData.item_id,
            title: productData.name || "No Title",
            price: productData.price || 0,
            description: productData.description || "No description available",
            category: productData.category || "Uncategorized",
            rating: {
              rate: parseFloat(productData.avg_rating) || 0,
              count: productData.ratings_length || 0,
            },
          });

          setImages(productImages);
          setSelectedImage(productImages[0]); // Set first image as default
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  /**
   * Change Main Image on Thumbnail Click
   */
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  /**
   * Show Product with Multi-Image Gallery
   */
  const ShowProduct = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row">
          {/* Left Side Thumbnail List (VERTICAL ON DESKTOP, HORIZONTAL ON MOBILE) */}
          <div className="col-md-1 d-none d-md-flex flex-column align-items-center">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`img-thumbnail mb-2 ${selectedImage === img ? "border-primary" : ""}`}
                style={{ cursor: "pointer", width: "60px", height: "60px", objectFit: "cover" }}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>

          {/* Main Image Display */}
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={selectedImage}
              alt={product.title}
              width="100%"
              height="auto"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>

          {/* Thumbnails - HORIZONTAL ON MOBILE */}
          <div className="d-md-none mt-3">
            <div
              className="d-flex justify-content-start overflow-auto"
              style={{ gap: "10px", paddingBottom: "10px" }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail ${selectedImage === img ? "border-primary" : ""}`}
                  style={{ cursor: "pointer", width: "60px", height: "60px", objectFit: "cover" }}
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-5 col-sm-12 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-5">{product.title}</h1>
            <p className="lead">
              {product.rating?.rate} <i className="fa fa-star"></i>
            </p>

            {/* Pricing with Discount */}
            <h3 className="display-6 my-4">
              <del style={{ color: "red", marginRight: "5px" }}>Rs.{product.price}</del>
              <span style={{ fontWeight: "bold", color: "#000" }}>
                Rs.{(product.price * 0.9).toFixed(2)}
              </span>
              <span style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}>
                (10% OFF)
              </span>
            </h3>

            <p className="lead">{product.description}</p>

            {/* Buttons - Styled Like Your Previous Design */}
            <div className="d-flex mt-4">
              <button
                className="btn btn-warning btn-lg flex-grow-1 d-flex align-items-center justify-content-center"
                onClick={() => addProductToCart(product)}
                style={{
                  backgroundColor: "#FFA500",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  marginRight: "10px",
                }}
              >
                🛒 ADD TO CART
              </button>
              <Link
                to="/cart"
                className="btn btn-danger btn-lg flex-grow-1 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#FF4500",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                }}
              >
                ⚡ BUY NOW
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
      <div className="container">
        <div className="row">{loading ? <Skeleton height={400} /> : <ShowProduct />}</div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
