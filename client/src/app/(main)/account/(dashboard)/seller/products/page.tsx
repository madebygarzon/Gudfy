import TemplateProduct from "@modules/account/templates/seller-products"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seller",
  description: "Vende tus productos ",
}

export default function Profile() {
  return <TemplateProduct />
}
