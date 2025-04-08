"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import type { Selection } from "@heroui/react"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import { orderDataForm, useOrderGudfy } from "@lib/context/order-context"
import CheckoutSelectPayment from "../../components/checkout-select-payment"
import CoinPalPayment from "../../components/coinpal"
import { useMeCustomer } from "medusa-react"
import Loader from "@lib/loader"

type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
const CheckoutForm = ({ orderId }: { orderId: string | undefined }) => {
  const { cart, deleteCart } = useCartGudfy()
  const { customer } = useMeCustomer()

  const {
    isLoadingCurrentOrder,
    dataPay,
    // currentOrder,
    handlersubmitPaymentMethod,
    // handlerCurrentOrder,
    handlerUpdateDataLastOrder,
    handlerRecoverPaymentOrders
  } = useOrderGudfy()

  const [checkbox, selectedCheckbox] = useState<string>("automatic_binance_pay")

  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([checkbox])
  )
  const [completedForm, setCompleteForm] = useState<CompleteForm>({
    form: false,
    payment: false,
    TermsConditions: false,
  })

  useEffect(() => {
    // handlerCurrentOrder()
    setSelectedKeys(new Set([checkbox]))
    if (checkbox) setCompleteForm((com) => ({ ...com, payment: true }))
    else setCompleteForm((com) => ({ ...com, payment: false }))
    handlerRecoverPaymentOrders(customer?.id || "", orderId || "")
  }, [customer])
  const handlersubmit = async (dataForm?: orderDataForm) => {
    if (!dataForm) {
      return
    }
    handlerUpdateDataLastOrder({ ...dataForm, pay_method_id: checkbox }, orderId).then(
      () => {
        if (!orderId) alert("error de orden , no se obtuvo la orden")
        else {
          handlersubmitPaymentMethod(checkbox, cart, orderId).then(
            () => {
              deleteCart()
            }
          )
        }
      }
    )
  }

  return (
    <div>
      {isLoadingCurrentOrder ? (
        <>
          <Loader />
        </>
      ) : dataPay && dataPay.dataPay ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <CoinPalPayment 
              data={dataPay.dataPay} 
              currentOrder={dataPay.order} 
            />
          </div>
        </div>
      ) : (
        <CheckoutSelectPayment
          cart={cart}
          completedForm={completedForm}
          setCompleteForm={setCompleteForm}
          checkbox={checkbox}
          selectedCheckbox={selectedCheckbox}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          handlersubmit={handlersubmit}
        />
      )}
    </div>
  )
}

export default CheckoutForm
