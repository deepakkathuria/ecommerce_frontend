import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Footer, Navbar, Product } from "../components"
import SEO from "../components/SEO"

const Products = () => {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
  const subcategoryName = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : ''
  
  const title = category 
    ? `${categoryName}${subcategoryName ? ` - ${subcategoryName}` : ''} Jewelry | Zairi`
    : "Premium Jewelry Collection | Zairi"
  
  const description = category
    ? `Explore our exclusive ${categoryName}${subcategoryName ? ` ${subcategoryName}` : ''} jewelry collection. Handpicked premium pieces, authentic antiques, and unique designs. Shop now at Zairi.`
    : "Discover our premium jewelry and antiques collection. Handpicked authentic pieces, vintage jewelry, and unique collectibles. Shop exclusive jewelry online at Zairi."

  const keywords = category
    ? `${categoryName} jewelry, ${subcategoryName || categoryName} jewelry, antique jewelry, vintage jewelry, ${categoryName} collection, buy ${categoryName} jewelry online`
    : "jewelry, antiques, vintage jewelry, antique jewelry, collectibles, premium jewelry, handmade jewelry, unique jewelry, jewelry store, antique store"

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        url={`https://reactjs-ecommerce-app.vercel.app/product${category ? `?category=${category}` : ''}${subcategory ? `&subcategory=${subcategory}` : ''}`}
        category={category}
      />
      <Navbar />
      <Product />
      <Footer />
    </>
  )
}

export default Products