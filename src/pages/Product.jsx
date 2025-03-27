// import React, { useEffect, useState } from "react";
// import Skeleton from "react-loading-skeleton";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addCart } from "../redux/action";
// import { Footer, Navbar } from "../components";
// import toast from "react-hot-toast";

// const Product = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState({});
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   let touchStartX = 0;
//   let touchEndX = 0;

//   /**
//    * ✅ Add Product to Cart with Token Authentication
//    */
//   const addProductToCart = async (product) => {
//     console.log("🟢 Add to Cart Clicked for:", product);

//     const token = localStorage.getItem("apitoken");
//     console.log("🟠 Retrieved Token:", token);

//     if (!token) {
//       toast.error("You need to log in to add items to the cart!");
//       navigate("/login");
//       return;
//     }

//     try {
//       const cartItem = {
//         items: [
//           {
//             id: product.id,
//             quantity: 1,
//             name: product.title,
//             price: product.price,
//             image: selectedImage || product.image,
//           },
//         ],
//       };

//       console.log("🟢 Sending Request with Data:", cartItem);

//       const response = await fetch(
//         "https://hammerhead-app-jkdit.ondigitalocean.app/cart/add",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(cartItem),
//         }
//       );

//       console.log("🟠 API Response:", response);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Failed to add product to cart: ${errorData.error}`);
//       }

//       toast.success("✅ Product added to cart successfully!");
//       dispatch(addCart(product));
//     } catch (error) {
//       console.error("❌ Error adding product to cart:", error);
//       toast.error("Failed to add product to cart.");
//     }
//   };

//   /**
//    * ✅ Fetch Product and Images
//    */
//   useEffect(() => {
//     const getProduct = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://hammerhead-app-jkdit.ondigitalocean.app/product/${id}`
//         );
//         const result = await response.json();

//         console.log("🔹 API Response Data:", result);

//         if (result.status === 200 && result.rows.length > 0) {
//           const productData = result.rows[0];

//           // Extract images or use placeholder
//           const productImages =
//             productData.images?.length > 0
//               ? productData.images
//               : ["https://via.placeholder.com/400"];

//           setProduct({
//             id: productData.item_id,
//             title: productData.name || "No Title",
//             price: Math.round(productData.price) || 0, // Round price
//             description: productData.description || "No description available",
//             category: productData.category || "Uncategorized",
//             rating: {
//               rate: parseFloat(productData.avg_rating) || 0,
//               count: productData.ratings_length || 0,
//             },
//           });

//           setImages(productImages);
//           setSelectedImage(productImages[0]); // Set first image as default
//         }
//       } catch (error) {
//         console.error("❌ Error fetching product details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProduct();
//   }, [id]);

//   /**
//    * ✅ Change Main Image on Thumbnail Click
//    */
//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   /**
//    * ✅ Handle Swipe Gesture on Mobile
//    */
//   const handleTouchStart = (e) => {
//     touchStartX = e.touches[0].clientX;
//   };

//   const handleTouchEnd = (e) => {
//     touchEndX = e.changedTouches[0].clientX;
//     handleSwipe();
//   };

//   const handleSwipe = () => {
//     const index = images.indexOf(selectedImage);

//     if (touchStartX - touchEndX > 50) {
//       // Swipe Left → Next Image
//       if (index < images.length - 1) {
//         setSelectedImage(images[index + 1]);
//       }
//     } else if (touchEndX - touchStartX > 50) {
//       // Swipe Right → Previous Image
//       if (index > 0) {
//         setSelectedImage(images[index - 1]);
//       }
//     }
//   };

//   const handleBuyNow = async (product) => {
//     const token = localStorage.getItem("apitoken");

//     if (!token) {
//       toast.error("Please login to continue.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const cartItem = {
//         items: [
//           {
//             id: product.id,
//             quantity: 1,
//             name: product.title,
//             price: product.price,
//             image: selectedImage || product.image,
//           },
//         ],
//       };

//       const response = await fetch(
//         "https://hammerhead-app-jkdit.ondigitalocean.app/cart/add",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(cartItem),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Cart update failed");
//       }

//       // 🛒 Update Redux cart
//       dispatch(addCart(product));

//       toast.success("✅ Product added to cart. Redirecting to checkout...");
//       navigate("/cart");
//     } catch (err) {
//       console.error("Buy Now Error:", err);
//       toast.error("❌ Failed to proceed to checkout.");
//     }
//   };

//   /**
//    * ✅ Show Product with Multi-Image Gallery and Swipe Functionality
//    */
//   const ShowProduct = () => {
//     return (
//       <div className="container my-5 py-2">
//         <div className="row">
//           {/* Left Side Thumbnail List */}
//           <div className="col-md-1 d-none d-md-flex flex-column align-items-center">
//             {images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Thumbnail ${index + 1}`}
//                 className={`img-thumbnail mb-2 ${
//                   selectedImage === img ? "border-primary" : ""
//                 }`}
//                 style={{
//                   cursor: "pointer",
//                   width: "60px",
//                   height: "60px",
//                   objectFit: "cover",
//                 }}
//                 onClick={() => handleImageClick(img)}
//               />
//             ))}
//           </div>

//           {/* Main Image Display */}
//           <div className="col-md-6 col-sm-12 py-3">
//             <img
//               className="img-fluid"
//               src={selectedImage}
//               alt={product.title}
//               width="100%"
//               height="auto"
//               style={{ maxHeight: "500px", objectFit: "contain" }}
//               onTouchStart={handleTouchStart}
//               onTouchEnd={handleTouchEnd}
//             />
//           </div>

