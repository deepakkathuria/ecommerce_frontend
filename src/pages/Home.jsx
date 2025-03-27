import { Navbar, Main, Product,Footer } from "../components";
import TrendingProducts from "../components/TrendingProducts";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <TrendingProducts />

      {/* <Product /> */}
      <Footer />
    </>
  )
}

export default Home