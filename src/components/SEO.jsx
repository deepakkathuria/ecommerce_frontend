import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Zairi - Premium Jewelry & Antiques Collection",
  description = "Discover exquisite jewelry, antiques, and unique collectibles at Zairi. Handpicked premium pieces for every story. Shop now for authentic jewelry and vintage antiques.",
  keywords = "jewelry, antiques, vintage jewelry, antique jewelry, collectibles, premium jewelry, handmade jewelry, unique jewelry, jewelry store, antique store, vintage collectibles, jewelry online, buy jewelry, jewelry shop",
  image = "https://i.ibb.co/fQ293tm/image.png",
  url = "https://reactjs-ecommerce-app.vercel.app",
  type = "website",
  product = null, // For product pages
  category = null, // For category pages
}) => {
  // Default site name
  const siteName = "Zairi";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Product-specific structured data (JSON-LD)
  const productStructuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name || product.title,
        description: product.description || description,
        image: product.image || (product.images && product.images[0]) || image,
        brand: {
          "@type": "Brand",
          name: siteName,
        },
        offers: {
          "@type": "Offer",
          url: `${url}/product/${product.id}`,
          priceCurrency: "INR",
          price: product.price || "0",
          availability: product.stock_quantity > 0 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: product.avg_rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.avg_rating,
              reviewCount: product.ratings_length || 1,
            }
          : undefined,
      }
    : null;

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: url,
    logo: image,
    description: "Premium jewelry and antiques collection",
    sameAs: [
      // Add your social media links here
      // "https://www.facebook.com/zairi",
      // "https://www.instagram.com/zairi",
    ],
  };

  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/product?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Breadcrumb structured data for product pages
  const breadcrumbStructuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${url}/product`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name || product.title,
            item: `${url}/product/${product.id}`,
          },
        ],
      }
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Zairi" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <link rel="canonical" href={url} />

      {/* Structured Data - JSON-LD */}
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

