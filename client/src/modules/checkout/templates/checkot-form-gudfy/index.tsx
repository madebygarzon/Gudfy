"use client"

import { useCart } from "medusa-react"
import CheckoutForm from "../../components/checkout-form"

const CheckoutFormGudfy = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div>
      <div>
        <CheckoutForm />
      </div>
    </div>
  )
}

export default CheckoutFormGudfy
