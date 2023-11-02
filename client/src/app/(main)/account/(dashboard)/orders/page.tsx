import OrdersTemplate from "@modules/account/templates/orders-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Gestiona tus compras",
}

export default function Orders() {
  return <OrdersTemplate />
}
