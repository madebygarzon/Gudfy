"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { createContext, useContext, useEffect, useState } from "react"
import { Variant } from "types/medusa"
import { useCart, useCreateLineItem } from "medusa-react"
import axios from "axios"

interface variant {
  id: string
  title: string
  description: string
  thumbnail: string
  productparent: string
  sellers: {
    store_id: string
    store_name: string
    email: string
    amount: number
    price: number
  }
}

interface variantsxstore {
  variant: variant
  sotore_id: string
}

interface CartDropdownContext {
  state: boolean
  open: () => void
  timedOpen: () => void
  close: () => void
  addItem: (
    variantId: variant,
    quantity: number,
    storeId: string
  ) => Promise<void>
  createNewCart: () => void
}

export const CartContext = createContext<CartDropdownContext | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { state, close, open } = useToggleState()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const { cart, createCart } = useCart()

  const createNewCart = () => {
    if (cart) {
      return
    }

    createCart.mutate(
      {},
      {
        onSuccess: ({ cart }) => {
          localStorage.setItem("cart_id", cart.id)
        },
      }
    )
  }

  const addItem = async (
    variant: variant,
    quantity: number,
    storeId: string
  ) => {
    if (!cart) throw new Error("No hay un carro al cal relacionar el producto")
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/add-item`,
      {
        variant: variant,
        quantity: quantity,
        store_id: storeId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  return (
    <CartContext.Provider
      value={{
        state,
        close,
        open: openAndCancel,
        timedOpen,
        addItem,
        createNewCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartDropdown = () => {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error(
      "useCartDropdown must be used within a CartDropdownProvider"
    )
  }

  return context
}
