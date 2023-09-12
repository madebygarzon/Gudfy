import FeaturedProducts from "@modules/home/components/featured-products"
//import Hero from "@modules/home/components/hero"
import Banner from "@modules/home/components/hero/baner_gf"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Compre todos los gif cards que necesitas. Pagos seguros con criptomonedas .",
}

const Home = () => {
  return (
    <>
      {/* <Hero /> */}
      <Banner />
      <FeaturedProducts />
    </>
  )
}

export default Home
