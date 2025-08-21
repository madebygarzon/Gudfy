import { Metadata } from "next"
import ProductDigitalSection from "@modules/home/components/productos-digitales"

export const metadata: Metadata = {
  title: "Games Section",
  description: "Explore all of our products.",
}

export default function GifCardSecPage() {
  return <ProductDigitalSection />
}
