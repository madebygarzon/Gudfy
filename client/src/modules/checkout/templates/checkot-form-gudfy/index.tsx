"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import type { Selection } from "@heroui/react"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import { orderDataForm, useOrderGudfy } from "@lib/context/order-context"
import CheckoutSelectPayment from "../../components/checkout-select-payment"
import CoinPalPayment from "../../components/coinpal"
import ManualBinancePay from "../../components/manual-pay"
import { useMeCustomer } from "medusa-react"
import Loader from "@lib/loader"
import Timer from "@lib/util/timer-order"

type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
type methodPayment =
  | "automatic_binance_pay"
  | "manual_binance_pay"
  | "bitcoin_ethereum_litecoin_entrega_automatica"
  | "coinpal_pay"

const CheckoutForm = ({ orderId }: { orderId: string | undefined }) => {
  const { cart, deleteCart } = useCartGudfy()
  const { customer } = useMeCustomer()

  const {
    isLoadingCurrentOrder,
    dataPay,
     currentOrder,
    handlersubmitPaymentMethod,
    handlerCurrentOrder,
    handlerUpdateDataLastOrder,
    handlerRecoverPaymentOrders,
  } = useOrderGudfy()
  const [dataForm, setDataForm] = useState<orderDataForm>({
    pay_method_id: "coinpal_pay",
    name: "",
    last_name: "",
    email: "",
    contry: "",
    city: "",
    phone: "",
  })
  const [checkbox, selectedCheckbox] = useState<methodPayment>("coinpal_pay")
  const [viewPaymentMethod, setViewPaymentMethod] = useState<
    methodPayment | undefined
  >(undefined)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([checkbox])
  )
  const [completedForm, setCompleteForm] = useState<CompleteForm>({
    form: false,
    payment: false,
    TermsConditions: false,
  })

  useEffect(() => {
    if (orderId) {
      handlerCurrentOrder(orderId)
    }
    setSelectedKeys(new Set([checkbox]))
    if (checkbox) setCompleteForm((com) => ({ ...com, payment: true }))
    else setCompleteForm((com) => ({ ...com, payment: false }))
    handlerRecoverPaymentOrders(customer?.id || "", orderId || "")
  }, [customer])
  
  const handlersubmit = async (dataForm?: orderDataForm) => {
    if (!dataForm) {
      return
    }
    if (checkbox == "manual_binance_pay") {
      setViewPaymentMethod(checkbox)
      return
    }

    handlerUpdateDataLastOrder(
      { ...dataForm, pay_method_id: checkbox },
      orderId
    ).then(() => {
      if (!orderId) alert("error de orden , no se obtuvo la orden")
      else {
        handlersubmitPaymentMethod({ checkbox, cart, order_id: orderId })
        deleteCart()
      }
    })
  }

  return (
    <div>
      {isLoadingCurrentOrder ? (
        <>
          <Loader />
        </>
      ) : dataPay && dataPay.dataPay && dataPay.order ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <CoinPalPayment
              data={dataPay.dataPay}
              currentOrder={dataPay.order}
            />
          </div>
        </div>
      ) : viewPaymentMethod === "manual_binance_pay" ? (
        <ManualBinancePay dataForm={dataForm} storeOrder={orderId} />
      ) : (
        <>
        
        <CheckoutSelectPayment
          cart={cart}
          completedForm={completedForm}
          setCompleteForm={setCompleteForm}
          checkbox={checkbox}
          selectedCheckbox={selectedCheckbox}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          handlersubmit={handlersubmit}
          dataForm={dataForm}
          setDataForm={setDataForm}
        />
        </>
      )}
    </div>
  )
}

export default CheckoutForm
