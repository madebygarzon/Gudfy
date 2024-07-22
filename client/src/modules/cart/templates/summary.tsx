import { LineItem } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import CartTotals from "@modules/common/components/cart-totals"
import { postAddOrder } from "../actions/post-addOrder"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

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
      postAddOrder(items).then((e) => {
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
        <Button className="rounded-3xl" onClick={handlerAddOrder}>
          Ir a pagar
        </Button>

        {success && !success.success && success.data.length ? (
          <div className="text-center text-sm text-slate-400 mt-5">
            Algunos productos no tienen stock suficiente
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Summary
