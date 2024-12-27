import { LineItem } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import CartTotals from "@modules/common/components/cart-totals"
import { postAddOrder } from "../actions/post-addOrder"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useMeCustomer } from "medusa-react"

interface lineItem
  extends Omit<
    LineItem,
    "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
  > {
  store_variant_id: string

  store: { store_name: string; customer_email: string }
}

type ItemsTemplateProps = {
  items?: lineItem[]
  setModifyProduct: React.Dispatch<React.SetStateAction<string[]>>
}

const Summary = ({ items, setModifyProduct }: ItemsTemplateProps) => {
  const { customer } = useMeCustomer()
  const [success, setSuccess] = useState<{ success: false; data: string[] }>()
  const router = useRouter()
  const handlerTotalPrice = () => {
    let total = 0
    if (items?.length) {
      items?.forEach((item) => {
        total = total + item.unit_price * item.quantity
      })
    }
    return parseFloat(total.toFixed(2))
  }

  const handlerAddOrder = async () => {
    if (items?.length) {
      postAddOrder(items, customer?.id || "").then((e) => {
        if (!e.success) {
          setSuccess({
            success: e.success,
            data: e.data,
          })
          setModifyProduct(e.data)
        } else {
          router.push("/checkout")
        }
      })
    }
  }
  return (
    <div className="grid grid-cols-1 gap-y-6 p-6">
      <div className="text-gray-800">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Total del carrito
        </h3>
        <div className="flex items-center justify-between text-lg text-gray-700 mb-4">
          <span>Subtotal:</span>
          <span className="font-medium text-gray-900">
            {handlerTotalPrice()}
          </span>
        </div>
        <div className="flex items-center justify-between text-lg text-gray-700 mb-4">
        </div>

        <div className="h-px w-full border-t border-gray-300 my-4"></div>
        <div className="flex items-center justify-between text-lg text-gray-700">
          <span className="font-medium ">Total:</span>
          <span className="text-lg font-semibold">{handlerTotalPrice()}</span>
        </div>
        <div className="mt-6">
          <Button
            className="w-full rounded-3xl"
            onClick={handlerAddOrder}
            disabled={!customer}
          >
            Ir a pagar
          </Button>
        </div>
        {success && !success.success && success.data.length ? (
          <div className="text-center text-sm text-red-500 mt-5">
            Algunos productos no tienen stock suficiente
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Summary