//           {/* Product Details */}
//           <div className="col-md-5 col-sm-12 py-5">
//             <h4 className="text-uppercase text-muted">{product.category}</h4>
//             <h1 className="display-5">{product.title}</h1>
//             <p className="lead">
//               {product.rating?.rate} <i className="fa fa-star"></i>
//             </p>

//             {/* Pricing */}
//             <h3 className="display-6 my-4">
//               <del style={{ color: "red", marginRight: "5px" }}>
//                 Rs.{product.price}
//               </del>
//               <span style={{ fontWeight: "bold", color: "#000" }}>
//                 Rs.{Math.round(product.price * 0.9)}
//               </span>
//               <span
//                 style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
//               >
//                 (10% OFF)
//               </span>
//             </h3>

//             {/* Buttons */}
//             <div className="d-flex mt-3">
//               <button
//                 className="btn btn-dark btn-sm flex-grow-1 mr-2"
//                 onClick={() => addProductToCart(product)}
//               >
//                 🛒 ADD TO CART
//               </button>
//               {/* <Link to="/cart" className="btn btn-dark btn-sm flex-grow-1">
//                 ⚡ BUY NOW
//               </Link> */}

//               <button
//                 className="btn btn-dark btn-sm flex-grow-1"
//                 onClick={() => handleBuyNow(product)}
//               >
//                 ⚡ BUY NOW
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="row">
//           {loading ? <Skeleton height={400} /> : <ShowProduct />}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Product;

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
  const [showDescription, setShowDescription] = useState(true);

  const dispatch = useDispatch();

  let touchStartX = 0;
  let touchEndX = 0;

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

      toast.success("✅ Product added to cart successfully!");
      dispatch(addCart(product));
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleBuyNow = async (product) => {
    const token = localStorage.getItem("apitoken");

    if (!token) {
      toast.error("Please login to continue.");
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
        throw new Error(errorData.error || "Cart update failed");
      }

      dispatch(addCart(product));
      toast.success("✅ Product added to cart. Redirecting to checkout...");
      navigate("/cart");
    } catch (err) {
      console.error("Buy Now Error:", err);
      toast.error("❌ Failed to proceed to checkout.");
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

          const productImages =
            productData.images?.length > 0
              ? productData.images
              : ["https://via.placeholder.com/400"];

          setProduct({
            id: productData.item_id,
            title: productData.name || "No Title",
            price: Math.round(productData.price) || 0,
            description: productData.description || "No description available",
            category: productData.category || "Uncategorized",
            rating: {
              rate: parseFloat(productData.avg_rating) || 0,
              count: productData.ratings_length || 0,
            },
          });

          setImages(productImages);
          setSelectedImage(productImages[0]);
        }
      } catch (error) {
        console.error("❌ Error fetching product details:", error);
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
      <div className="container my-5 py-2">
        <div className="row">
          {/* Thumbnails for Desktop */}
          <div className="col-md-1 d-none d-md-flex flex-column align-items-center">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`img-thumbnail mb-2 ${
                  selectedImage === img ? "border-primary" : ""
                }`}
                style={{
                  cursor: "pointer",
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={selectedImage}
              alt={product.title}
              width="100%"
              height="auto"
              style={{ maxHeight: "500px", objectFit: "contain" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />

            {/* Mobile Thumbnails */}
            <div
              className="d-flex d-md-none mt-3 overflow-auto"
              style={{ gap: "10px" }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => handleImageClick(img)}
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "cover",
                    border:
                      selectedImage === img
                        ? "2px solid #000"
                        : "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-5 col-sm-12 py-5">
            {/* ✅ Product Name */}
            <h1 className="fw-bold mb-3" style={{ fontSize: "28px" }}>
              {product.title}
            </h1>

            <h3 className="display-6 my-3">
              <span style={{ fontWeight: "bold", color: "#000" }}>
                Rs.{product.price}
              </span>
            </h3>

            {/* ✅ Buttons FIRST */}
            <div className="d-flex mt-2 gap-2">
              <button
                className="btn btn-dark btn-sm w-50"
                onClick={() => addProductToCart(product)}
              >
                🛒 ADD TO CART
              </button>
              <button
                className="btn btn-dark btn-sm w-50"
                onClick={() => handleBuyNow(product)}
              >
                ⚡ BUY NOW
              </button>
            </div>

            {/* ✅ Pricing */}

            {/* ✅ Product Description Heading */}
            {/* ✅ Product Description Section */}
            <div className="mt-4">
              <div
                onClick={() => setShowDescription(!showDescription)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h5 className="mb-0 fw-bold" style={{ fontSize: "16px" }}>
                  📃 Product Description
                </h5>
                <span style={{ fontSize: "18px" }}>
                  {showDescription ? "▲" : "▼"}
                </span>
              </div>

              <div
                style={{
                  maxHeight: showDescription ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease-in-out",
                  background: "#fff",
                  padding: showDescription ? "15px 16px" : "0 16px",
                  borderRadius: "0 0 6px 6px",
                  border: showDescription ? "1px solid #dee2e6" : "none",
                  borderTop: "none",
                }}
              >
                <div
                  style={{
                    maxHeight: showDescription ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease-in-out",
                    background: "#fff",
                    padding: showDescription ? "15px 20px 20px 20px" : "0 20px",
                    borderRadius: "0 0 8px 8px",
                    border: showDescription ? "1px solid #dee2e6" : "none",
                    borderTop: "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#444",
                      lineHeight: "1.5",
                      letterSpacing: "0.2px",
                      padding: "0",
                      margin: "0",
                      textAlign: "justify",
                      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    }}
                  >
                    {product.description}
                  </p>
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
      <div className="container">
        <div className="row">
          {loading ? <Skeleton height={400} /> : <ShowProduct />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
