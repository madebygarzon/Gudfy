import { useEffect, useState } from "react"
import axios from "axios"
import type { Selection } from "@nextui-org/react"
import { useCartGudfy } from "@lib/context/cart-gudfy"
import CheckoutSelectPayment from "../checkout-select-payment"
import BinanceAutomaticPayment from "../binance-automatic-payment"

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

const methodPayment = [
  "automatic_binance_pay",
  "manual_binance_pay",
  "bitcoin_ethereum_litecoin_entrega_automatica",
  "usdt_trc20_entrega_manual",
]
const cripto = [
  { label: "Bitcoin (BTC)", value: "BTC" },
  { label: "Ethereum (ETH)", value: "ETH" },
  { label: "Litecoin (LTC)", value: "LTC" },
]
type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}
const CheckoutForm = () => {
  const { cart } = useCartGudfy()

  const [checkbox, selectedCheckbox] = useState<string>("automatic_binance_pay")
  const [dataPay, setDataPay] = useState<dataPay>()
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([checkbox])
  )
  const [completedForm, setCompleteForm] = useState<CompleteForm>({
    form: false,
    payment: false,
    TermsConditions: false,
  })

  useEffect(() => {
    setSelectedKeys(new Set([checkbox]))
    if (checkbox) setCompleteForm((com) => ({ ...com, payment: true }))
    else setCompleteForm((com) => ({ ...com, payment: false }))
  }, [checkbox])

  const handlersubmit = async () => {
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
        // location.href = result.data.checkoutUrl //redirect user to pay link
      })
      .catch((e) => {
        console.log("error binance", e)
        alert(e.error.message)
      })
  }

  return (
    <div>
      {dataPay ? (
        <div className="flex justify-center items-center">
          <BinanceAutomaticPayment data={dataPay} />
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
