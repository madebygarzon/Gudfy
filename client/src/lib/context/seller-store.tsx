"use client"

import React, { useEffect, useState, useContext } from "react"

import { getStore } from "@modules/account/actions/get-seller-store"

interface SellerStoreContext {
  storeSeller?: store
  handlerGetSellerStore: () => Promise<void>
  isLoadingStore: boolean
}

const SellerStoreContext = React.createContext<SellerStoreContext | null>(null)

type store = {
  id: string
  name: string
}

export const SellerStoreProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [storeSeller, setStoreSeller] = useState<store>()
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(true)

  const handlerGetSellerStore = async () => {
    setIsLoadingStore(true)
    getStore().then((data) => {
      setStoreSeller(data)
      setIsLoadingStore(false)
    })
  }

  return (
    <SellerStoreContext.Provider
      value={{ storeSeller, handlerGetSellerStore, isLoadingStore }}
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
