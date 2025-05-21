

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addCart } from "../redux/action";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import toast from "react-hot-toast";

// const Products = () => {
//   const [data, setData] = useState([]);
//   const [filter, setFilter] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubcategory, setSelectedSubcategory] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getProducts = async () => {
//       setLoading(true);
//       try {
//         const url = new URL("https://hammerhead-app-jkdit.ondigitalocean.app/products");
//         url.searchParams.append("page", page);
//         url.searchParams.append("limit", 16);
  
//         if (selectedCategory !== "all") {
//           url.searchParams.append("category", selectedCategory);
//           if (selectedSubcategory) {
//             url.searchParams.append("subcategory", selectedSubcategory);
//           }
//         }
  
//         const response = await fetch(url.toString());
//         const result = await response.json();
  
//         const formattedData = result.rows.map((item) => {
//           let images = [];
//           try {
//             images = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
//           } catch (e) {
//             images = [];
//           }
  
//           return {
//             id: item.item_id,
//             title: item.name || "No Title",
//             price: item.price || 0,
//             description: item.description || "No description available",
//             category: item.category || "Uncategorized",
//             subcategory: item.subcategory || "",
//             images: images.length > 0 ? images : ["https://via.placeholder.com/150"],
//           };
//         });
  
//         const uniqueCategories = [...new Set(formattedData.map(item => item.category))];
//         setData(formattedData);
//         setFilter(formattedData);
//         setCategories(uniqueCategories);
//         setTotalPages(result.totalPages);
//       } catch (error) {
//         console.error("❌ Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     getProducts();
//   }, [page, selectedCategory, selectedSubcategory]);
  

//   const filterProduct = (category) => {
//     setSelectedCategory(category);
//     setSelectedSubcategory("");
//     if (category === "all") {
//       setFilter(data);
//       setSubcategories([]);
//     } else {
//       const updated = data.filter((item) => item.category === category);
//       setFilter(updated);
//       const uniqueSubs = [
//         ...new Set(updated.map((item) => item.subcategory).filter(Boolean)),
//       ];
//       setSubcategories(uniqueSubs);
//     }
//   };

//   const filterBySubcategory = (subcategory) => {
//     setSelectedSubcategory(subcategory);
//     const updated = data.filter(
//       (item) =>
//         item.category === selectedCategory && item.subcategory === subcategory
//     );
//     setFilter(updated);
//   };

//   const Loading = () => (
//     <>
//       <div className="col-12 py-5 text-center">
//         <Skeleton height={40} width={560} />
//       </div>
//       {[...Array(6)].map((_, index) => (
//         <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
//           <Skeleton height={592} />
//         </div>
//       ))}
//     </>
//   );

//   const ShowProducts = () => (
//     <>
//       <div className="buttons text-center py-4">
//         <button
//           className={`btn btn-sm m-1 ${
//             selectedCategory === "all" ? "btn-dark" : "btn-outline-dark"
//           }`}
//           onClick={() => filterProduct("all")}
//         >
//           All
//         </button>
//         {categories.map((cat, index) => (
//           <button
//             key={index}
//             className={`btn btn-sm m-1 ${
//               selectedCategory === cat ? "btn-dark" : "btn-outline-dark"
//             }`}
//             onClick={() => filterProduct(cat)}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* ✅ Subcategories */}
//       {subcategories.length > 0 && (
//         <div className="text-center mb-3">
//           <h6>Subcategories:</h6>
//           {subcategories.map((sub, index) => (
//             <button
//               key={index}
//               className={`btn btn-sm m-1 ${
//                 selectedSubcategory === sub
//                   ? "btn-success"
//                   : "btn-outline-success"
//               }`}
//               onClick={() => filterBySubcategory(sub)}
//             >
//               {sub}
//             </button>
//           ))}
//         </div>
//       )}

