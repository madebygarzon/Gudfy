"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import react, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
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
  state_order:
    | "Completado"
    | "Cancelado"
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
      serial_code_products: [{ id: string; serial: string }]
    }
  ]
}
type dataPay = {
  currency: string
  totalFee: string
  fiatCurrency: string
  fiatAmount: string
  prepayId: string
  terminalType: string
  expireTime: number
  qrcodeLink: string
  qrContent: string
  checkoutUrl: string
  deeplink: string
  universalUrl: string
}
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

interface orderContext {
  isLoading: boolean
  isLoadingCurrentOrder: boolean
  handlerListOrder: () => void
  handlerCurrentOrder: () => void
  handlerOrderCancel: (orederId: string) => Promise<boolean>
  handlersubmitPaymentMethod: (
    checkbox: string,
    cart: Cart | undefined,
    order_id: string
  ) => Promise<void>
  dataPay: dataPay | undefined
  setDataPay: react.Dispatch<SetStateAction<dataPay | undefined>>
  listOrder: order[] | null
  currentOrder: order | null
  handlerListOrderClaim: () => void
  handlerListSellerOrderClaim: (id: string) => void
  isLoadingClaim: boolean
  listOrderClaim: orderClaim[] | null
  handlerUpdateDataLastOrder: (dataForm: orderDataForm) => Promise<void>
}

export const OrderContext = createContext<orderContext | null>(null)

export const OrderGudfyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { customer } = useMeCustomer()
  const [dataPay, setDataPay] = useState<dataPay>() // determina si hay algun pago pendiente
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(true)
  const [isLoadingCurrentOrder, setIsLoadingCurrentOrder] =
    useState<boolean>(true)
  const [listOrder, setLisOrder] = useState<order[] | null>(null)
  const [listOrderClaim, setListOrderClaim] = useState<orderClaim[] | null>(
    null
  )

  const [currentOrder, setCurrentOrderr] = useState<order | null>(null)

  const handlerListOrder = () => {
    setIsLoading(true)
    getListOrders(customer?.id || "").then((e) => {
      setLisOrder(e)
      setIsLoading(false)
    })
  }
  const handlerCurrentOrder = () => {
    setIsLoadingCurrentOrder(true)
    getCurrentOrder(customer?.id || "")
      .then((e) => {
        setCurrentOrderr(e)
        setIsLoadingCurrentOrder(false)
      })
      .catch((error) => {
        console.log("error el la recuperacion de la orden")
      })
  }

  const handlerOrderCancel = async (orederId: string) => {
    await updateCancelStoreOrder(orederId)
    return true
  }

  const handlerUpdateDataLastOrder = async (dataForm: orderDataForm) => {
    if (!currentOrder?.id)
      return alert(
        "No se encontro una orden disponible, por favor cree otra orden"
      )

    await axios.post(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/order/uptade-data/`,
      {
        store_order_id: currentOrder?.id,
        dataForm: dataForm,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const handlersubmitPaymentMethod = async (
    checkbox: string,
    cart: Cart | undefined,
    order_id: string
  ) => {
    setIsLoadingCurrentOrder(true)
    const response = await axios
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
        setDataPay(result.data)
        setIsLoadingCurrentOrder(false)
        // location.href = result.data.checkoutUrl //redirect user to pay link
      })
      .catch((e) => {
        alert(e.error.message)
      })
  }

  const handlerListOrderClaim = async () => {
    try {
      setIsLoadingClaim(true)
      const orders = await axios
        .get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/claim/${customer?.id}/orders`,
          {
            withCredentials: true,
          }
        )
        .then((order) => {
          setListOrderClaim(order.data)
          setIsLoadingClaim(false)
        })
    } catch (error) {
      console.error("Error al obtener los reclamos:", error)
      throw error
    }
  }

  const handlerListSellerOrderClaim = async (idStore?: string) => {
    setIsLoadingClaim(true)
    try {
      const orders = await axios
        .get(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/claim/${idStore}/seller/orders`,
          {
            withCredentials: true,
          }
        )
        .then((order) => {
          setListOrderClaim(order.data)
          setIsLoadingClaim(false)
        })
    } catch (error) {
      console.error(
        "Error al obtener los reclamos por parte del vendedor:",
        error
      )
      throw error
    }
  }

  return (
    <OrderContext.Provider
      value={{
        isLoading,
        isLoadingCurrentOrder,
        handlerListOrder,
        handlerCurrentOrder,
        handlerOrderCancel,
        currentOrder,
        handlersubmitPaymentMethod,
        listOrder,
        dataPay,
        setDataPay,
        handlerListOrderClaim,
        handlerListSellerOrderClaim,
        listOrderClaim,
        isLoadingClaim,
        handlerUpdateDataLastOrder,
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
