import { useCart } from "medusa-react"
import { useEffect, useState } from "react"
import axios from "axios"
import Payment from "@modules/checkout/components/payment"
import CheckautVirtualForm from "../checkout-virtual-form"
import PaymentContainer from "../payment-container"
import { useCheckout } from "@lib/context/checkout-context"
import Spinner from "@modules/common/icons/spinner"
import { Accordion, AccordionItem } from "@nextui-org/react"
import { Select, SelectItem } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react"
import Image from "next/image"
import { Label } from "@medusajs/ui"
import Link from "next/link"
import type { Selection } from "@nextui-org/react"
import Button from "@modules/common/components/button"

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
  const { cart } = useCart()

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
    setSelectedKeys(new Set([checkbox]))
    console.log(checkbox)
    if (checkbox) setCompleteForm((com) => ({ ...com, payment: true }))
    else setCompleteForm((com) => ({ ...com, payment: false }))
  }, [checkbox])

  if (!cart?.id) {
    return null
  }
  const handlersubmit = async () => {
    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/checkout`,
        {
          payment_method: checkbox
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data.result;
        location.href = result.data.checkoutUrl; //redirect user to pay link
      })
      .catch((e) => {
        alert(e.error.errorMessage)
      })
  }

  return (
    <div>
      <form onSubmit={handlersubmit}>
        <div className="w-full grid grid-cols-1 gap-y-8">
          <div className="bg-white p-10">
            <h2 className="font-bold text-2xl text-center my-3">
              Fromulario de compra
            </h2>
            <CheckautVirtualForm setCompleteForm={setCompleteForm} />
          </div>
          <div className="bg-white p-5">
            <h2 className="text-2xl font-bold text-center my-3">
              Forma de pago
            </h2>
            <Accordion
              selectedKeys={selectedKeys}
              onSelectionChange={(key) => {
                const checkbox = methodPayment.find(
                  (e) => e === Array.from(key)[0]
                )
                selectedCheckbox(checkbox || "")
              }}
            >
              <AccordionItem
                key="automatic_binance_pay"
                aria-label="Binance Pay Entrega Automática"
                title="Binance Pay Entrega Automática"
                indicator={<></>}
                className="font-medium"
                startContent={
                  <Checkbox
                    defaultSelected
                    radius="full"
                    isSelected={checkbox == methodPayment[0]}
                  />
                }
              >
                <div className="font-normal px-12 text-sm pb-5">
                  <p>
                    Paga en USDT usando Binance Pay, sin comisiones, recibes los
                    códigos de manera inmediata.
                  </p>
                  <br />

                  <p>
                    Importante: desde el 21 de septiembre Binance decidió fijar
                    una tasa del 1% de comisión en sus transacciones de Binance
                    Pay. This payment method has a <b>1% de Free.</b>
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                key="manual_binance_pay"
                aria-label="Binance Pay Entrega Manual Pay ID 202554183"
                title="Binance Pay Entrega Manual Pay ID 202554183"
                className="font-medium"
                startContent={
                  <Checkbox
                    radius="full"
                    isSelected={checkbox == methodPayment[1]}
                  />
                }
              >
                <div className="font-normal px-12 text-sm pb-5">
                  <p>
                    Por favor use Binance Pay ID 202554183 o escanee el código
                    QR con su aplicación de Binance. Se debe subir el
                    comprobante de pago en la siguiente página, todos los pagos
                    serán comprobados manualmente.
                    <div className="m-5 flex justify-center">
                      <Image
                        src="/pay/BinancePayId.webp"
                        alt="Binance Pay ID 202554183"
                        width={300}
                        height={300}
                      />
                    </div>
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                key="usdt_trc20_entrega_manual"
                aria-label="USDT-TRC20 Entrega Manual"
                title="USDT-TRC20 Entrega Manual"
                className="font-medium"
                startContent={
                  <Checkbox
                    radius="full"
                    isSelected={checkbox == methodPayment[3]}
                  />
                }
              >
                <div className="font-normal px-12 text-sm pb-5">
                  <p>
                    Transferir montos exactos, usted debe asumir el valor de la
                    comisión de red, una vez hecho el pago por favor subir
                    captura. Wallet: THUCrw23pHkB2KW5EoFhgfd8g6YKKyMPHD
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                key="bitcoin_ethereum_litecoin_entrega_automatica"
                aria-label=" Bitcoin - Ethereum - Litecoin - Entrega Automática"
                title="Bitcoin - Ethereum - Litecoin - Entrega Automática"
                className="font-medium"
                startContent={
                  <Checkbox
                    radius="full"
                    isSelected={checkbox == methodPayment[2]}
                  />
                }
              >
                <div className="font-normal px-12 text-sm pb-5">
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                      label="Selecciona la cripto moneda"
                      className="max-w-xs"
                    >
                      {cripto.map((cripto) => (
                        <SelectItem key={cripto.value} value={cripto.value}>
                          {cripto.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
          Tus datos personales se utilizarán para procesar tu pedido, respaldar
          tu experiencia en este sitio web y para otros fines descritos en
          nuestra política de privacidad.
        </div>
        <div className="flex my-5">
          <Checkbox
            radius="none"
            size="sm"
            onChangeCapture={() =>
              setCompleteForm((com) => ({
                ...com,
                TermsConditions: !com.TermsConditions,
              }))
            }
          />
          <b>
            He leido y estoy de acuerdo con los{" "}
            <Link className={" text-sky-600"} href={""}>
              terminos y condiciones de la web
            </Link>
            *
          </b>
        </div>
      </form>
      <Button
        type="submit"
        disabled={
          !(
            completedForm.TermsConditions &&
            completedForm.form &&
            completedForm.payment
          )
        }
      >
        Ir al pago
      </Button>
    </div>
  )
}

export default CheckoutForm
