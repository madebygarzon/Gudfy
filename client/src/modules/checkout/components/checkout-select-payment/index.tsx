import React from "react"
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
import { useCartGudfy } from "@lib/context/cart-gudfy"
import { orderDataForm } from "@lib/context/order-context"

type CompleteForm = {
  form: boolean
  payment: boolean
  TermsConditions: boolean
}

type CheckoutDetailsProps = {
  cart: any
  completedForm: CompleteForm
  setCompleteForm: React.Dispatch<React.SetStateAction<CompleteForm>>
  checkbox: string
  selectedCheckbox: React.Dispatch<React.SetStateAction<string>>
  selectedKeys: Selection
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>
  handlersubmit: (dataForm?: orderDataForm) => Promise<void>
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

const CheckoutSelectPayment: React.FC<CheckoutDetailsProps> = ({
  cart,
  completedForm,
  setCompleteForm,
  checkbox,
  selectedCheckbox,
  selectedKeys,
  setSelectedKeys,
  handlersubmit,
}) => {
  const [dataForm, setDataForm] = useState<orderDataForm>({
    pay_method_id: "",
    name: "",
    last_name: "",
    email: "",
    contry: "",
    city: "",
    phone: "",
  })
  return (
    <div>
      <form>
        <div className="px-2 w-full flex gap-x-4 justify-between  ">
          <div className="w-1/2 ml-8 mr-4 bg-white p-5">
            <h2 className="font-bold text-2xl text-center my-3">
              Formulario de compra
            </h2>
            <CheckautVirtualForm
              setCompleteForm={setCompleteForm}
              dataForm={dataForm}
              setDataForm={setDataForm}
            />
            <p className="p-6 text-xs">
              *Tus datos personales se utilizarán para procesar tu pedido,
              respaldar tu experiencia en este sitio web y para otros fines
              descritos en nuestra política de privacidad.*
            </p>
          </div>

          <div className="w-1/2 mr-8 ml-4 bg-white p-5">
            <h2 className="text-2xl font-bold text-center my-3">
              Forma de pago
            </h2>
            <Accordion
              selectedKeys={selectedKeys}
              onSelectionChange={(key) => {
                const checkbox = methodPayment.find(
                  (e) => e === Array.from(key)[0]
                )
                selectedCheckbox(checkbox || "automatic_binance_pay")
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
                    Pay. Este método de pago tiene un <b>1% de comisión.</b>
                  </p>
                </div>
              </AccordionItem>
              {/* <AccordionItem
                disabled
                key="manual_binance_pay"
                aria-label="Binance Pay Entrega Manual - "
                title="Binance Pay Entrega Manual - "
                className="font-medium"
                startContent={
                  // <Checkbox
                  //   radius="full"
                  //   isSelected={checkbox == methodPayment[1]}
                  // />
                  <p>Deshabilitado</p>
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
              </AccordionItem> */}
              {/* <AccordionItem
                disabled
                key="usdt_trc20_entrega_manual"
                aria-label="USDT-TRC20 Entrega Manual "
                title="USDT-TRC20 Entrega Manual "
                className="font-medium"
                startContent={
                  // <Checkbox
                  //   disabled
                  //   radius="full"
                  //   isSelected={checkbox == methodPayment[3]}
                  // />
                  <p>Deshabilitado</p>
                }
              >
                <div className="font-normal px-12 text-sm pb-5">
                  <p>
                    Transferir montos exactos, usted debe asumir el valor de la
                    comisión de red, una vez hecho el pago por favor subir
                    captura. Wallet: THUCrw23pHkB2KW5EoFhgfd8g6YKKyMPHD
                  </p>
                </div>
              </AccordionItem> */}
              {/* <AccordionItem
                disabled
                key="bitcoin_ethereum_litecoin_entrega_automatica"
                aria-label=" Bitcoin - Ethereum - Litecoin - Entrega Automática "
                title="Bitcoin - Ethereum - Litecoin - Entrega Automática "
                className="font-medium"
                startContent={
                  // <Checkbox
                  //   disabled
                  //   radius="full"
                  //   isSelected={checkbox == methodPayment[2]}
                  // />
                  <p>Deshabilitado</p>
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
              </AccordionItem> */}
            </Accordion> 
            <div className="pl-2 flex my-5">
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
              <p className="text-sm font-semibold">
                He leído y estoy de acuerdo con los{" "}
                <Link href="/terminos-y-condiciones" className="text-sky-600 underline">
                  términos y condiciones de la web
                </Link>
                *
              </p>
            </div>
            <div className="flex justify-center ">
              <Button
              className="w-full"
                onClick={() => handlersubmit(dataForm)}
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
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutSelectPayment
