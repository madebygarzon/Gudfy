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
  pay_method_id: string
  created_at: string
  sellerapproved: string
  customerapproved: string
  quantity_products: number
  total_price: string
  person_name: string
  person_last_name: string
  email: string
  conty: string
  city: string
  phone: string
  state_order:
    | "Completado"
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  customer_name: string
  customer_last_name: string
}

type store = {
  id: string
  name: string
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
