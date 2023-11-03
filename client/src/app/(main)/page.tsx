import FeaturedProducts from "@modules/home/components/featured-products"
import { Metadata } from "next"
import SelectedProducts from "@modules/home/components/slector-products"
import Hero from '@modules/home/components/hero'

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Compre todos los gif cards que necesitas. Pagos seguros con criptomonedas .",
}

const Home = () => {
  return (
    <>
      <Hero />
      {/* <Banner /> Borrar para producción */}
      <SelectedProducts />
      <FeaturedProducts />
    </>
  )
}

export default Home