//       <div className="row g-0 gx-0 gy-0 p-0 m-0">
//         {filter.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="text-center my-4">
//         <button
//           className="btn btn-outline-dark btn-sm mx-2"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           ◀ Previous
//         </button>
//         <span className="mx-2 fw-bold">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           className="btn btn-outline-dark btn-sm mx-2"
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Next ▶
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div className="container my-3 py-3">
//       <div className="row">
//         <div className="col-12">
//           <h2 className="display-5 text-center">🛍️ Explore Products</h2>
//           <hr />
//         </div>
//       </div>
//       <div className="row justify-content-center">
//         {loading ? <Loading /> : <ShowProducts />}
//       </div>
//     </div>
//   );
// };

// // const ProductCard = ({ product }) => {
// //   const [currentImage, setCurrentImage] = useState(0);

// //   // const discountPercentage = 10;
// //   const originalPrice = product.price;
// //   // const discountedPrice = Math.round(
// //   //   originalPrice - (originalPrice * discountPercentage) / 100
// //   // );

// //   return (
// //     <div className="col-6 col-md-4 col-lg-3" style={{ padding: "0.4rem" }}>
// //       <div className="card text-center h-100 shadow-sm m-0">
// //         <Link to={`/product/${product.id}`}>
// //           <img
// //             className="card-img-top"
// //             src={product.images[currentImage]}
// //             alt={product.title}
// //             style={{
// //               width: "100%",
// //               height: "240px",
// //               objectFit: "cover",
// //               borderRadius: "5px",
// //             }}
// //           />
// //         </Link>

// //         {product.images.length > 1 && (
// //           <div
// //             className="d-flex justify-content-center mt-2 px-2"
// //             style={{ overflowX: "auto" }}
// //           >
// //             {product.images.map((img, index) => (
// //               <img
// //                 key={index}
// //                 src={img}
// //                 alt={`Thumbnail ${index}`}
// //                 className={`img-thumbnail mx-1 ${
// //                   index === currentImage ? "border-primary" : ""
// //                 }`}
// //                 style={{
// //                   width: "40px",
// //                   height: "40px",
// //                   objectFit: "cover",
// //                   cursor: "pointer",
// //                   borderRadius: "4px",
// //                   border:
// //                     index === currentImage
// //                       ? "2px solid #007bff"
// //                       : "1px solid #ddd",
// //                 }}
// //                 onClick={() => setCurrentImage(index)}
// //               />
// //             ))}
// //           </div>
// //         )}

// //         <div className="card-body">
// //           <h6 className="card-title mb-2">{product.title}</h6>

// //           <h6 className="lead">
// //             <span style={{ fontWeight: "bold", color: "#000" }}>
// //               Rs.{originalPrice}
// //             </span>
// //           </h6>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// const ProductCard = ({ product }) => {
//   const [currentImage, setCurrentImage] = useState(0);

//   // Optimization helper
//   const optimizeImage = (url) => url?.replace("/upload/", "/upload/f_auto,q_auto,w_600/");

//   return (
//     <div className="col-6 col-md-4 col-lg-3" style={{ padding: "0.4rem" }}>
//       <div className="card text-center h-100 shadow-sm m-0">
//         <Link to={`/product/${product.id}`}>
//           <img
//             className="card-img-top"
//             loading="lazy"
//             src={optimizeImage(product.images[currentImage])}
//             alt={product.title}
//             style={{
//               width: "100%",
//               height: "240px",
//               objectFit: "cover",
//               borderRadius: "5px",
//             }}
//           />
//         </Link>

//         {product.images.length > 1 && (
//           <div className="d-flex justify-content-center mt-2 px-2" style={{ overflowX: "auto" }}>
//             {product.images.map((img, index) => (
//               <img
//                 key={index}
//                 src={optimizeImage(img)}
//                 alt={`Thumb ${index}`}
//                 loading="lazy"
//                 className={`img-thumbnail mx-1 ${index === currentImage ? "border-primary" : ""}`}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   objectFit: "cover",
//                   cursor: "pointer",
//                   borderRadius: "4px",
//                   border: index === currentImage ? "2px solid #007bff" : "1px solid #ddd",
//                 }}
//                 onClick={() => setCurrentImage(index)}
//               />
//             ))}
//           </div>
//         )}

