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
   * Fetch Products and Categories
   */
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/products");
        const result = await response.json();

        if (componentMounted) {
          // Map API response to format
          const formattedData = result.rows.map((item) => ({
            id: item.item_id,
            title: item.name || "No Title",
            price: item.price || 0,
            description: item.description || "No description available",
            category: item.category || "Uncategorized",
            images:
              item.images && item.images.length > 0
                ? item.images
                : ["https://via.placeholder.com/150"], // Default placeholder
            rating: {
              rate: parseFloat(item.avg_rating) || 0,
              count: item.rating_count || 0,
            },
          }));

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(formattedData.map((item) => item.category)),
          ];

          setData(formattedData);
          setFilter(formattedData);
          setCategories(uniqueCategories);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

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

      <div className="row">
        {filter.map((product) => (
          <ProductCard key={product.id} product={product} addProductToCart={addProductToCart} />
        ))}
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
 * Product Card with Image Scrolling
 */
const ProductCard = ({ product, addProductToCart }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
      <div className="card text-center h-100">
        <div className="position-relative">
          <img
            className="card-img-top p-3"
            src={product.images[currentImage]}
            alt={product.title}
            height={300}
            style={{ objectFit: "contain" }}
          />
          {product.images.length > 1 && (
            <>
              <button
                className="btn btn-sm btn-light position-absolute start-0 top-50"
                onClick={handlePrevImage}
                style={{ transform: "translateY(-50%)" }}
              >
                ◀
              </button>
              <button
                className="btn btn-sm btn-light position-absolute end-0 top-50"
                onClick={handleNextImage}
                style={{ transform: "translateY(-50%)" }}
              >
                ▶
              </button>
            </>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description.substring(0, 90)}...</p>
          <h6 className="lead">Rs.{product.price}</h6>
          <Link to={`/product/${product.id}`} className="btn btn-dark m-1">
            Buy Now
          </Link>
          <button
            className="btn btn-dark m-1"
            onClick={() => addProductToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
