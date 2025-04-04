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
const CheckoutForm = () => {
  const { cart, deleteCart } = useCartGudfy()
  const { customer } = useMeCustomer()

  const {
    isLoadingCurrentOrder,
    dataPay,
    currentOrder,
    handlersubmitPaymentMethod,
    handlerCurrentOrder,
    handlerUpdateDataLastOrder,
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
    handlerCurrentOrder()
    setSelectedKeys(new Set([checkbox]))
    if (checkbox) setCompleteForm((com) => ({ ...com, payment: true }))
    else setCompleteForm((com) => ({ ...com, payment: false }))
  }, [customer])

  const handlersubmit = async (dataForm?: orderDataForm) => {
    if (!dataForm) {
      return
    }
    handlerUpdateDataLastOrder({ ...dataForm, pay_method_id: checkbox }).then(
      () => {
        if (!currentOrder?.id) alert("error de orden , no se obtuvo la orden")
        else {
          handlersubmitPaymentMethod(checkbox, cart, currentOrder.id).then(
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
      ) : dataPay && dataPay.length > 0 ? (
        <div className="flex flex-col gap-4">
          {dataPay.map((payment) => (
            <div
              key={payment.reference}
              className="flex justify-center items-center"
            >
              <CoinPalPayment 
                data={payment.dataPay} 
                currentOrder={currentOrder} 
              />
              {/* <BinanceAutomaticPayment data={payment} currentOrder={currentOrder} /> */}
            </div>
          ))}
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