//         <div className="card-body">
//           <h6 className="card-title mb-2">{product.title}</h6>
//           <h6 className="lead">
//             <strong style={{ color: "#000" }}>Rs.{product.price}</strong>
//           </h6>
//         </div>
//       </div>
//     </div>
//   );
// };




// export default Products;




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";

const Products = () => {
  const [originalData, setOriginalData] = useState([]); // ✅ Full original fetched products
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const url = new URL("https://hammerhead-app-jkdit.ondigitalocean.app/products");
        url.searchParams.append("page", page);
        url.searchParams.append("limit", 16);

        if (selectedCategory !== "all") {
          url.searchParams.append("category", selectedCategory);
          if (selectedSubcategory) {
            url.searchParams.append("subcategory", selectedSubcategory);
          }
        }

        const response = await fetch(url.toString());
        const result = await response.json();

        const formattedData = result.rows.map((item) => {
          let images = [];
          try {
            images = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
          } catch (e) {
            images = [];
          }

          return {
            id: item.item_id,
            title: item.name || "No Title",
            price: item.price || 0,
            description: item.description || "No description available",
            category: item.category || "Uncategorized",
            subcategory: item.subcategory || "",
            images: images.length > 0 ? images : ["https://via.placeholder.com/150"],
          };
        });

        setOriginalData(formattedData); // ✅ Save full fetched data
        setFilter(formattedData);        // ✅ Displayed filtered data
        const uniqueCategories = [...new Set(formattedData.map(item => item.category))];
        setCategories(uniqueCategories);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [page, selectedCategory, selectedSubcategory]);

  const filterProduct = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");

    if (category === "all") {
      setFilter(originalData);
      setSubcategories([]);
    } else {
      const updated = originalData.filter((item) => item.category === category);
      setFilter(updated);
      const uniqueSubs = [...new Set(updated.map((item) => item.subcategory).filter(Boolean))];
      setSubcategories(uniqueSubs);
    }
  };

  const filterBySubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    const updated = originalData.filter(
      (item) => item.category === selectedCategory && item.subcategory === subcategory
    );
    setFilter(updated);
  };

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

  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-4">
        <button
          className={`btn btn-sm m-1 ${selectedCategory === "all" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => filterProduct("all")}
        >
          All
        </button>
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`btn btn-sm m-1 ${selectedCategory === cat ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => filterProduct(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {subcategories.length > 0 && (
        <div className="text-center mb-3">
          <h6>Subcategories:</h6>
          {subcategories.map((sub, index) => (
            <button
              key={index}
              className={`btn btn-sm m-1 ${selectedSubcategory === sub ? "btn-success" : "btn-outline-success"}`}
              onClick={() => filterBySubcategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="row g-0 gx-0 gy-0 p-0 m-0">
        {filter.map((product) => (
          <ProductCard key={product.id} product={product} />
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
          <h2 className="display-5 text-center">🛍️ Explore Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const optimizeImage = (url) => url?.replace("/upload/", "/upload/f_auto,q_auto,w_600/");

  return (
    <div className="col-6 col-md-4 col-lg-3" style={{ padding: "0.4rem" }}>
      <div className="card text-center h-100 shadow-sm m-0">
        <Link to={`/product/${product.id}`}>
          <img
            className="card-img-top"
            loading="lazy"
            src={optimizeImage(product.images[currentImage])}
            alt={product.title}
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        </Link>

        {product.images.length > 1 && (
          <div className="d-flex justify-content-center mt-2 px-2" style={{ overflowX: "auto" }}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={optimizeImage(img)}
                alt={`Thumb ${index}`}
                loading="lazy"
                className={`img-thumbnail mx-1 ${index === currentImage ? "border-primary" : ""}`}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "4px",
                  border: index === currentImage ? "2px solid #007bff" : "1px solid #ddd",
                }}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        )}

        <div className="card-body">
          <h6 className="card-title mb-2">{product.title}</h6>
          <h6 className="lead">
            <strong style={{ color: "#000" }}>Rs.{product.price}</strong>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Products;
