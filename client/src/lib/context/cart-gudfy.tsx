"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { createContext, useContext, useEffect, useState } from "react"
import { Variant } from "types/medusa"
import { useCart, useCreateLineItem } from "medusa-react"
import axios from "axios"
import { LineItem } from "@medusajs/medusa"

interface variant {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
}

interface lineItem extends LineItem {
  store_id: string
  store: { store_name: string; customer_email: string }
}

interface CartContext {
  existingVariant: validateItemExistence
  listItem: () => void
  items: lineItem[]
  addItem: (
    variant: variant,
    quantity: number,
    storeId: string
  ) => Promise<void>
  createNewCart: () => void
}

type validateItemExistence = {
  variantId: string
  storeId: string
}

export const CartContext = createContext<CartContext | null>(null)

export const CartGudfyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [items, setItems] = useState<lineItem[]>([])
  //Cambiar logica para que apunte al id de storeXVariant
  const [existingVariant, setExistingVariant] = useState<validateItemExistence>(
    {
      storeId: "",
      variantId: "",
    }
  )
  const { cart, createCart } = useCart()

  useEffect(() => {
    if (!items?.length) listItem()
  }, [items])

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

  const listItem = async () => {
    const ListItems = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/cart/items`,
      {
        params: { cartId: cart?.id || localStorage.getItem("cart_id") },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    setItems(ListItems.data.items)
    return
  }

  const validateItemExistence = (itemData: validateItemExistence) => {
    //cambiar por el id de storexvariant
    const existence = items?.find(
      (item) =>
        item.variant_id === itemData.variantId &&
        item.store_id === itemData.storeId
    )

    if (existence) {
      setExistingVariant(itemData)
      return true
    }
    return existence!!
  }

  const addItem = async (
    variant: variant,
    quantity: number,
    storeId: string
  ) => {
    if (!cart) throw new Error("No hay un carro al cual relacionar el producto")
    if (validateItemExistence({ variantId: variant.id, storeId: storeId }))
      return
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
  }

  return (
    <CartContext.Provider
      value={{
        existingVariant,
        items,
        listItem,
        addItem,
        createNewCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartGudfy = () => {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error(
      "useCartDropdown must be used within a CartDropdownProvider"
    )
  }

  return context
}
