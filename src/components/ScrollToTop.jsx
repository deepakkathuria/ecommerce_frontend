"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = ({ children }) => {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    const isProductDetailPage = pathname.startsWith('/product/') && pathname !== '/product';
    const isProductsListingPage = pathname === '/product' || pathname.startsWith('/product?');
    const wasProductDetailPage = prevPath.startsWith('/product/') && prevPath !== '/product';
    const scrollRestoreFlag = sessionStorage.getItem('scrollRestore') === 'true';

    console.log('📍 ScrollToTop Effect:', {
      prevPath,
      currentPath: pathname,
      isProductDetailPage,
      isProductsListingPage,
      wasProductDetailPage,
      scrollRestoreFlag,
      savedScroll: sessionStorage.getItem('productsScrollPosition')
    });

    // ✅ CRITICAL: Coming back from product detail to products listing - DON'T scroll to top
    // Let Products component handle scroll restoration
    if (wasProductDetailPage && isProductsListingPage && scrollRestoreFlag) {
      console.log('✅✅✅ COMING BACK FROM PRODUCT - NOT SCROLLING TO TOP! Products component will restore scroll');
      prevPathnameRef.current = pathname;
      return; // CRITICAL: Don't scroll to top - let Products component restore
    }

    // ✅ Going to product detail page - scroll to top
    if (isProductDetailPage) {
      console.log('⬆️ Going to product detail - scrolling to top');
      window.scrollTo(0, 0);
    } 
    // ✅ For all other navigation, scroll to top
    else if (prevPath !== pathname && !scrollRestoreFlag) {
      console.log('⬆️ Other navigation - scrolling to top');
      window.scrollTo(0, 0);
    } else if (prevPath !== pathname) {
      console.log('⏸️ Navigation detected but scrollRestore flag is set - skipping scroll to top');
    }

    prevPathnameRef.current = pathname;
  }, [pathname]);

  return children || null;
};

export default ScrollToTop;
