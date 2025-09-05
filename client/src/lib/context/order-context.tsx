"use client"
import react, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react"
import axios from "axios"
import { getListOrders } from "@modules/account/actions/get-list-orders"
import { getCurrentOrder } from "@modules/account/actions/get-current-order"
import { useMeCustomer } from "medusa-react"
import { Cart } from "@medusajs/medusa"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"

export type order = {
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
  proof_of_payment: string
  state_order:
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  store_variant: [
    {
      store_id: string
      store_name: string
      store_variant_order_id: string
      produc_title: string
      price: string
      quantity: string
      total_price_for_product: string
      variant_order_status_id: string
      serial_code_products: [{ id: string; serial: string }]
    }
  ]
}
type PaymentData = {
  dataPay: {
    nextStepContent: string
    reference: string
    status: string
    orderAmount: string
    orderCurrency: string
    orderNo: string
  }
  order: order
}
type dataPay = PaymentData

export type orderClaim = {
  id: string
  status_order_claim_id: string
  created_at: string
  quantity: number
  price_unit: number
  number_order: string
  store_name: string
  product_name: string
  customer_last_name?: string
  customer_name?: string
  customer_email?: string
}

export type orderDataForm = {
  pay_method_id?: string
  name?: string
  last_name?: string
  email?: string
  contry?: string
  city?: string
  phone?: string
}

type dataFormPayment = {
  checkbox: string
  cart?: Cart
  order_id: string
}

interface orderContext {
  isLoading: boolean
  isLoadingCurrentOrder: boolean
  handlerListOrder: () => Promise<void>
  loadOrdersPage: (page: number, limit?: number, status?: string, search?: string) => Promise<void>
  handlerCurrentOrder: (id: string) => Promise<void>
  handlerOrderCancel: (id: string) => Promise<void>
  handlersubmitPaymentMethod: (dataForm: dataFormPayment) => void
  currentOrder: order | null
  listOrder: order[] | null
  dataOrders: order[]
  loadedPages: Set<number>
  totalCount: number
  currentPage: number
  setCurrentPage: react.Dispatch<SetStateAction<number>>
  totalPages: number
  pageLimit: number
  setPageLimit: react.Dispatch<SetStateAction<number>>
  statusFilter: string
  setStatusFilter: react.Dispatch<SetStateAction<string>>
  searchTerm: string
  setSearchTerm: react.Dispatch<SetStateAction<string>>
  handlerListOrderClaim: (resetFilters?: boolean) => Promise<void>
  loadClaimsPage: (page: number, limit?: number, search?: string) => Promise<orderClaim[] | undefined>
  handlerListSellerOrderClaim: (id: string) => void
  isLoadingClaim: boolean
  listOrderClaim: orderClaim[] | null
  dataOrderClaims: orderClaim[]
  loadedClaimPages: Set<number>
  totalClaimCount: number
  currentClaimPage: number
  setCurrentClaimPage: react.Dispatch<SetStateAction<number>>
  totalClaimPages: number
  claimPageLimit: number
  setClaimPageLimit: react.Dispatch<SetStateAction<number>>
  claimSearchTerm: string
  setClaimSearchTerm: react.Dispatch<SetStateAction<string>>
  
  handlerUpdateDataLastOrder: (
    dataForm: orderDataForm,
    orderId?: string
  ) => Promise<any>
  dataPay: dataPay
  setDataPay: react.Dispatch<SetStateAction<dataPay>>
  handlerRecoverPaymentOrders: (customerid: string, store_order_id: string) => void
}

export const OrderContext = createContext<orderContext | null>(null)

