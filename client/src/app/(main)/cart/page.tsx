import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carrito de compras",
  description: "Ver tu carrito de compras",
}

export default function Cart() {
  return <CartTemplate />
}
