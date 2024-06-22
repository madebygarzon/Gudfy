import { LineItem } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import CartTotals from "@modules/common/components/cart-totals"
import Link from "next/link"

interface lineItem extends LineItem {
  store_variant_id: string
  store: { store_name: string; customer_email: string }
}

type ItemsTemplateProps = {
  items?: lineItem[]
}

const Summary = ({ items }: ItemsTemplateProps) => {
  const handlerTotalPrice = () => {
    let total = 0
    if (items?.length) {
      items?.forEach((item) => {
        total = total + item.unit_price * item.quantity
      })
    }
    return total
  }
  return (
    <div className="grid grid-cols-1 gap-y-6">
      <div className="text-small-regular text-gray-700">
        <div className="flex items-center justify-between text-base-regular text-gray-900 mb-2">
          <span>Subtotal: {handlerTotalPrice()}</span>
          <span></span>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
          <div className="flex items-center justify-between text-base-regular text-gray-900 mb-2">
            <span>Total: {handlerTotalPrice()}</span>
            <span></span>
          </div>
        </div>
        {/* <CartTotals cart={cart} /> */}
        <Link href="/checkout">
          <Button className="rounded-3xl">Ir a pagar</Button>
        </Link>
      </div>
    </div>
  )
}

export default Summary
