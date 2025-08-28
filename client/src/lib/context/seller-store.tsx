"use client"

import React, { useEffect, useState, useContext } from "react"
import axios from "axios"
import { getStore } from "@modules/account/actions/get-seller-store"

interface SellerStoreContext {
  storeSeller?: store
  handlerGetSellerStore: () => Promise<void>
  isLoadingStore: boolean
  handlerGetListSellerOrder: (options?: { page?: number; limit?: number; status?: string; search?: string }) => void
  loadOrdersPage: (page: number) => void
  isLoadingOrders: boolean
  dataOrders: SellerOrder[]
  loadedPages: Set<number>
  totalCount: number
  currentPage: number
  totalPages: number
  pageLimit: number
  setPageLimit: (limit: number) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  handlerLowStock: () => void
  notificateLowStock: lowStock
  listSellerOrders: SellerOrder[]
}
export type SellerOrder = {
  id: string
  person_name: string
  created_at: string
  state_order:
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  products: [
    {
      store_variant_order_id: string
      variant_order_status_id: string
      quantity: number
      total_price: number
      produc_title: string
      price: number
      serial_code_products: [{ id: string; serial: string }] | []
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

type lowStock = {
  store_x_variant_id: string[]
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
  const [notificateLowStock, setNotificateLowStock] = useState<lowStock>({
    store_x_variant_id: []
  })
  const [dataOrders, setDataOrders] = useState<SellerOrder[]>([])
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [pageLimit, setPageLimit] = useState<number>(50)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const [listSellerOrders, setListSellerOrder] = useState<SellerOrder[]>([])

  const handlerGetSellerStore = async () => {
    setIsLoadingStore(true)
    const store = await getStore()
    setStoreSeller(store)
    
    setIsLoadingStore(false)

    return store
  }

  const handlerGetListSellerOrder = async (options: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    let store_id = storeSeller
    if (!store_id) {
      store_id = await handlerGetSellerStore()
    }
    setIsLoadingOrders(true)
    if (store_id) {
      const { page = 1, limit = pageLimit, status = statusFilter, search = searchTerm } = options
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())
      if (status && status !== 'all') {
        queryParams.append('status', status)
      }
      if (search && search.trim()) {
        queryParams.append('search', search.trim())
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/seller/store/account/${store_id.id}/orders?${queryParams.toString()}`,
          {
            withCredentials: true,
          }
        )
        
        const { data, totalCount: total, totalPages: pages } = response.data
        
        setDataOrders(data)
        setLoadedPages(new Set([page]))
        setTotalCount(total)
        setTotalPages(pages)
        setCurrentPage(page)
        
        if (page === 1) {
          setListSellerOrder(data)
        }
        
        setIsLoadingOrders(false)
      } catch (error) {
        console.error('Error loading seller orders:', error)
        setIsLoadingOrders(false)
      }
    }
  }

  const loadOrdersPage = async (page: number) => {
    await handlerGetListSellerOrder({ 
      page, 
      limit: pageLimit, 
      status: statusFilter, 
      search: searchTerm 
    })
  }

  const handlerLowStock = async () => {
    try {
      const e = await axios
    .get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/seller/store/product/low-stock`,
      {
        withCredentials: true,
      }
    )
   
    setNotificateLowStock({store_x_variant_id: e.data})
    } catch (error) {
      console.error("error en la notificacion del producto",error)
    }    
   

  }
  useEffect(() => {}, [])
  return (
    <SellerStoreContext.Provider
      value={{
        storeSeller,
        handlerGetSellerStore,
        isLoadingStore,
        handlerGetListSellerOrder,
        loadOrdersPage,
        isLoadingOrders,
        dataOrders,
        loadedPages,
        totalCount,
        currentPage,
        totalPages,
        pageLimit,
        setPageLimit,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        handlerLowStock,
        notificateLowStock,
        listSellerOrders,
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
