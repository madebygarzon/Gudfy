import FeaturedProducts from "@modules/home/components/featured-products"
import { Metadata } from "next"
import SelectedProducts from "@modules/home/components/slector-products"
import Banner from "@modules/home/components/banner"
import ProductsTypes from "@modules/home/components/product-types"
import BannerSecondary from "@modules/home/components/banner_secondary"
import FeaturedProductsSecond from "@modules/home/components/featured-products-second"

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Compre todos los gif cards que necesitas. Pagos seguros con criptomonedas .",
}

const Home = () => {
  return (
    <div className="">
      <div>
        <Banner />
      </div>
      <div className=" my-5 h-8">{/* <SelectedProducts /> */} </div>
      <div className="">
        <ProductsTypes />
      </div>
      <div className="">
        <FeaturedProducts />
      </div>
      <div className="">
        <BannerSecondary />
      </div>
      <div className="">
        <FeaturedProductsSecond />
      </div>
    </div>
  )
}

export default Home
