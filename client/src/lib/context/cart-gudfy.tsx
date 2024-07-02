"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { createContext, useContext, useEffect, useState } from "react"
import { Variant } from "types/medusa"
import { useCart, useCreateLineItem } from "medusa-react"
import axios from "axios"
import { Cart, LineItem } from "@medusajs/medusa"

interface variant {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
}

interface lineItem
  extends Omit<
    LineItem,
    "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
  > {
  store_variant_id: string
  store: { store_name: string; customer_email: string }
}

interface CartContext {
  existingVariant: string
  listItem: () => void
  items: lineItem[]
  addItem: (
    variant: variant,
    quantity: number,
    storeVariantId: string
  ) => Promise<void>
  createNewCart: () => void
  deleteLineItem: (lineItemId: string) => void
  updateLineItem: (lineItemId: string, quantity: number) => void
}

type validateItemExistence = {
  variantId: string
  storeId: string
}

export const CartContext = createContext<CartContext | null>(null)
let auxCreateCart = false

export const CartGudfyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [items, setItems] = useState<lineItem[]>([])
  //Cambiar logica para que apunte al id de storeXVariant
  const [existingVariant, setExistingVariant] = useState<string>("")
  const [cart, setCart] = useState<Cart>()

  useEffect(() => {
    if (!auxCreateCart) {
      auxCreateCart = true
      retriveCart()
    }
  }, [cart])

  const retriveCart = async () => {
    const id = localStorage.getItem("cart_id")
    await axios
      .get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const { cart } = response.data
        setCart(cart)
      })
      .catch(async (error) => {
        await createNewCart()
      })
  }

  const createNewCart = async () => {
    auxCreateCart = true
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        const { cart } = response.data
        localStorage.setItem("cart_id", cart.id)
        setCart(cart)
      })
      .catch((error) => {
        console.error("Error al crear el carro:", error)
      })
  }

  const listItem = async () => {
    const dataCartId = cart?.id || localStorage.getItem("cart_id")
    if (dataCartId) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/cart/items`, {
          params: { cartId: dataCartId },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((data) => {
          setItems(data.data.items)
        })
    }
    return
  }

  const deleteLineItem = async (lineItemId: string) => {
    if (cart && cart.id) {
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/line-items/${lineItemId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          const { cart } = response.data

          setCart(cart)
          setItems((old) => {
            const dataFilter = old.filter((i) => i.id !== lineItemId)
            return dataFilter
          })
        })
        .catch((error) => {
          console.error("Error deleting line item:", error)
        })
    }
  }
  const updateLineItem = (lineItemId: string, quantity: number) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store//cart/update-item`,
        {
          itemId: lineItemId,
          quantity: quantity,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        const newItem: lineItem[] = items.map((item) => {
          if (item.id === lineItemId) {
            return { ...item, quantity: quantity }
          }
          return item
        })
        setItems(newItem)
      })
      .catch((error) => {
        console.error("Error updating line item:", error)
      })
  }

  const validateItemExistence = (storeVariantId: string) => {
    const existence = items?.find(
      (item) => item.store_variant_id === storeVariantId
    )

    if (existence) {
      setExistingVariant(storeVariantId)
      return true
    }
    return existence!!
  }

  const addItem = async (
    variant: variant,
    quantity: number,
    storeVariantId: string
  ) => {
    if (!cart) throw new Error("No hay un carro al cual relacionar el producto")

    if (validateItemExistence(storeVariantId)) return
    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/add-item`,
        {
          variant: variant,
          quantity: quantity,
          store_variant_id: storeVariantId,
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
        deleteLineItem,
        updateLineItem,
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
