import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import { isTokenExpired } from "../utils/isTokenExpired";

const Navbar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState({});
  const [categoryMenuData, setCategoryMenuData] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const state = useSelector((state) => state.handleCart);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const categoryDropdownRef = useRef(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  const token = localStorage.getItem("apitoken");
  const [isLoggedIn, setIsLoggedIn] = useState(token && !isTokenExpired(token));

  // Get current active category from URL
  const getCurrentCategory = () => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category')?.toLowerCase() || null;
    console.log('🔍 getCurrentCategory - URL:', location.search, 'Category:', category);
    return category;
  };

  // Fetch categories and subcategories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/products?limit=1000");
        const result = await response.json();
        
        if (result.rows) {
          const categoryMap = {};
          const jewelleryMaterialMap = {}; // ✅ NEW: Map to store material -> subcategories for jewellery
          
          result.rows.forEach((item) => {
            const category = item.category?.toLowerCase().trim();
            if (category) {
              if (!categoryMap[category]) {
                categoryMap[category] = new Set();
              }
              if (item.subcategory) {
                categoryMap[category].add(item.subcategory.toLowerCase().trim());
              }
              
              // ✅ NEW: For jewellery category, group by material and subcategory
              if (category.toLowerCase() === 'jewellery' && item.material && item.subcategory) {
                const material = item.material.toLowerCase().trim();
                const subcategory = item.subcategory.toLowerCase().trim();
                
                if (!jewelleryMaterialMap[material]) {
                  jewelleryMaterialMap[material] = new Set();
                }
                jewelleryMaterialMap[material].add(subcategory);
              }
            }
          });
          
          // Convert Sets to Arrays and sort
          const formattedCategories = {};
          Object.keys(categoryMap).forEach((cat) => {
            formattedCategories[cat] = Array.from(categoryMap[cat]).sort();
          });
          
          setCategories(formattedCategories);

          // Build menu structure for navigation
          // Group subcategories into columns (sections) for better display
          const menuStructure = {};
          Object.keys(formattedCategories).forEach((category) => {
            const subcats = formattedCategories[category];
            if (subcats.length > 0) {
              // ✅ For jewellery category: Dynamically show materials and their subcategories
              if (category.toLowerCase() === 'jewellery') {
                const sections = [];
                
                // ✅ Get all materials that exist in the database
                const materials = Object.keys(jewelleryMaterialMap);
                
                // ✅ Sort materials: antitarnish first, then brass, then others
                const sortedMaterials = materials.sort((a, b) => {
                  if (a === 'antitarnish') return -1;
                  if (b === 'antitarnish') return 1;
                  if (a === 'brass') return -1;
                  if (b === 'brass') return 1;
                  return a.localeCompare(b);
                });
                
                sortedMaterials.forEach((material) => {
                  // ✅ Get subcategories that exist for this material
                  const materialSubcats = Array.from(jewelleryMaterialMap[material]).sort();
                  
                  if (materialSubcats.length > 0) {
                    // ✅ Format material name (capitalize first letter, uppercase)
                    const materialDisplayName = material
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toUpperCase())
                      .join(' ');
                    
                    sections.push({
                      title: materialDisplayName,
                      isMaterial: true,
                      material: material,
                      subcategories: materialSubcats.map(subcat => ({
                        displayName: subcat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                        key: subcat
                      }))
                    });
                  }
                });
                
                menuStructure[category] = {
                  sections: sections
                };
              } else {
                // For other categories: Show subcategories directly
                const sections = [];
                subcats.forEach((subcat) => {
                  const displayName = subcat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  sections.push({
                    title: displayName,
                    items: [displayName],
                    subcategoryKeys: [subcat]
                  });
                });

                menuStructure[category] = {
                  sections: sections
                };
              }
            }
          });

          setCategoryMenuData(menuStructure);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      const token = localStorage.getItem("apitoken");
      if (!token || isTokenExpired(token)) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.items && Array.isArray(data.items)) {
          setWishlistCount(data.items.length);
        } else if (response.ok && Array.isArray(data)) {
          setWishlistCount(data.length);
        } else {
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();

    // Listen for wishlist updates (custom event)
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      setIsLoggedIn(false);
      setWishlistCount(0);
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setHoveredCategory(null);
      }
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await fetch("https://hammerhead-app-jkdit.ondigitalocean.app/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("apitoken");
      dispatch(clearCart());
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // ✅ Show loading/feedback when searching
      const searchTerm = searchQuery.trim();
      console.log("🔍 Searching for:", searchTerm);
      
      // Navigate to products page with search
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(e);
    }
  };

  const handleSearchIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSearch(e);
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <style>{`
        .navbar-custom {
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          z-index: 1000;
          position: sticky;
          top: 0;
        }

        .navbar-logo {
          height: auto;
          width: auto;
        }

        .zairi-logo {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: 0px;
          color: #000;
          text-decoration: none;
          line-height: 1;
          display: inline-block;
          font-style: normal;
        }

        .zairi-logo:hover {
          color: #000;
          text-decoration: none;
        }

        .nav-category-link {
          text-decoration: none;
          color: #000;
          font-weight: 400;
          font-size: 14px;
          padding: 20px 15px;
          display: inline-block;
          position: relative;
          transition: all 0.2s;
        }

        .nav-category-link:hover {
          color: #000;
          font-weight: 400;
        }

        .nav-category-link.active {
          color: #000;
          font-weight: 700;
        }

        .nav-category-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 15px;
          right: 15px;
          height: 2px;
          background: #000;
        }

        .search-bar-container {
          flex: 1;
          max-width: 500px;
          margin: 0 20px;
        }

        .search-bar {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 1px solid #f5f5f6;
          border-radius: 4px;
          font-size: 14px;
          background: #f5f5f6;
          transition: all 0.2s;
        }

        .search-bar:focus {
          outline: none;
          background: #fff;
          border-color: #eaeaec;
        }

        .search-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #696e79;
          cursor: pointer;
        }

        .nav-icon-link {
          text-decoration: none;
          color: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-icon-link:hover {
          color: #333;
        }

        .nav-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .category-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid #eaeaec;
          min-width: 600px;
          max-width: 800px;
          max-height: 500px;
          overflow-y: auto;
          z-index: 10000;
          padding: 30px 20px;
          display: flex;
          gap: 0;
        }

        .category-dropdown-column {
          flex: 1;
          padding: 0 20px;
          border-right: 1px solid #f0f0f0;
        }

        .category-dropdown-column:last-child {
          border-right: none;
        }

        .category-dropdown-section {
          margin-bottom: 0;
        }

        .material-section-wrapper {
          width: 100%;
        }

        .category-dropdown-title {
          font-weight: 700;
          font-size: 14px;
          color: #000;
          margin-bottom: 12px;
          text-transform: uppercase;
          text-decoration: none;
          display: block;
          padding: 6px 0;
          transition: color 0.2s;
        }

        .category-dropdown-title:hover {
          color: #333;
        }

        .material-title {
          cursor: default;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;
        }

        .material-subcategories {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .category-dropdown-subitem {
          display: block;
          padding: 8px 0 8px 0;
          font-size: 13px;
          font-weight: 400;
          color: #282c3f;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }

        .category-dropdown-subitem:hover {
          color: #000;
          font-weight: 500;
          padding-left: 5px;
        }

        .category-dropdown-item {
          display: block;
          color: #282c3f;
          font-size: 14px;
          padding: 6px 0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .category-dropdown-item:hover {
          color: #000;
          font-weight: 600;
        }

        .category-dropdown-divider {
          height: 1px;
          background: #eaeaec;
          margin: 15px 0;
        }

        .profile-dropdown {
          position: relative;
        }

        .profile-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid #eaeaec;
          min-width: 200px;
          z-index: 10000;
          margin-top: 5px;
          padding: 10px 0;
        }

        .profile-dropdown-item {
          display: block;
          padding: 10px 20px;
          color: #282c3f;
          text-decoration: none;
          font-size: 14px;
          transition: background 0.2s;
        }

        .profile-dropdown-item:hover {
          background: #f5f5f6;
        }

        .badge-custom {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }

        @media (max-width: 991px) {
          .category-dropdown {
            min-width: 100%;
            max-width: 100%;
            left: 0 !important;
          }

          .search-bar-container {
            margin: 10px 0;
            max-width: 100%;
          }

          .zairi-logo {
            font-size: 36px;
          }
        }

        @media (max-width: 576px) {
          .zairi-logo {
            font-size: 28px;
          }
        }

        /* Mobile Menu Overlay Styles */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          overflow-y: auto;
        }

        .mobile-menu-content {
          background: #fff;
          min-height: 100vh;
          padding: 20px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .zairi-logo-mobile {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0px;
          color: #000;
          text-decoration: none;
          line-height: 1;
        }

        .zairi-logo-mobile:hover {
          color: #000;
          text-decoration: none;
        }

        .mobile-action-btn {
          flex: 1;
          min-width: calc(33.333% - 10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 10px;
          background: #fff;
          border: 1px solid #eaeaec;
          border-radius: 8px;
          text-decoration: none;
          color: #282c3f;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mobile-action-btn:hover {
          background: #f5f5f6;
          border-color: #d4d5d9;
          color: #282c3f;
          text-decoration: none;
        }

        .mobile-action-btn i {
          font-size: 20px;
          color: #696e79;
        }

        .mobile-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          padding: 0 5px;
        }

        .mobile-categories {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-category-btn {
          width: 100%;
          padding: 14px 20px;
          background: #fff;
          border: 2px solid #000;
          border-radius: 8px;
          color: #000;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-category-btn:hover {
          background: #000;
          color: #fff;
          text-decoration: none;
        }

        .mobile-category-btn .fa-chevron-down {
          font-size: 12px;
          transition: transform 0.3s;
        }

        .mobile-category-btn.expanded .fa-chevron-down {
          transform: rotate(180deg);
        }

        .mobile-subcategories {
          padding-left: 0;
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-left: 0;
          margin-top: 8px;
        }

        .mobile-material-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 4px;
        }

        .mobile-material-title {
          font-weight: 700;
          font-size: 13px;
          color: #000;
          padding: 8px 15px;
          text-transform: uppercase;
          background: #f8f8f8;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .mobile-material-subcategories {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-left: 15px;
        }

        .mobile-subcategory-btn {
          padding: 10px 15px;
          background: #f5f5f6;
          border: 1px solid #eaeaec;
          border-radius: 6px;
          color: #282c3f;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          text-transform: uppercase;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }

        .mobile-subcategory-btn:hover {
          background: #eaeaec;
          border-color: #d4d5d9;
          color: #000;
          text-decoration: none;
        }

        @media (max-width: 576px) {
          .mobile-menu-content {
            padding: 15px;
          }

          .mobile-action-btn {
            min-width: calc(33.333% - 8px);
            padding: 12px 8px;
            font-size: 12px;
          }

          .mobile-action-btn i {
            font-size: 18px;
          }

          .zairi-logo-mobile {
            font-size: 28px;
          }
        }
      `}</style>

      {/* Main Navbar */}
      <nav className="navbar-custom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100" style={{ minHeight: '80px' }}>
            {/* Logo - ZARA Style */}
            <NavLink to="/" className="zairi-logo d-none d-md-inline-block" style={{ marginRight: '50px' }}>
              ZAIRI
            </NavLink>
            <NavLink to="/" className="zairi-logo d-md-none" style={{ marginRight: '20px' }}>
              ZAIRI
            </NavLink>

            {/* Category Navigation */}
            <div 
              className="d-none d-lg-flex align-items-center position-relative"
              ref={categoryDropdownRef}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {Object.keys(categories).length > 0 && Object.keys(categories)
                .filter(category => category.toLowerCase() !== 'bags' && category.toLowerCase() !== 'bag')
                .map((category) => {
                  const categoryDisplayName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toUpperCase();
                  const currentCategory = getCurrentCategory();
                  const categoryLower = category.toLowerCase();
                  const isActive = currentCategory === categoryLower;
                  
                  console.log('📌 Category Check:', {
                    category: category,
                    categoryLower: categoryLower,
                    currentCategory: currentCategory,
                    isActive: isActive,
                    className: `nav-category-link ${isActive ? 'active' : ''}`
                  });
                  
                  return (
                    <NavLink
                      key={category}
                      to={`/product?category=${category}`}
                      end={false}
                      className={({ isActive: navLinkActive }) => {
                        // Ignore NavLink's isActive, use our custom logic based on URL params
                        const shouldBeActive = getCurrentCategory() === categoryLower;
                        console.log('🔗 NavLink className:', { 
                          category, 
                          navLinkActive, 
                          shouldBeActive, 
                          currentCategory: getCurrentCategory(),
                          categoryLower,
                          final: `nav-category-link ${shouldBeActive ? 'active' : ''}` 
                        });
                        // Only return our custom active class, ignore NavLink's active
                        return `nav-category-link ${shouldBeActive ? 'active' : ''}`;
                      }}
                      onMouseEnter={() => setHoveredCategory(category)}
                      onClick={() => navigate(`/product?category=${category}`)}
                    >
                      {categoryDisplayName}
                    </NavLink>
                  );
                })}
              
              {/* Static ACCESSORIES Link - Empty for now */}
              <NavLink
                to="/product?category=accessories"
                end={false}
                className={({ isActive: navLinkActive }) => {
                  // Ignore NavLink's isActive, use our custom logic based on URL params
                  const shouldBeActive = getCurrentCategory() === 'accessories';
                  console.log('🔗 ACCESSORIES NavLink className:', { 
                    navLinkActive, 
                    shouldBeActive, 
                    currentCategory: getCurrentCategory(),
                    final: `nav-category-link ${shouldBeActive ? 'active' : ''}` 
                  });
                  // Only return our custom active class, ignore NavLink's active
                  return `nav-category-link ${shouldBeActive ? 'active' : ''}`;
                }}
                onClick={() => navigate('/product?category=accessories')}
              >
                ACCESSORIES
              </NavLink>

              {/* Category Dropdown */}
              {hoveredCategory && categoryMenuData[hoveredCategory] && categoryMenuData[hoveredCategory].sections && (
                <div className="category-dropdown" onMouseEnter={() => setHoveredCategory(hoveredCategory)}>
                  {categoryMenuData[hoveredCategory].sections.map((section, idx) => (
                    <div key={idx} className="category-dropdown-column">
                      <div className="category-dropdown-section">
                        {section.isMaterial ? (
                          // ✅ Material section with subcategories nested under it
                          <div className="material-section-wrapper">
                            <div className="category-dropdown-title material-title">
                              {section.title}
                            </div>
                            <div className="material-subcategories">
                              {section.subcategories && section.subcategories.map((subcat, subIdx) => (
                                <NavLink
                                  key={subIdx}
                                  to={`/product?category=${hoveredCategory}&material=${section.material}&subcategory=${subcat.key}`}
                                  className="category-dropdown-subitem"
                                  onClick={() => setHoveredCategory(null)}
                                >
                                  {subcat.displayName}
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Regular subcategory link (for non-jewellery categories)
                          <NavLink
                            to={`/product?category=${hoveredCategory}&subcategory=${section.subcategoryKeys[0]}`}
                            className="category-dropdown-title"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {section.title}
                          </NavLink>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar - Desktop */}
            <div className="d-none d-lg-block search-bar-container position-relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <span className="search-icon" onClick={handleSearchIconClick}>
                  <i className="fa fa-search"></i>
                </span>
              </form>
            </div>

            {/* Right Side Actions - Desktop Only */}
            <div className="d-none d-lg-flex align-items-center gap-4 ms-auto">
              {/* Profile */}
              {isLoggedIn ? (
                <div className="profile-dropdown">
                  <NavLink
                    to="/profile"
                    className="nav-icon-link"
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  >
                    <i className="fa fa-user nav-icon"></i>
                    <span>Profile</span>
                  </NavLink>
                  {isProfileDropdownOpen && (
                    <div 
                      className="profile-dropdown-menu"
                      onMouseLeave={() => setIsProfileDropdownOpen(false)}
                    >
                      <NavLink to="/profile" className="profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                        My Profile
                      </NavLink>
                      <NavLink to="/profile/orders" className="profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                        My Orders
                      </NavLink>
                      <NavLink to="/profile/settings" className="profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                        Settings
                      </NavLink>
                      <hr style={{ margin: '10px 0' }} />
                      <button 
                        className="profile-dropdown-item w-100 text-start border-0 bg-transparent"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" className="nav-icon-link">
                  <i className="fa fa-user nav-icon"></i>
                  <span>Profile</span>
                </NavLink>
              )}

              {/* Wishlist */}
              {isLoggedIn ? (
                <NavLink to="/wishlist" className="nav-icon-link position-relative">
                  <i className="fa fa-heart nav-icon"></i>
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="badge-custom">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>
              ) : (
                <NavLink to="/login" className="nav-icon-link">
                  <i className="fa fa-heart nav-icon"></i>
                  <span>Wishlist</span>
                </NavLink>
              )}

              {/* Bag */}
              {isLoggedIn ? (
                <NavLink to="/cart" className="nav-icon-link position-relative">
                  <i className="fa fa-shopping-bag nav-icon"></i>
                  <span>Bag</span>
                  {state.length > 0 && (
                    <span className="badge-custom">
                      {state.reduce((total, item) => total + (item.qty || 1), 0)}
                    </span>
                  )}
                </NavLink>
              ) : (
                <NavLink to="/login" className="nav-icon-link">
                  <i className="fa fa-shopping-bag nav-icon"></i>
                  <span>Bag</span>
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Toggle - Visible on Mobile */}
            <button
              className="navbar-toggler border-0 d-lg-none ms-auto"
              type="button"
              onClick={toggleMobileMenu}
              style={{ 
                background: 'transparent',
                padding: '5px 10px',
                fontSize: '24px',
                color: '#000'
              }}
            >
              <i className={`fa ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              {/* Header with Logo and Close */}
              <div className="d-flex align-items-center justify-content-between mb-4" style={{ paddingBottom: '15px', borderBottom: '1px solid #eaeaec' }}>
                <NavLink to="/" className="zairi-logo-mobile" onClick={toggleMobileMenu}>
                  ZAIRI
                </NavLink>
                <button
                  type="button"
                  className="btn-close-mobile"
                  onClick={toggleMobileMenu}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#000',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      border: '1px solid #eaeaec',
                      borderRadius: '4px',
                      padding: '10px 15px'
                    }}
                  />
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    style={{
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0'
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>

              {/* Mobile Menu Actions */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {/* Profile */}
                {isLoggedIn ? (
                  <NavLink 
                    to="/profile" 
                    className="mobile-action-btn"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-user"></i>
                    <span>Profile</span>
                  </NavLink>
                ) : (
                  <NavLink 
                    to="/login" 
                    className="mobile-action-btn"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-user"></i>
                    <span>Profile</span>
                  </NavLink>
                )}

                {/* Wishlist */}
                {isLoggedIn ? (
                  <NavLink 
                    to="/wishlist" 
                    className="mobile-action-btn position-relative"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-heart"></i>
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="mobile-badge">
                        {wishlistCount}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <NavLink 
                    to="/login" 
                    className="mobile-action-btn"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-heart"></i>
                    <span>Wishlist</span>
                  </NavLink>
                )}

                {/* Bag */}
                {isLoggedIn ? (
                  <NavLink 
                    to="/cart" 
                    className="mobile-action-btn position-relative"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-shopping-bag"></i>
                    <span>Bag</span>
                    {state.length > 0 && (
                      <span className="mobile-badge">
                        {state.reduce((total, item) => total + (item.qty || 1), 0)}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <NavLink 
                    to="/login" 
                    className="mobile-action-btn"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fa fa-shopping-bag"></i>
                    <span>Bag</span>
                  </NavLink>
                )}
              </div>

              <hr style={{ margin: '20px 0', borderColor: '#eaeaec' }} />

              {/* Categories */}
              <div className="mobile-categories">
                {Object.keys(categories).filter(category => category.toLowerCase() !== 'bags' && category.toLowerCase() !== 'bag').map((category) => {
                  const categoryDisplayName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toUpperCase();
                  const hasSubcategories = categoryMenuData[category] && categoryMenuData[category].sections && categoryMenuData[category].sections.length > 0;
                  const isExpanded = expandedCategory === category;
                  
                  return (
                    <div key={category} className="mb-2">
                      <div
                        className={`mobile-category-btn ${isExpanded ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasSubcategories) {
                            setExpandedCategory(isExpanded ? null : category);
                          } else {
                            navigate(`/product?category=${category}`);
                            toggleMobileMenu();
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>{categoryDisplayName}</span>
                        {hasSubcategories && (
                          <i className="fa fa-chevron-down"></i>
                        )}
                      </div>
                      
                      {/* Subcategories */}
                      {isExpanded && hasSubcategories && (
                        <div className="mobile-subcategories">
                          {categoryMenuData[category].sections.map((section, idx) => {
                            // ✅ For jewellery: Show materials with nested subcategories
                            if (section.isMaterial && category.toLowerCase() === 'jewellery') {
                              return (
                                <div key={idx} className="mobile-material-section">
                                  <div className="mobile-material-title">
                                    {section.title}
                                  </div>
                                  <div className="mobile-material-subcategories">
                                    {section.subcategories && section.subcategories.map((subcat, subIdx) => (
                                      <NavLink
                                        key={subIdx}
                                        to={`/product?category=${category}&material=${section.material}&subcategory=${subcat.key}`}
                                        className="mobile-subcategory-btn"
                                        onClick={toggleMobileMenu}
                                      >
                                        {subcat.displayName}
                                      </NavLink>
                                    ))}
                                  </div>
                                </div>
                              );
                            } else {
                              // For other categories: Show subcategories directly
                              return (
                                <NavLink
                                  key={idx}
                                  to={`/product?category=${category}&subcategory=${section.subcategoryKeys[0]}`}
                                  className="mobile-subcategory-btn"
                                  onClick={toggleMobileMenu}
                                >
                                  {section.title}
                                </NavLink>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Accessories Link */}
                <NavLink 
                  to="/product?category=accessories" 
                  className="mobile-category-btn" 
                  onClick={toggleMobileMenu}
                >
                  <span>ACCESSORIES</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
