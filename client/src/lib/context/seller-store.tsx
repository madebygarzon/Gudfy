"use client"

import React, { useEffect, useState, useContext } from "react"
import axios from "axios"
import { getStore } from "@modules/account/actions/get-seller-store"

interface SellerStoreContext {
  storeSeller?: store
  handlerGetSellerStore: () => Promise<void>
  isLoadingStore: boolean
  handlerGetListSellerOrder: () => void
  isLoadingOrders: boolean
  listSellerOrders: SellerOrder[]
}
export type SellerOrder = {
  id: string
  person_name: string
  created_at: string
  state_order:
    | "Completado"
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  products: [
    {
      store_variant_order_id: string
      quantity: number
      total_price: number
      produc_title: string
      price: number
    }
  ]
}

type store = {
  id: string
  name: string
  change_name: boolean
  avatar: string
  parameters: {
    numberSales: number
    productCount: number
  }
}

const SellerStoreContext = React.createContext<SellerStoreContext | null>(null)

export const SellerStoreProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [storeSeller, setStoreSeller] = useState<store>()
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true)
  const [listSellerOrders, setListSellerOrder] = useState<SellerOrder[]>([])

  const handlerGetSellerStore = async () => {
    setIsLoadingStore(true)
    getStore().then((data) => {
      setStoreSeller(data)
      setIsLoadingStore(false)
    })
  }

  const handlerGetListSellerOrder = async () => {
    setIsLoadingOrders(true)
    if (storeSeller) {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/seller/store/account/${storeSeller.id}/orders`,
          {
            withCredentials: true,
          }
        )
        .then((e) => {
          setListSellerOrder(e.data)
          setIsLoadingOrders(false)
        })
    }
  }

  return (
    <SellerStoreContext.Provider
      value={{
        storeSeller,
        handlerGetSellerStore,
        isLoadingStore,
        handlerGetListSellerOrder,
        listSellerOrders,
        isLoadingOrders,
      }}
    >
      {children}
    </SellerStoreContext.Provider>
  )
}

export const useSellerStoreGudfy = () => {
  const context = useContext(SellerStoreContext)

  if (context === null) {
    throw new Error("Error en el contexto de la tienda del vendedor")
  }

  return context
}
