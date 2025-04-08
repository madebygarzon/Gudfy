import CheckoutTemplate from "@modules/checkout/templates"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
}

export default function Checkout({
  searchParams,
}: {
  searchParams: { orderid?: string }
}) {
  const orderId = searchParams.orderid
  return <CheckoutTemplate orderId={orderId} />
}
