import React from "react"
import { useCart } from "medusa-react"
import { useEffect, useState } from "react"
import axios from "axios"
import Payment from "@modules/checkout/components/payment"
import CheckautVirtualForm from "../checkout-virtual-form"
import PaymentContainer from "../payment-container"
import { useCheckout } from "@lib/context/checkout-context"
import Spinner from "@modules/common/icons/spinner"
import { Accordion, AccordionItem } from "@heroui/react"
import { Select, SelectItem } from "@heroui/react"
import { Checkbox } from "@heroui/react"
import Image from "next/image"
import { Label } from "@medusajs/ui"
import Link from "next/link"
import type { Selection } from "@heroui/react"
import Button from "@modules/common/components/button"
import { useForm } from "react-hook-form"
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
  "coinpal_pay",
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
    pay_method_id: "automatic_binance_pay",
    name: "",
    last_name: "",
    email: "",
    contry: "",
    city: "",
    phone: "",
  })

  const { register, formState, trigger, setValue } = useForm<orderDataForm>({
    defaultValues: {
      name: dataForm.name,
      last_name: dataForm.last_name,
      email: dataForm.email,
    },
  })

  useEffect(() => {
    if (dataForm.name) {
      setValue("name", dataForm.name)
      setValue("last_name", dataForm.last_name)
      setValue("email", dataForm.email)
      trigger()
    }
  }, [dataForm.name, setValue, trigger])

  return (
    <div className="px-2 w-full flex flex-col md:flex-row gap-4 justify-between">
      {/* Formulario de compra */}
      <div className="w-full md:w-1/2 bg-white p-4 md:p-5">
        <h2 className="font-bold text-xl md:text-2xl text-center my-3">
          Formulario de compra
        </h2>
        <CheckautVirtualForm
          propsForm={{
            register: register,
            formState: formState,
          }}
          setCompleteForm={setCompleteForm}
          dataForm={dataForm}
          setDataForm={setDataForm}
        />
        <p className="p-4 md:p-6 text-xs">
          *Tus datos personales se utilizarán para procesar tu pedido, respaldar
          tu experiencia en este sitio web y para otros fines descritos en
          nuestra política de privacidad.*
        </p>
      </div>

      {/* Forma de pago */}
      <div className="w-full md:w-1/2 bg-white p-4 md:p-5">
        <h2 className="text-xl md:text-2xl font-bold text-center my-3">
          Forma de pago
        </h2>
        <Accordion
          selectedKeys={selectedKeys}
          onSelectionChange={(key) => {
            const checkbox = methodPayment.find((e) => e === Array.from(key)[0])
            selectedCheckbox(checkbox || "automatic_binance_pay")
          }}
        >
          <AccordionItem
            key="coinpal_pay"
            aria-label="Pago atravez de CoinPal"
            title="CoinPal"
            indicator={<></>}
            className="font-medium"
            startContent={
              <Checkbox
                defaultSelected
                radius="full"
                isSelected={checkbox == methodPayment[3]}
              />
            }
          >
            <div className="font-normal px-4 md:px-12 text-sm pb-5">
              <p>Paga en USDT usando CoinPal y Binance Pay</p>
              <br />
              <p>
                Importante: desde el 21 de septiembre Binance decidió fijar una
                tasa del 1% de comisión en sus transacciones de Binance Pay.
                Este método de pago tiene un <b>1% de comisión.</b>
              </p>
            </div>
          </AccordionItem>
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
            <div className="font-normal px-4 md:px-12 text-sm pb-5">
              <p>
                Paga en USDT usando Binance Pay, sin comisiones, recibes los
                códigos de manera inmediata.
              </p>
              <br />
              <p>
                Importante: desde el 21 de septiembre Binance decidió fijar una
                tasa del 1% de comisión en sus transacciones de Binance Pay.
                Este método de pago tiene un <b>1% de comisión.</b>
              </p>
            </div>
          </AccordionItem>
        </Accordion>
        <div className="pl-2 flex my-5">
          <Checkbox
            radius="none"
            size="sm"
            onChangeCapture={() => {
              trigger()
              setCompleteForm((com) => ({
                ...com,
                TermsConditions: !com.TermsConditions,
              }))
            }}
          />
          <p className="text-sm font-semibold">
            He leído y estoy de acuerdo con los{" "}
            <Link
              href="/terminos-y-condiciones"
              className="text-sky-600 underline"
            >
              términos y condiciones de la web
            </Link>
            *
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            className="w-full"
            onClick={async () => {
              if (await trigger()) handlersubmit(dataForm)
            }}
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
  )
}

export default CheckoutSelectPayment
