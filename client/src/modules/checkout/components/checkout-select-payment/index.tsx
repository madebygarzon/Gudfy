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
import { orderDataForm, useOrderGudfy } from "@lib/context/order-context"

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
  selectedCheckbox: React.Dispatch<
    React.SetStateAction<
      | "automatic_binance_pay"
      | "manual_binance_pay"
      | "bitcoin_ethereum_litecoin_entrega_automatica"
      | "coinpal_pay"
    >
  >
  selectedKeys: Selection
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>
  handlersubmit: (dataForm?: orderDataForm) => Promise<void>
  dataForm: orderDataForm
  setDataForm: React.Dispatch<React.SetStateAction<orderDataForm>>
}

const methodPayment = [
  "automatic_binance_pay",
  "manual_binance_pay",
  "bitcoin_ethereum_litecoin_entrega_automatica",
  "coinpal_pay",
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
  dataForm,
  setDataForm,
}) => {

  const {currentOrder} = useOrderGudfy()
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
     {/* seccion orden de pago */}
        {currentOrder && (
          <div className="mb-4 p-4 border rounded-md border-lila-gf">
            <h3 className="font-semibold text-lg mb-3 text-center">Información de la orden</h3>
            
            {/* Order summary - top section in grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
              <div className=" flex gap-2 p-2 rounded">
                <span className="font-medium block">N° de orden:</span> 
                <span className="truncate block font-bold">{currentOrder.id}</span>
              </div>
              <div className=" flex gap-2 p-2 rounded">
                <span className="font-medium block">Fecha:</span> 
                <span className="font-bold">{new Date(currentOrder.created_at).toLocaleDateString()}</span>
              </div>
              <div className=" flex gap-2 p-2 rounded">
                <span className="font-medium block">Productos:</span> 
                <span className="font-bold">{currentOrder.quantity_products}</span>
              </div>
              <div className=" flex gap-2 p-2 rounded ">
                <span className="font-medium block">Precio total:</span> 
                <span className="text-lg font-bold">${currentOrder.total_price}</span>
              </div>
            </div>
            
            {/* Products section */}
            {currentOrder.store_variant && currentOrder.store_variant.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium mb-2 border-b pb-1">Detalle de productos</h4>
                
                {currentOrder.store_variant.map((item: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-base">{item.produc_title}</span>
                      <span className="font-bold">${item.total_price_for_product}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Tienda:</span> {item.store_name}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Precio unitario:</span> ${item.price}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Cantidad:</span> {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-center my-3">
          Forma de pago
        </h2>
        <Accordion
          selectedKeys={selectedKeys}
          onSelectionChange={(key) => {
            const checkbox = methodPayment.find((e) => e === Array.from(key)[0])
            selectedCheckbox(
              (checkbox || "coinpal_pay") as
                | "automatic_binance_pay"
                | "manual_binance_pay"
                | "bitcoin_ethereum_litecoin_entrega_automatica"
                | "coinpal_pay"
            )
            setSelectedKeys(key)
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
                className={`${checkbox != methodPayment[3] ? "hidden" : ""}`}
                defaultSelected
                radius="full"
                isSelected={checkbox == methodPayment[3]}
                onChange={() => {
                  selectedCheckbox(
                    methodPayment[3] as
                      | "automatic_binance_pay"
                      | "manual_binance_pay"
                      | "bitcoin_ethereum_litecoin_entrega_automatica"
                      | "coinpal_pay"
                  )
                }}
              />
            }
          >
            <div className="font-normal px-4 md:px-12 text-sm pb-5">
              <p>Paga en USDT usando CoinPal y paga con Binance Pay</p>
              <br />
              <p>
                Importante: desde el 21 de septiembre Binance decidió fijar una
                tasa del 1% de comisión en sus transacciones de Binance Pay.
                Este método de pago tiene un <b>1% de comisión.</b>
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
                className={`${checkbox != methodPayment[1] ? "hidden" : ""}`}
                radius="full"
                isSelected={checkbox == methodPayment[1]}
                onChange={() => {
                  selectedCheckbox(
                    methodPayment[1] as
                      | "automatic_binance_pay"
                      | "manual_binance_pay"
                      | "bitcoin_ethereum_litecoin_entrega_automatica"
                      | "coinpal_pay"
                  )
                }}
              />
            }
          >
            <div className="font-normal px-12 text-sm pb-5">
              <p>
                Por favor use Binance Pay ID 202554183 o escanee el código QR
                con su aplicación de Binance. Se debe subir el comprobante de
                pago en la siguiente página, todos los pagos serán comprobados
                manualmente.
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
