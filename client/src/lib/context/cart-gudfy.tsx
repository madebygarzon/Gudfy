"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { createContext, useContext, useEffect, useState } from "react"
import { Variant } from "types/medusa"
import { useCart, useCreateLineItem } from "medusa-react"
import axios from "axios"
<<<<<<< HEAD
=======
import { LineItem } from "@medusajs/medusa"
>>>>>>> origin/devCarlos

interface variant {
  id: string
  title: string
  description: string
  thumbnail: string
<<<<<<< HEAD
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
=======
  price: number
}

interface lineItem extends LineItem {
  store: { store_name: string; customer_email: string }
>>>>>>> origin/devCarlos
}

interface CartDropdownContext {
  state: boolean
  open: () => void
  timedOpen: () => void
  close: () => void
<<<<<<< HEAD
  addItem: (
    variantId: variant,
=======
  listItem: () => void
  items: lineItem[]
  addItem: (
    variant: variant,
>>>>>>> origin/devCarlos
    quantity: number,
    storeId: string
  ) => Promise<void>
  createNewCart: () => void
}

export const CartContext = createContext<CartDropdownContext | null>(null)

<<<<<<< HEAD
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
=======
export const CartGudfyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
>>>>>>> origin/devCarlos
  const { state, close, open } = useToggleState()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
<<<<<<< HEAD
=======
  const [items, setItems] = useState<lineItem[]>([])
>>>>>>> origin/devCarlos
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

<<<<<<< HEAD
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
=======
  const listItem = async () => {
    if (!cart) throw new Error("No hay un carro")
    const ListItems = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/cart/items`,
      {
        params: { cartId: cart.id },
>>>>>>> origin/devCarlos
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
<<<<<<< HEAD
=======
    console.log("Datos buscados", cart)
    setItems(ListItems.data.items)
    return
  }

  const addItem = async (
    variant: variant,
    quantity: number,
    storeId: string
  ) => {
    //Cre
    if (!cart) throw new Error("No hay un carro al cual relacionar el producto")
    const response = await axios
      .post(
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
      .then((e) => {
        listItem()
      })
>>>>>>> origin/devCarlos
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
<<<<<<< HEAD
=======
        items,
        listItem,
>>>>>>> origin/devCarlos
        addItem,
        createNewCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

<<<<<<< HEAD
export const useCartDropdown = () => {
=======
export const useCartGudfyDropdown = () => {
>>>>>>> origin/devCarlos
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error(
      "useCartDropdown must be used within a CartDropdownProvider"
    )
  }

  return context
}