export const OrderGudfyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { customer } = useMeCustomer()
  const [dataPay, setDataPay] = useState<dataPay>({
    dataPay: {
      nextStepContent: "",
      reference: "",
      status: "",
      orderAmount: "",
      orderCurrency: "",
      orderNo: "",
    },
    order: {
      id: "",
      pay_method_id: "",
      created_at: "",
      sellerapproved: "",
      customerapproved: "",
      quantity_products: 0,
      total_price: "",
      person_name: "",
      person_last_name: "",
      email: "",
      conty: "",
      city: "",
      phone: "",
      state_order: "Pendiente de pago",
      proof_of_payment: "",
      store_variant: [
        {
          store_id: "",
          store_name: "",
          store_variant_order_id: "",
          produc_title: "",
          price: "",
          quantity: "",
          total_price_for_product: "",
          variant_order_status_id: "",
          serial_code_products: [{ id: "", serial: "" }],
        },
      ],
    },
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(true)
  const [isLoadingCurrentOrder, setIsLoadingCurrentOrder] =
    useState<boolean>(true)
  const [listOrder, setLisOrder] = useState<order[] | null>(null)
  const [listOrderClaim, setListOrderClaim] = useState<orderClaim[] | null>(null)
  const [dataOrderClaims, setDataOrderClaims] = useState<orderClaim[]>([])
  const [loadedClaimPages, setLoadedClaimPages] = useState<Set<number>>(new Set())
  const [totalClaimCount, setTotalClaimCount] = useState<number>(0)
  const [currentClaimPage, setCurrentClaimPage] = useState<number>(1)
  const [totalClaimPages, setTotalClaimPages] = useState<number>(0)
  const [claimPageLimit, setClaimPageLimit] = useState<number>(10)
  const [claimSearchTerm, setClaimSearchTerm] = useState<string>('')
  const [dataOrders, setDataOrders] = useState<order[]>([])
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [pageLimit, setPageLimit] = useState<number>(10) 
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [currentOrder, setCurrentOrderr] = useState<order | null>(null)

  const handlerListOrder = async() => {
    setIsLoading(true)
    try {
      const response = await getListOrders(customer?.id || "", {
        page: 1,
        limit: pageLimit
      })
      setLisOrder(response.data || [])
      
      setDataOrders(response.data || [])
      setTotalCount(response.totalCount || 0)
      setTotalPages(response.totalPages || 1)
      setCurrentPage(1)
      setLoadedPages(new Set([1]))
    } catch (error) {
      console.error("Error al cargar órdenes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrdersPage = async (page: number, limit?: number, status?: string, search?: string): Promise<void> => {
    if (limit !== undefined && limit !== pageLimit) setPageLimit(limit);
    if (status !== undefined) setStatusFilter(status || 'all');
    if (search !== undefined) setSearchTerm(search || '');
    
    if (loadedPages.has(page) && 
        limit === pageLimit && 
        status === statusFilter && 
        search === searchTerm) {
      setCurrentPage(page);
      return;
    }

    setIsLoading(true);
    try {
      
      const response = await getListOrders(customer?.id || "", {
        page,
        limit,
        status,
        search
      });

      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      
      if (limit !== pageLimit || status !== statusFilter || search !== searchTerm) {
        setDataOrders(response.data || []);
        setLoadedPages(new Set([page]));
      } else {
        setDataOrders(prevOrders => {
          const existingIds = new Set(prevOrders.map(order => order.id));
          const newOrders = response.data.filter((order: order) => !existingIds.has(order.id));
          return [...prevOrders, ...newOrders];
        });
        
        setLoadedPages(prev => {
          const newSet = new Set(prev);
          newSet.add(page);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error al cargar página de órdenes:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const handlerCurrentOrder = async (id: string): Promise<void> => {
    setIsLoadingCurrentOrder(true)
    try {
      const e = await getCurrentOrder(id || "")
      setCurrentOrderr(e)
      
    } catch (error) {
      console.error("Error al obtener la orden actual:", error)
    } finally {
      setIsLoadingCurrentOrder(false)
    }
  }

  const handlerOrderCancel = async (id: string): Promise<void> => {
    await updateCancelStoreOrder(id)
  }

  const handlersubmitPaymentMethod = (dataForm: dataFormPayment): void => {
    const { checkbox, cart, order_id } = dataForm
    
    setIsLoadingCurrentOrder(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart?.id}/checkout`,
        {
          payment_method: checkbox,
          order_id: order_id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data.result

        setDataPay((old) => ({ ...old, dataPay: result }))
        setIsLoadingCurrentOrder(false)
        // location.href = result.data.checkoutUrl //redirect user to pay link
      })
      .catch((e) => {
        setIsLoadingCurrentOrder(false)
        console.error("Error submitting payment method:", e)
      })
  }

  const handlerUpdateDataLastOrder = async (
    dataForm: orderDataForm,
    orderId?: string
  ) => {
    if (!orderId) {
      return alert(
        "No se encontro una orden disponible, por favor cree otra orden"
      )
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/order/uptade-data/`,
        {
          store_order_id: orderId,
          dataForm: dataForm,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    } catch (error) {
      console.error("Error al actualizar datos de la orden:", error);
    }
  }

  const loadClaimsPage = async (page: number, limit: number = claimPageLimit, search: string = claimSearchTerm): Promise<orderClaim[] | undefined> => {
    try {
      if (loadedClaimPages.has(page)) {
       
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return dataOrderClaims.slice(startIndex, endIndex);
      }

      setIsLoadingClaim(true)
      
      const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/claim/${customer?.id}/orders?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      
      const response = await fetch(url, {
        credentials: "include",
      })

      const { data, totalCount, totalPages } = await response.json()

      setTotalClaimCount(totalCount)
      setTotalClaimPages(totalPages)
      
      const newLoadedPages = new Set(loadedClaimPages)
      newLoadedPages.add(page)
      setLoadedClaimPages(newLoadedPages)

      setDataOrderClaims(prevData => {
        const existingDataMap = new Map(prevData.map((item: orderClaim) => [item.id, item]))
        
        data.forEach((item: orderClaim) => existingDataMap.set(item.id, item))
        return Array.from(existingDataMap.values())
      })

      setListOrderClaim(data)
      setIsLoadingClaim(false)

      return data
    } catch (error) {
      console.error(`Error al cargar la página ${page} de reclamaciones:`, error)
      setIsLoadingClaim(false)
      return undefined
    }
  }
  const handlerListOrderClaim = async (resetFilters: boolean = false): Promise<void> => {
    try {
      if (resetFilters) {
        setClaimSearchTerm('')
        setCurrentClaimPage(1)
        setLoadedClaimPages(new Set())
        setDataOrderClaims([])
      }
      
      await loadClaimsPage(currentClaimPage, claimPageLimit, claimSearchTerm)
    } catch (error) {
      console.error("Error al obtener los reclamos:", error)
      throw error
    }
  }

  const handlerListSellerOrderClaim = async (id: string): Promise<void> => {
    setIsLoadingClaim(true)
    try {
      const orders = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/claim/${id}/seller/orders`,
        {
          credentials: "include",
        }
      )
      const { data } = await orders.json()

      setListOrderClaim(data)
      setIsLoadingClaim(false)
    } catch (error) {
      console.error(
        "Error al obtener los reclamos por parte del vendedor:",
        error
      )
      throw error
    }
  }

  const handlerRecoverPaymentOrders = async (
    customerid: string,
    store_order_id: string
  ) => {
    setIsLoadingCurrentOrder(true)
    if (!store_order_id || !customerid) {
      setIsLoadingCurrentOrder(false)
      return
    }
    try {
      const orders = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders/${customerid}/${store_order_id}/method-payment-pending`,
        {
          withCredentials: true,
        }
      )

      setDataPay(orders.data)
      setIsLoadingCurrentOrder(false)
    } catch (error) {
      console.error("Error al obtener las ordenes pendientes de pago:", error)
      throw error
    }
  }

  return (
    <OrderContext.Provider
      value={{
        isLoading,
        isLoadingCurrentOrder,
        handlerListOrder,
        loadOrdersPage,
        handlerCurrentOrder,
        handlerOrderCancel,
        currentOrder,
        handlersubmitPaymentMethod,
        listOrder,
        dataOrders,
        loadedPages,
        totalCount,
        currentPage,
        setCurrentPage,
        totalPages,
        pageLimit,
        setPageLimit,
        statusFilter,
        setStatusFilter,
        searchTerm,
        setSearchTerm,
        dataPay,
        setDataPay,
        handlerListOrderClaim,
        loadClaimsPage,
        handlerListSellerOrderClaim,
        listOrderClaim,
        dataOrderClaims,
        loadedClaimPages,
        totalClaimCount,
        currentClaimPage,
        setCurrentClaimPage,
        totalClaimPages,
        claimPageLimit,
        setClaimPageLimit,
        claimSearchTerm,
        setClaimSearchTerm,
        isLoadingClaim,
        handlerUpdateDataLastOrder,
        handlerRecoverPaymentOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderGudfy = () => {
  const context = useContext(OrderContext)

  if (context === null) {
    throw new Error(
      "useOrderContext must be used within a CartDropdownProvider"
    )
  }

  return context
}
