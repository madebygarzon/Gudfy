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
      produc_title: string
      total_price_for_product: string
      quantity: string
      price: string
      store_name: string
      store_id: string
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

interface orderContext {
  isLoading: boolean
  isLoadingCurrentOrder: boolean
  handlerListOrder: () => void
  handlerCurrentOrder: () => void
  handlersubmitPaymentMethod: (checkbox: string, cart: Cart | undefined) => void
  dataPay: dataPay | undefined
  setDataPay: react.Dispatch<SetStateAction<dataPay | undefined>>
  listOrder: order[] | null
  currentOrder: order | null
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
  const [isLoadingCurrentOrder, setIsLoadingCurrentOrder] =
    useState<boolean>(true)
  const [listOrder, setLisOrder] = useState<order[] | null>(null)
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
    getCurrentOrder(customer?.id || "").then((e) => {
      setCurrentOrderr(e)
      setIsLoadingCurrentOrder(false)
    })
  }
  const handlersubmitPaymentMethod = async (
    checkbox: string,
    cart: Cart | undefined
  ) => {
    setIsLoadingCurrentOrder(true)
    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart?.id}/checkout`,
        {
          payment_method: checkbox,
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
        console.log("error binance", e)
        alert(e.error.message)
      })
  }

  return (
    <OrderContext.Provider
      value={{
        isLoading,
        isLoadingCurrentOrder,
        handlerListOrder,
        handlerCurrentOrder,
        currentOrder,
        handlersubmitPaymentMethod,
        listOrder,
        dataPay,
        setDataPay,
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
