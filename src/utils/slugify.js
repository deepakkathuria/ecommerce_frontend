/**
 * Convert a string to a URL-friendly slug
 * Example: "INFINITY LOOP HOOPS" -> "infinity-loop-hoops"
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Generate a product URL slug
 * Combines product name with ID for uniqueness and API compatibility
 * Example: "INFINITY LOOP HOOPS" + ID 95 -> "infinity-loop-hoops-95"
 * This ensures:
 * 1. SEO-friendly URLs with product name
 * 2. Unique URLs (even if product names are similar)
 * 3. Easy ID extraction for API calls
 */
export const generateProductSlug = (productName, productId = '') => {
  const nameSlug = slugify(productName);
  if (!nameSlug) return productId ? `product-${productId}` : 'product';
  
  // Always include ID for uniqueness and API compatibility
  return productId ? `${nameSlug}-${productId}` : nameSlug;
};

/**
 * Extract product ID from slug if it's in format "name-id"
 * Otherwise returns the slug as-is
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  
  // Check if slug ends with a number (ID)
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
};

