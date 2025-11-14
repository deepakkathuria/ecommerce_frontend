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
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

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
    if (subcategory) {
      params.set('subcategory', subcategory);
    } else {
      params.delete('subcategory');
    }
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

  const applyCategoryFilter = useCallback((category) => {
    if (category === "all") {
      filterAll();
      setIsFilterDropdownOpen(false);
      return;
    }
    setSelectedCategory(category);
    setSelectedSubcategory("");
    const params = new URLSearchParams(location.search);
    params.set('category', category);
    params.delete('subcategory');
    navigate(`/product?${params.toString()}`);
    setIsFilterDropdownOpen(false);
  }, [filterAll, location.search, navigate]);

  const handleSortSelection = useCallback((value) => {
    setSortBy(value);
    setIsSortDropdownOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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


  const ShowProducts = () => (
    <div className="col-12">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="mb-1">Products</h4>
          <small className="text-muted">
            {filteredData.length} products • {selectedCategory !== "all" ? selectedCategory : "All categories"}
            {selectedSubcategory && ` > ${selectedSubcategory}`}
          </small>
        </div>
        <div className="d-flex gap-2 filter-action-wrapper">
          <div className="filter-dropdown-wrapper" ref={sortDropdownRef}>
            <button
              className="btn filter-toggle-btn"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
            >
              <i className="fa fa-sort me-2"></i>Sort
            </button>
            {isSortDropdownOpen && (
              <div className="filter-dropdown-panel">
                <button
                  className={`dropdown-option ${sortBy === "default" ? "active" : ""}`}
                  onClick={() => handleSortSelection("default")}
                >
                  Recommended
                </button>
                <button
                  className={`dropdown-option ${sortBy === "price-low" ? "active" : ""}`}
                  onClick={() => handleSortSelection("price-low")}
                >
                  Price: Low to High
                </button>
                <button
                  className={`dropdown-option ${sortBy === "price-high" ? "active" : ""}`}
                  onClick={() => handleSortSelection("price-high")}
                >
                  Price: High to Low
                </button>
                <button
                  className={`dropdown-option ${sortBy === "name" ? "active" : ""}`}
                  onClick={() => handleSortSelection("name")}
                >
                  Name A-Z
                </button>
              </div>
            )}
          </div>

          <div className="filter-dropdown-wrapper" ref={filterDropdownRef}>
            <button
              className="btn filter-toggle-btn"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
            >
              <i className="fa fa-sliders me-2"></i>Filter
            </button>
            {isFilterDropdownOpen && (
              <div className="filter-dropdown-panel filter-panel-large">
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Price Range</h6>
                    <button className="link-btn" onClick={clearAllFilters}>Reset</button>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="w-50">
                      <label className="form-label small text-muted mb-1">Min</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={priceRange.min}
                        min={0}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="w-50">
                      <label className="form-label small text-muted mb-1">Max</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={priceRange.max}
                        min={0}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h6 className="mb-2">Categories</h6>
                  <div className="filter-tag-container">
                    <button
                      className={`filter-tag ${selectedCategory === "all" ? "active" : ""}`}
                      onClick={() => applyCategoryFilter("all")}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`filter-tag ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => applyCategoryFilter(cat)}
                      >
                        {cat.split("-").join(" ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCategory !== "all" && categoryMap[selectedCategory] && categoryMap[selectedCategory].length > 0 && (
                  <div className="filter-section">
                    <h6 className="mb-2">Sub Categories</h6>
                    <div className="filter-tag-container">
                      <button
                        className={`filter-tag ${!selectedSubcategory ? "active" : ""}`}
                        onClick={() => filterBySubcategory(selectedCategory, "")}
                      >
                        All
                      </button>
                      {categoryMap[selectedCategory].map((sub) => (
                        <button
                          key={sub}
                          className={`filter-tag ${selectedSubcategory === sub ? "active" : ""}`}
                          onClick={() => filterBySubcategory(selectedCategory, sub)}
                        >
                          {sub.split("-").join(" ").toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
        {loading ? <Loading /> : <ShowProducts />}
      </div>

      <style>{`
        .filter-action-wrapper {
          position: relative;
        }

        .filter-dropdown-wrapper {
          position: relative;
        }

        .filter-toggle-btn {
          border: 1px solid #000;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          background: #fff;
          color: #000;
          letter-spacing: 0.5px;
          padding: 10px 18px;
        }

        .filter-toggle-btn:focus,
        .filter-toggle-btn:hover {
          background: #000;
          color: #fff;
        }

        .filter-dropdown-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: #fff;
          border: 1px solid #eaeaec;
          border-radius: 8px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          min-width: 220px;
          z-index: 30;
          padding: 12px;
        }

        .filter-panel-large {
          min-width: 320px;
        }

        .dropdown-option {
          display: block;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 10px 8px;
          font-size: 14px;
          color: #282c3f;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .dropdown-option:hover {
          background: #f5f5f6;
        }

        .dropdown-option.active {
          font-weight: 600;
          background: #f5f5f6;
        }

        .filter-section + .filter-section {
          border-top: 1px solid #f0f0f0;
          margin-top: 12px;
          padding-top: 12px;
        }

        .filter-tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-tag {
          border: 1px solid #d4d5d9;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #fff;
          color: #282c3f;
          transition: all 0.2s;
        }

        .filter-tag.active,
        .filter-tag:hover {
          border-color: #000;
          color: #000;
          font-weight: 600;
        }

        .link-btn {
          background: none;
          border: none;
          color: #696e79;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ZARA Style Product Cards */
        .product-card-zara {
          background: #fff;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          padding-bottom: 125%;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card-zara:hover .product-image {
          transform: scale(1.05);
        }

        .wishlist-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          -webkit-user-select: none;
          user-select: none;
        }

        .wishlist-button:hover {
          background: #fff;
          transform: scale(1.1);
        }

        .wishlist-button:active {
          transform: scale(0.95);
        }

        .wishlist-button i {
          font-size: 16px;
          color: #000;
          transition: all 0.3s ease;
        }

        .wishlist-button.active i {
          color: #ff3f6c;
        }

        .wishlist-button.active {
          background: rgba(255, 63, 108, 0.1);
        }

        .quick-add-button {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          opacity: 0;
        }

        .product-card-zara:hover .quick-add-button {
          opacity: 1;
        }

        /* Show quick-add button on mobile tap/click */
        @media (max-width: 991px) {
          .quick-add-button {
            opacity: 1;
          }
        }

        .quick-add-button:hover {
          background: #000;
          transform: scale(1.1);
        }

        .quick-add-button:active {
          background: #000;
          transform: scale(0.95);
        }

        .quick-add-button i {
          font-size: 14px;
          color: #000;
          transition: color 0.3s ease;
        }

        .quick-add-button:hover i,
        .quick-add-button:active i {
          color: #fff;
        }

        .product-info {
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-title {
          font-size: 13px;
          font-weight: 400;
          color: #000;
          text-decoration: none;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          transition: color 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-title:hover {
          color: #666;
          text-decoration: none;
        }

        .product-price {
          font-size: 15px;
          font-weight: 500;
          color: #000;
          letter-spacing: 0.3px;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 575.98px) {
          .product-image-container {
            padding-bottom: 130%;
          }

          .wishlist-button {
            width: 40px;
            height: 40px;
            top: 8px;
            right: 8px;
          }

          .wishlist-button i {
            font-size: 18px;
          }

          .quick-add-button {
            width: 36px;
            height: 36px;
            bottom: 8px;
            left: 8px;
          }

          .quick-add-button i {
            font-size: 16px;
          }

          .product-info {
            padding: 10px 0;
          }

          .product-title {
            font-size: 11px;
            letter-spacing: 0.2px;
            line-height: 1.3;
          }

          .product-price {
            font-size: 14px;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 576px) and (max-width: 991.98px) {
          .product-image-container {
            padding-bottom: 128%;
          }

          .wishlist-button {
            width: 38px;
            height: 38px;
          }

          .wishlist-button i {
            font-size: 17px;
          }

          .quick-add-button {
            width: 34px;
            height: 34px;
          }

          .product-title {
            font-size: 12px;
          }

          .product-price {
            font-size: 15px;
          }
        }

        /* Desktop Hover Effects - Disable on touch devices */
        @media (hover: hover) and (pointer: fine) {
          .product-card-zara:hover .product-image {
            transform: scale(1.05);
          }

          .product-card-zara:hover .quick-add-button {
            opacity: 1;
          }
        }

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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use original image quality - return as is
  const optimizeImage = (url) => {
    if (!url) return '';
    // Return original image URL without quality reduction
    return url;
  };

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
      } else if (!response.ok) {
        console.error("Wishlist fetch error:", data);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }, [product.id]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

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
          // Notify Navbar to update wishlist count
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
        
        console.log("Wishlist Add Response:", { status: response.status, statusText: response.statusText, data });
        
        if (response.ok) {
          setIsInWishlist(true);
          toast.success("Added to wishlist!");
          // Refresh wishlist check to ensure sync
          setTimeout(() => {
            checkWishlist();
          }, 500);
          // Notify Navbar to update wishlist count
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          console.error("Wishlist API Error - Status:", response.status, "Data:", data);
          throw new Error(data.error || data.message || `Failed to add to wishlist (Status: ${response.status})`);
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.message || "Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("apitoken");
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      // Format product for backend API
      const cartItem = {
        items: [{
          id: product.id,
          quantity: 1,
          name: product.title,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
        }],
      };

      // Add to cart via API
      const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to cart");
      }

      // Ensure product has proper category information for Redux
      const productWithCategory = {
        ...product,
        category: product.category || "General",
        categoryName: product.category || "General",
      };

      // Update Redux store
      dispatch(addCart(productWithCategory));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Cart error:", error);
      toast.error(error.message || "Failed to add to cart");
    }
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
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div 
        className="product-card-zara"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-image-container">
          <Link to={`/product/${product.id}`}>
            <img
              className="product-image"
              loading="lazy"
              src={optimizeImage(product.images[currentImage])}
              alt={product.title}
            />
          </Link>
          
          {/* Wishlist Heart Button */}
          <button
            className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
            onClick={handleAddToWishlist}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={`fa ${isInWishlist ? 'fa-heart' : 'fa-heart-o'}`}></i>
          </button>

          {/* Quick Add to Cart Button - Small + icon */}
          <button
            className="quick-add-button"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>

        <div className="product-info">
          <Link to={`/product/${product.id}`} className="product-title">
            {product.title}
          </Link>
          <div className="product-price">₹ {Number(product.price).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
};

export default Products; 