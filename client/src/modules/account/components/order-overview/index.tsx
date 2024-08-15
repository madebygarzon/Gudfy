"use client"
import React, { useEffect } from "react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import clsx from "clsx"
import Link from "next/link"
import Timer from "@lib/util/timer-order"
import { useMeCustomer } from "medusa-react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react"
import { useState } from "react"
import { Button as ButtonIcon } from "@nextui-org/react"
import { Button } from "@medusajs/ui"
import { ThumbUp, ThumbDown, PauseSolid } from "@medusajs/icons"
import { AddStoreReview } from "@modules/account/actions/post-add-store-review"
import { validateComment } from "@modules/account/actions/get-validate-review"

type props = {
  orderData: order
  onClose: () => void
  handlerReset: () => void
}
type propsStoreReviwe = {
  store_name: string
  store_id: string
  store_order_id: string
  rating: number
  customer_name: string
  customer_id: string
  content: string
}
const OrderDetails = ({ orderData, onClose }: props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { customer } = useMeCustomer()
  const [stores, setStore] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [storeReviewData, setStoreReviewData] = useState<propsStoreReviwe>({
    store_name: " ",
    store_id: " ",
    store_order_id: " ",
    customer_name: " ",
    customer_id: " ",
    content: " ",
    rating: 0,
  })

  useEffect(() => {
    if (loading) {
      validateComment(orderData.id).then((e) => {
        setStore(e)
        setLoading(false)
      })
    }
  }, [loading])

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <p className="text-base">
          El pedido{" "}
          <span className="font-bold">
            #{orderData.id.replace("store_order_id_", "")}
          </span>{" "}
          se realizó el{" "}
          <span className="font-bold">
            {handlerformatDate(orderData.created_at)}
          </span>{" "}
          y está actualmente{" "}
          <span
            className={clsx("font-bold", {
              " text-red-500": orderData.state_order === "Cancelado",
              " text-green-500": orderData.state_order === "Completado",
              " text-yellow-500": orderData.state_order === "Pendiente de pago",
              " text-blue-500": orderData.state_order === "Finalizado",
              " text-orange-500": orderData.state_order === "En discusión",
            })}
          >
            {orderData.state_order}
          </span>
          .
          {orderData.state_order === "Pendiente de pago" ||
          orderData.state_order === "Cancelado" ? (
            <span className="flex text-sm gap-1">
              Cancelacion automatica:
              <Timer creationTime={orderData.created_at} />
            </span>
          ) : (
            <></>
          )}
        </p>
      </div>
      <p className="font-bold text-sm">
        {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
      </p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Detalles del pedido</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Producto</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData.store_variant.map((p, i) => (
              <>
                <tr className="border-b">
                  <td className="py-2 px-4 border-r  flex justify-between">
                    <div>
                      {p.produc_title} – ${p.price} USD x {p.quantity}
                      <br />
                    </div>
                    <div className="text-sm font-light">
                      <p>Vendido por: {p.store_name}</p>
                      {orderData.state_order === "Completado" ? (
                        <>
                          {!loading ? (
                            stores.includes(p.store_id) ? (
                              <span>¡Ya comentaste!</span>
                            ) : (
                              <button
                                className="text-indigo-600 text-sm"
                                onClick={() => {
                                  onOpen()
                                  setStoreReviewData({
                                    store_name: p.store_name,
                                    store_id: p.store_id,
                                    store_order_id: orderData.id,
                                    customer_name: customer?.last_name || " ",
                                    customer_id: customer?.id || " ",
                                    content: "",
                                    rating: 0,
                                  })
                                }}
                              >
                                Califica esta tienda
                              </button>
                            )
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b ">
                    ${p.total_price_for_product} USD
                  </td>
                </tr>
              </>
            ))}
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Subtotal:</td>
              <td className="py-2 px-4 border-r">
                $
                {orderData.store_variant.reduce((sum, p) => {
                  return sum + parseFloat(p.total_price_for_product)
                }, 0)}{" "}
                USD
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r ">
                Comisión de la pasarela de pago:
              </td>
              <td className="py-2 px-4 ">$0.23</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Método de pago:</td>
              <td className="py-2 px-4 ">Binance Pay Entrega Automática</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 border-r">Total:</td>
              <td className="py-2 px-4 border-b">
                $
                {orderData.store_variant.reduce((sum, p) => {
                  return sum + parseFloat(p.total_price_for_product)
                }, 0.23)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="z-30">
        <ModalQualify
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          storeReviewData={storeReviewData}
          setStoreReviewData={setStoreReviewData}
          setLoading={setLoading}
        />
      </div>
      <div className="w-full"></div>
    </div>
  )
}

interface ModalOrder {
  storeReviewData?: propsStoreReviwe
  setStoreReviewData: React.Dispatch<React.SetStateAction<propsStoreReviwe>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  onOpenChange: () => void
}

const ModalQualify = ({
  storeReviewData,
  setStoreReviewData,
  setLoading,
  isOpen,
  onOpenChange,
}: ModalOrder) => {
  const [success, setSuccess] = useState<boolean>(false)

  const handleRatingClick = (rate: number) => {
    setStoreReviewData((data) => ({
      ...data,
      rating: rate,
    }))
  }

  const handleSubmit = () => {
    AddStoreReview({
      store_id: storeReviewData?.store_id,
      store_order_id: storeReviewData?.store_order_id,
      content: storeReviewData?.content,
      customer_id: storeReviewData?.customer_id,
      customer_name: storeReviewData?.customer_name,
      rating: storeReviewData?.rating,
    }).then(() => {
      setSuccess(true)
      setLoading(true)
    })
  }

  useEffect(() => {
    setSuccess(false)
  }, [])

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            {!success ? (
              <ModalBody>
                <div className="w-auto mx-auto pt-4  rounded  bg-white">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-gf">
                    Calificar a {storeReviewData?.store_name}
                  </h2>
                  <p className="py-4">
                    En Gudfy, nos importa que tanto nuestros clientes como
                    vendedores disfruten de una excelente experiencia de
                    usuario. Por eso, te invitamos a calificar tu experiencia
                    con el producto, dándole una valoración de Bueno, no tan
                    Bueno o Neutral ¡Tu opinión es muy valiosa para nosotros!{" "}
                  </p>
                  <div className="flex mb-4 gap-2">
                    <ButtonIcon
                      isIconOnly
                      className={clsx("border border-blue-600", {
                        "bg-blue-200": storeReviewData?.rating === 5,
                        "bg-white": storeReviewData?.rating !== 5,
                      })}
                      onClick={() => handleRatingClick(5)}
                    >
                      <ThumbUp color="#297dfa" />
                    </ButtonIcon>
                    <ButtonIcon
                      isIconOnly
                      className={clsx("border border-red-600", {
                        "bg-red-200": storeReviewData?.rating === 1,
                        "bg-white": storeReviewData?.rating !== 1,
                      })}
                      onClick={() => handleRatingClick(1)}
                    >
                      {" "}
                      <ThumbDown color="#bb1919" />
                    </ButtonIcon>
                    <ButtonIcon
                      isIconOnly
                      className={clsx("border border-yellow-600", {
                        "bg-yellow-200": storeReviewData?.rating === 3,
                        "bg-white": storeReviewData?.rating !== 3,
                      })}
                      onClick={() => handleRatingClick(3)}
                    >
                      <div className="rotate-90">
                        <PauseSolid color="#f1c40f" />
                      </div>
                    </ButtonIcon>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded mb-4 focus:border-blue-gf focus:outline-none"
                    placeholder="Escribe un comentario..."
                    value={storeReviewData?.content}
                    onChange={(e) =>
                      setStoreReviewData((data) => ({
                        ...data,
                        content: e.target.value,
                      }))
                    }
                  />
                  <Button
                    onClick={handleSubmit}
                    className="text-white bg-[#402e72]  hover:bg-[#2c1f57] rounded-[5px]"
                    disabled={
                      storeReviewData?.rating === 0 ||
                      storeReviewData?.content.trim() === ""
                    }
                  >
                    Enviar Calificación
                  </Button>
                </div>
              </ModalBody>
            ) : (
              <ModalBody>
                {" "}
                <div className="w-full flex justify-center items-center ">
                  {" "}
                  <div>Gracias por tu comentario</div>{" "}
                </div>
              </ModalBody>
            )}

            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default OrderDetails
