export function formatProductRow(product) {
  let parsedImages = [];
  try {
    parsedImages =
      typeof product.images === "string" ? JSON.parse(product.images) : product.images;
  } catch {
    parsedImages = [];
  }
  return {
    ...product,
    images: parsedImages,
    avg_rating: product.avg_rating ?? null,
  };
}
