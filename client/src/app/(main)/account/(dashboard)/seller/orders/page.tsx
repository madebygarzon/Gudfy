import OrdersTemplate from "@modules/account/templates/seller-orders"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ordenes de vendedor",
  description: "Gestiona tus ventas",
}

export default function Orders() {
  return <OrdersTemplate />
}
