import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let componentMounted = true;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            image: product.image,
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
      console.log(response, "reposnefromapi");

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
   * Fetch Products and Categories
   */
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://hammerhead-app-jkdit.ondigitalocean.app/products?page=${page}&limit=16`
        );
        const result = await response.json();

        const formattedData = result.rows.map((item) => ({
          id: item.item_id,
          title: item.name || "No Title",
          price: item.price || 0,
          description: item.description || "No description available",
          category: item.category || "Uncategorized",
          images:
            item.images && item.images.length > 0
              ? item.images
              : ["https://via.placeholder.com/150"],
          rating: {
            rate: parseFloat(item.avg_rating) || 0,
            count: item.rating_count || 0,
          },
        }));

        const uniqueCategories = [
          ...new Set(formattedData.map((item) => item.category)),
        ];

        setData(formattedData);
        setFilter(formattedData);
        setCategories(uniqueCategories);
        setTotalPages(result.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    getProducts();
  }, [page]);

  /**
   * Handle Loading State
   */
  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </>
  );

  /**
   * Filter Products by Category
   */
  const filterProduct = (cat) => {
    if (cat === "all") {
      setFilter(data);
    } else {
      const updatedList = data.filter((item) => item.category === cat);
      setFilter(updatedList);
    }
  };

  /**
   * Show Products
   */
  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-5">
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("all")}
        >
          All
        </button>
        {categories.map((cat, index) => (
          <button
            key={index}
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="row g-0 gx-0 gy-0 p-0 m-0">
        {filter.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addProductToCart={addProductToCart}
          />
        ))}
      </div>
      <div className="text-center my-4">
        <button
          className="btn btn-outline-dark btn-sm mx-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ◀ Previous
        </button>

        <span className="mx-2 fw-bold">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-outline-dark btn-sm mx-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ▶
        </button>
      </div>
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

/**
 * Product Card with Clickable Image
 */
// const ProductCard = ({ product, addProductToCart }) => {
//   const [currentImage, setCurrentImage] = useState(0);

//   // Calculate Discount Price (10% OFF) and round off to nearest integer
//   const discountPercentage = 10; // Change this to any percentage
//   const originalPrice = product.price;
//   const discountedPrice = Math.round(
//     originalPrice - (originalPrice * discountPercentage) / 100
//   );

//   const handleNextImage = () => {
//     setCurrentImage((prev) => (prev + 1) % product.images.length);
//   };

//   const handlePrevImage = () => {
//     setCurrentImage((prev) =>
//       prev === 0 ? product.images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="col-6 col-md-4 col-lg-3" style={{ padding: "0.1rem" }}>
//       <div className="card text-center h-100 shadow-sm m-0">
//         <div className="position-relative">
//           <Link to={`/product/${product.id}`}>
//             <img
//               className="card-img-top"
//               src={product.images[currentImage]}
//               alt={product.title}
//               style={{
//                 width: "100%",
//                 height: "240px",
//                 objectFit: "cover",
//               }}
//             />
//           </Link>
//         </div>

//         <div className="card-body">
//           <h5 className="card-title">{product.title}</h5>

//           {/* ✅ Product Price with Discount Display */}
//           <h6 className="lead">
//             <del style={{ color: "red", marginRight: "5px" }}>
//               Rs.{originalPrice}
//             </del>
//             <span style={{ fontWeight: "bold", color: "#000" }}>
//               Rs.{discountedPrice}
//             </span>
//             <span
//               style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
//             >
//               ({discountPercentage}% OFF)
//             </span>
//           </h6>
//         </div>
//       </div>
//     </div>
//   );
// };

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const discountPercentage = 10;
  const originalPrice = product.price;
  const discountedPrice = Math.round(
    originalPrice - (originalPrice * discountPercentage) / 100
  );

  return (
    <div className="col-6 col-md-4 col-lg-3" style={{ padding: "0.4rem" }}>
      <div className="card text-center h-100 shadow-sm m-0">
        <Link to={`/product/${product.id}`}>
          <img
            className="card-img-top"
            src={product.images[currentImage]}
            alt={product.title}
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        </Link>

        {/* ✅ Thumbnail carousel below main image */}
        {product.images.length > 1 && (
          <div
            className="d-flex justify-content-center mt-2 px-2"
            style={{ overflowX: "auto" }}
          >
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`img-thumbnail mx-1 ${
                  index === currentImage ? "border-primary" : ""
                }`}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "4px",
                  border:
                    index === currentImage
                      ? "2px solid #007bff"
                      : "1px solid #ddd",
                }}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        )}

        <div className="card-body">
          <h6 className="card-title mb-2">{product.title}</h6>

          <h6 className="lead">
            <del style={{ color: "red", marginRight: "5px" }}>
              Rs.{originalPrice}
            </del>
            <span style={{ fontWeight: "bold", color: "#000" }}>
              Rs.{discountedPrice}
            </span>
            <span
              style={{ color: "green", marginLeft: "5px", fontSize: "14px" }}
            >
              ({discountPercentage}% OFF)
            </span>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Products;
