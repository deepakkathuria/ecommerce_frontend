import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

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

      const result = await response.json();
      toast.success("Product added to cart successfully!");

      // Optionally dispatch to Redux for state management
      dispatch(addCart(product));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  /**
   * Fetch Product and Similar Products
   */
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        // Fetch single product by ID
        const response = await fetch(`https://hammerhead-app-jkdit.ondigitalocean.app/product/${id}`);
        const result = await response.json();

        if (result.status === 200 && result.rows.length > 0) {
          const productData = result.rows[0];

          // ✅ Image Mapping Logic
          const productImage =
            productData.first_image ||
            (productData.images && productData.images.length > 0 && productData.images[0]) ||
            "https://via.placeholder.com/150"; // Default image

          const formattedProduct = {
            id: productData.item_id,
            title: productData.name || "No Title",
            price: productData.price || 0,
            description: productData.description || "No description available",
            category: productData.category || "Uncategorized",
            image: productImage,
            rating: {
              rate: parseFloat(productData.avg_rating) || 0,
              count: productData.ratings_length || 0,
            },
          };

          setProduct(formattedProduct);

          // Fetch similar products by category
          const categoryResponse = await fetch(
            `https://hammerhead-app-jkdit.ondigitalocean.app/category/${productData.category}`
          );
          const categoryResult = await categoryResponse.json();

          if (categoryResult.status === 200) {
            const formattedSimilarProducts = categoryResult.rows.map((item) => ({
              id: item.item_id,
              title: item.name || "No Title",
              price: item.price || 0,
              description: item.description || "No description available",
              category: item.category || "Uncategorized",
              image:
                item.first_image ||
                (item.images && item.images.length > 0 && item.images[0]) ||
                "https://via.placeholder.com/150", // Default image
              rating: {
                rate: parseFloat(item.avg_rating) || 0,
                count: item.ratings_length || 0,
              },
            }));
            setSimilarProducts(formattedSimilarProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    };

    getProduct();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3">
          <img
            className="img-fluid"
            src={product.image}
            alt={product.title}
            width="400px"
            height="400px"
          />
        </div>
        <div className="col-md-6 col-sm-12 py-5">
          <h4 className="text-uppercase text-muted">{product.category}</h4>
          <h1 className="display-5">{product.title}</h1>
          <p className="lead">
            {product.rating?.rate} <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 my-4">Rs.{product.price}</h3>
          <p className="lead">{product.description}</p>
          <button
            className="btn btn-outline-dark"
            onClick={() => addProductToCart(product)}
          >
            Add to Cart
          </button>
          <Link to="/cart" className="btn btn-dark mx-3">
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <h2>You may also like</h2>
          <Marquee pauseOnHover speed={50}>
            {loading2 ? <Loading /> : (
              <div className="d-flex">
                {similarProducts.map((item) => (
                  <div key={item.id} className="card mx-4 text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      height={300}
                      width={300}
                    />
                    <h5>{item.title}</h5>
                    <button
                      onClick={() => addProductToCart(item)}
                      className="btn btn-dark"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Marquee>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
