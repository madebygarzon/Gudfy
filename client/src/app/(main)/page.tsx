import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Compre todos los gif cards que necesitas. Pagos seguros con criptomonedas .",
}

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  )
}

export default Home
