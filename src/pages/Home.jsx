import { Navbar, Main, Product, Footer } from "../components";
import TrendingProducts from "../components/TrendingProducts";
import SEO from "../components/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Zairi - Premium Jewelry & Antiques Collection"
        description="Discover exquisite jewelry, antiques, and unique collectibles at Zairi. Handpicked premium pieces for every story. Shop authentic vintage jewelry and antique collectibles online."
        keywords="jewelry, antiques, vintage jewelry, antique jewelry, collectibles, premium jewelry, handmade jewelry, unique jewelry, jewelry store, antique store, vintage collectibles, jewelry online, buy jewelry, jewelry shop, antique shop"
        url="https://zairi.in"
      />
      <Navbar />
      <Main />
      <TrendingProducts />

      {/* <Product /> */}
      <Footer />
    </>
  )
}

export default Home