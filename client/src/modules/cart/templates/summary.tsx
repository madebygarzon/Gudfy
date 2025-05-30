import { LineItem } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import CartTotals from "@modules/common/components/cart-totals"
import { postAddOrder } from "../actions/post-addOrder"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useMeCustomer } from "medusa-react"
import { formatPrice } from "@lib/util/formatPrice"

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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handlerTotalPrice = () => {
    let total = 0
    if (items?.length) {
      items?.forEach((item) => {
        total = total + item.unit_price * item.quantity
      })
    }
    
    return formatPrice(total)
  }

  const handlerAddOrder = async () => {
    if (items?.length && !isLoading) {
      setIsLoading(true)
      try {
        const e = await postAddOrder(items, customer?.id || "")
        if (!e.success) {
          setSuccess({
            success: e.success,
            data: e.data,
          })
          setModifyProduct(e.data)
        } else {
          router.push(`/checkout?orderid=${e.data.id}`)
        }
      } catch (error) {
        console.error("Error processing order:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <div className="grid grid-cols-1 gap-y-6 p-6 ">
      <div className="text-gray-800">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Total del carrito :
          <span className="font-medium text-gray-900 ml-2">
            $ {handlerTotalPrice()}
          </span>
        </h3>
        {/* <div className="flex items-center justify-between text-lg text-gray-700 mb-4">
          <span>Subtotal:</span>

          <span className="font-medium text-gray-900">
            {handlerTotalPrice(false)}
          </span>
        </div>
        <p className=" text-xs ">
          <strong> ✨Comisión Gudfy Fee: 1%</strong> Esta comisión nos ayuda a
          mantener un servicio seguro, confiable y de alta calidad para todos
          nuestros usuarios.
        </p> */}
        
        <div className="mt-6">
          <Button
            isLoading={isLoading}
            className="w-full rounded-3xl"
            onClick={handlerAddOrder}
           
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
