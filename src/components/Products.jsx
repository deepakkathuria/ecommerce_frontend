import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import SearchModal from "./SearchModal";

const Products = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [viewMode, setViewMode] = useState("grid");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  console.log('🔄 Products component render - searchTerm:', searchTerm);

  // Handle URL parameters for search and filters (only on initial load)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromURL = searchParams.get('search');
    const categoryFromURL = searchParams.get('category');
    const subcategoryFromURL = searchParams.get('subcategory');

    if (searchFromURL && !searchTerm) {
      setSearchTerm(searchFromURL);
    }
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL.toLowerCase());
      if (subcategoryFromURL) {
        setSelectedSubcategory(subcategoryFromURL.toLowerCase());
      }
    }
  }, [location.search]);

  // Memoized filtered data for better performance
  const filteredData = useMemo(() => {
    console.log('🔍 filteredData useMemo running - searchTerm:', searchTerm);
    let filtered = originalData;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
      if (selectedSubcategory) {
        filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Price range filter
    filtered = filtered.filter(item => 
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [originalData, selectedCategory, selectedSubcategory, searchTerm, sortBy, priceRange]);

  useEffect(() => {
    setFilter(filteredData);
  }, [filteredData]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const url = new URL("https://hammerhead-app-jkdit.ondigitalocean.app/products");
        url.searchParams.append("page", page);
        url.searchParams.append("limit", 1000);

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
            category: item.category?.toLowerCase() || "uncategorized",
            subcategory: item.subcategory?.toLowerCase() || "",
            images: images.length > 0 ? images : ["https://via.placeholder.com/150"],
          };
        });

        setOriginalData(formattedData);
        setTotalPages(result.totalPages);

        // Build categories and subcategory mapping
        const map = {};
        formattedData.forEach((item) => {
          if (!map[item.category]) map[item.category] = new Set();
          if (item.subcategory) map[item.category].add(item.subcategory);
        });

        const catList = Object.keys(map);
        const mapClean = {};
        for (let cat of catList) {
          mapClean[cat] = [...map[cat]];
        }

        setCategories(catList);
        setCategoryMap(mapClean);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [page]);

  const filterBySubcategory = useCallback((category, subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    const params = new URLSearchParams(location.search);
    params.set('category', category);
    params.set('subcategory', subcategory);
    navigate(`/product?${params.toString()}`);
  }, [navigate, location.search]);

  const filterAll = useCallback(() => {
    setSelectedCategory("all");
    setSelectedSubcategory("");
    const params = new URLSearchParams(location.search);
    params.delete('category');
    params.delete('subcategory');
    navigate(`/product?${params.toString()}`);
  }, [navigate, location.search]);

  const toggleCategoryExpansion = useCallback((category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("");
    setSortBy("default");
    setPriceRange({ min: 0, max: 10000 });
    setExpandedCategories({});
    navigate("/product");
  }, [navigate]);



  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const Loading = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
            <Skeleton height={400} />
          </div>
        ))}
      </div>
    </div>
  );

  const FilterSidebar = useCallback(() => {
    console.log('🔄 FilterSidebar re-rendered');
    return (
      <div className="col-lg-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Filters</h5>
          </div>
          <div className="card-body">
            {/* Search */}
            <div className="mb-4">
              <label className="form-label fw-bold">
                Search
                <span className={`badge bg-primary ms-2 ${searchTerm ? '' : 'd-none'}`}>
                  <i className="fa fa-search"></i> Active
                </span>
              </label>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  <i className="fa fa-search me-2"></i>
                  {searchTerm ? `Search: "${searchTerm}"` : "Click to search products"}
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa fa-times me-1"></i>
                    Clear Search
                  </button>
                )}
              </div>
              {searchTerm && (
                <small className="text-muted mt-2 d-block">
                  Searching for: "{searchTerm}" • {filteredData.length} results found
                </small>
              )}
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label className="form-label fw-bold">Categories</label>
              <div className="d-grid gap-2">
                <button
                  className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={filterAll}
                >
                  All Categories
                </button>
                
                {categories.map((cat, index) => (
                  <div key={index} className="category-item">
                    <button
                      className={`btn btn-sm w-100 text-start ${
                        selectedCategory === cat ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => toggleCategoryExpansion(cat)}
                    >
                      <span className="d-flex align-items-center justify-content-between">
                        <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        <i className={`fa fa-chevron-down ${expandedCategories[cat] ? 'rotate' : ''}`}></i>
                      </span>
                    </button>
                    
                    {expandedCategories[cat] && categoryMap[cat]?.length > 0 && (
                      <div className="subcategory-list mt-2">
                        {categoryMap[cat].map((sub, i) => (
                          <button
                            key={i}
                            className={`btn btn-sm w-100 text-start mb-1 subcategory-btn ${
                              selectedCategory === cat && selectedSubcategory === sub 
                                ? "btn-info text-white" 
                                : "btn-outline-secondary"
                            }`}
                            onClick={() => filterBySubcategory(cat, sub)}
                          >
                            <i className="fa fa-angle-right me-2"></i>
                            {sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="form-label fw-bold">Price Range</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="form-label fw-bold">Sort By</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="mb-4">
              <label className="form-label fw-bold">View Mode</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <i className="fa fa-th"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setViewMode("list")}
                >
                  <i className="fa fa-list"></i>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center">
              <small className="text-muted">
                {filteredData.length} products found
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }, [selectedCategory, selectedSubcategory, categories, categoryMap, expandedCategories, priceRange, sortBy, viewMode, filteredData.length, filterAll, toggleCategoryExpansion, filterBySubcategory, handleClearSearch, isSearchModalOpen]);

  const ShowProducts = () => (
    <div className="col-lg-9">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Products</h4>
          <small className="text-muted">
            {filteredData.length} products • {selectedCategory !== "all" ? selectedCategory : "All categories"}
            {selectedSubcategory && ` > ${selectedSubcategory}`}
          </small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={clearAllFilters}
          >
            <i className="fa fa-refresh"></i> Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`row ${viewMode === "list" ? "g-3" : "g-3"}`}>
        {filteredData.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fa fa-search fa-3x text-muted mb-3"></i>
          <h5>No products found</h5>
          <p className="text-muted">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Product pagination">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
              </li>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <li key={pageNum} className={`page-item ${pageNum === page ? "active" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <FilterSidebar />
        {loading ? <Loading /> : <ShowProducts />}
      </div>

      <style>{`
        .category-item {
          position: relative;
        }

        .subcategory-list {
          padding-left: 1rem;
          border-left: 2px solid #e9ecef;
          margin-top: 0.5rem;
        }

        .subcategory-btn {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .subcategory-btn:hover {
          transform: translateX(5px);
        }

        .fa-chevron-down.rotate {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }

        .fa-chevron-down {
          transition: transform 0.3s ease;
        }

        .btn-outline-secondary:hover {
          background-color: #6c757d;
          border-color: #6c757d;
          color: white;
        }

        .category-item button {
          transition: all 0.2s ease;
        }

        .category-item button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Search input improvements */
        .input-group .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          outline: none;
        }

        .input-group .form-control {
          transition: all 0.2s ease;
        }

        .input-group .btn-outline-secondary {
          border-left: none;
        }

        .input-group .btn-outline-secondary:hover {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        /* Search badge animation */
        .badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        /* Prevent focus loss */
        .input-group .form-control:focus {
          z-index: 3;
        }
      `}</style>
      
      {/* Search Modal - Completely isolated */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={setSearchTerm} 
        initialValue={searchTerm} 
      />
    </div>
  );
};

const ProductCard = ({ product, viewMode }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const optimizeImage = (url) => url?.replace("/upload/", "/upload/f_auto,q_auto,w_600/");

  const handleAddToCart = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    // Ensure product has proper category information
    const productWithCategory = {
      ...product,
      category: product.category || "General",
      categoryName: product.category || "General",
    };
    
    dispatch(addCart(productWithCategory));
    toast.success("Added to cart!");
  };

  if (viewMode === "list") {
    return (
      <div className="col-12">
        <div className="card shadow-sm h-100">
          <div className="row g-0">
            <div className="col-md-3">
              <div className="position-relative">
                <img
                  className="card-img-top h-100"
                  loading="lazy"
                  src={optimizeImage(product.images[currentImage])}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                {product.images.length > 1 && (
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-50">
                    <div className="d-flex justify-content-center gap-1">
                      {product.images.slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={optimizeImage(img)}
                          alt={`Thumb ${index}`}
                          loading="lazy"
                          className={`img-thumbnail ${index === currentImage ? "border-primary" : ""}`}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => setCurrentImage(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-9">
              <div className="card-body d-flex flex-column h-100">
                <div className="flex-grow-1">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-muted small">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary mb-0">₹{product.price}</h6>
                    <span className="badge bg-secondary">{product.category}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex gap-2">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddToCart}
                    >
                      <i className="fa fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div 
        className="card h-100 shadow-sm product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="position-relative">
          <Link to={`/product/${product.id}`}>
            <img
              className="card-img-top"
              loading="lazy"
              src={optimizeImage(product.images[currentImage])}
              alt={product.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          </Link>
          
          {/* Quick Add to Cart Button */}
          <div 
            className="position-absolute top-0 end-0 p-2"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <button
              className="btn btn-primary btn-sm rounded-circle"
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              <i className="fa fa-cart-plus"></i>
            </button>
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-50">
              <div className="d-flex justify-content-center gap-1">
                {product.images.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={optimizeImage(img)}
                    alt={`Thumb ${index}`}
                    loading="lazy"
                    className={`img-thumbnail ${index === currentImage ? "border-primary" : ""}`}
                    style={{
                      width: "25px",
                      height: "25px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-2 text-truncate">{product.title}</h6>
          <div className="mt-auto">
            <h6 className="text-primary mb-2">₹{product.price}</h6>
            <div className="d-grid">
              <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 