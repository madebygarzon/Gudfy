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
import { ThumbUp, ThumbDown, PauseSolid, Loader } from "@medusajs/icons"
import { AddStoreReview } from "@modules/account/actions/post-add-store-review"
import { validateComment } from "@modules/account/actions/get-validate-review"
import ButtonLigth from "@modules/common/components/button_light"
import { BlankIcon } from "@lib/util/icons"

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

  const handlerSubTotal = () => {
    return orderData.store_variant.reduce((sum, p) => {
      return sum + parseFloat(p.total_price_for_product)
    }, 0)
  }

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
      <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
        Detalles del pedido
      </h2>

      <div className="m-8">
        <table className="min-w-full rounded-lg shadow-2xl p-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b border-slate-200">Producto</th>
              <th className="py-2 px-4 border-b border-slate-200">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.store_variant.map((p, i) => (
              <>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-4 border-r border-slate-200 flex justify-between">
                    <div>
                      {p.produc_title} – ${p.price} USD x {p.quantity}
                      <br />
                    </div>
                    <div className="text-sm font-light">
                      <p>
                        Vendido por:{" "}
                        <Link
                          className="text-lila-gf capitalize"
                          href={`/seller/store/${p.store_id}`}
                        >
                          {p.store_name}
                        </Link>
                      </p>
                      {orderData.state_order === "Finalizado" ? (
                        <>
                          {!loading ? (
                            stores.includes(p.store_id) ? (
                              <span className="text-lila-gf">
                                ¡Ya comentaste esta tienda!
                              </span>
                            ) : (
                              <button
                                className="text-lila-gf flex justify-center items-center gap-2 text-sm px-4"
                                onClick={() => {
                                  onOpen()
                                  setStoreReviewData({
                                    store_name: p.store_name,
                                    store_id: p.store_id,
                                    store_order_id: orderData.id,
                                    customer_name: customer
                                      ? customer?.last_name +
                                        customer?.first_name
                                      : " ",
                                    customer_id: customer?.id || " ",
                                    content: "",
                                    rating: 0,
                                  })
                                }}
                              >
                                Califica esta tienda
                                <BlankIcon className="w-4" />
                              </button>
                            )
                          ) : (
                            <Loader />
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-slate-200">
                    ${p.total_price_for_product} USD
                  </td>
                </tr>
              </>
            ))}
            <tr className="border-b border-slate-200">
              <td className="py-2 px-4 border-r border-slate-200">Subtotal:</td>
              <td className="py-2 px-4 border-r border-slate-200">
                ${handlerSubTotal()} USD
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-4 border-r border-slate-200">
                Comisión de la pasarela de pago: 1%
              </td>
              <td className="py-2 px-4 ">${handlerSubTotal() * 0.01}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-4 border-r border-slate-200">
                Método de pago:
              </td>
              <td className="py-2 px-4 ">Binance Pay Entrega Automática</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-4 border-r border-slate-200">Total:</td>
              <td className="py-2 px-4 border-b border-slate-200">
                $
                {orderData.store_variant.reduce((sum, p) => {
                  return sum + parseFloat(p.total_price_for_product)
                }, handlerSubTotal() * 0.01)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-8">
        <p className="text-base">
          El pedido <span className="font-bold">#{orderData.id}</span> se
          realizó el{" "}
          <span className="font-bold">
            {handlerformatDate(orderData.created_at)}
          </span>{" "}
          y está actualmente{" "}
          <span
            className={clsx("font-bold", {
              " text-red-500": orderData.state_order === "Cancelada",
              " text-blue-500": orderData.state_order === "Completado",
              " text-yellow-500": orderData.state_order === "Pendiente de pago",
              " text-green-500": orderData.state_order === "Finalizado",
              " text-orange-500": orderData.state_order === "En discusión",
            })}
          >
            {orderData.state_order}
          </span>
          .
          {orderData.state_order === "Pendiente de pago" ||
          orderData.state_order === "Cancelada" ? (
            <span className="flex gap-1">
              Cancelacion automatica:
              <div className="font-bold">
                <Timer creationTime={orderData.created_at} />
              </div>
            </span>
          ) : (
            <></>
          )}
        </p>
        <p className="font-bold">
          {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
        </p>
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
                <div className="px-8 w-auto mx-auto rounded  bg-white">
                  <h2 className="text-2xl mt-4 font-bold text-gray-700 text-center">
                    Califica a {storeReviewData?.store_name}
                  </h2>
                  <p className="py-4">
                    En Gudfy, nos esforzamos por garantizar una experiencia
                    excepcional tanto para nuestros clientes como para nuestros
                    vendedores. Por ello, te invitamos a compartir tu opinión
                    sobre el producto calificándolo como Bueno, No tan bueno o
                    Neutral. ¡Tu feedback es invaluable para nosotros y nos
                    ayuda a mejorar continuamente!{" "}
                  </p>
                  <div className="flex justify-center mb-4 gap-2">
                    <ButtonIcon
                      isIconOnly
                      className={clsx("border border-[#218838]", {
                        "bg-blue-200": storeReviewData?.rating === 5,
                        "bg-white": storeReviewData?.rating !== 5,
                      })}
                      onClick={() => handleRatingClick(5)}
                    >
                      <ThumbUp color="#218838" />
                    </ButtonIcon>
                    <ButtonIcon
                      isIconOnly
                      className={clsx("border border-[#C0392B]", {
                        "bg-red-200": storeReviewData?.rating === 1,
                        "bg-white": storeReviewData?.rating !== 1,
                      })}
                      onClick={() => handleRatingClick(1)}
                    >
                      {" "}
                      <ThumbDown color="#C0392B" />
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
                    className="w-full border-none p-2 rounded-lg shadow-2xl"
                    placeholder="Escribe un comentario..."
                    value={storeReviewData?.content}
                    onChange={(e) =>
                      setStoreReviewData((data) => ({
                        ...data,
                        content: e.target.value,
                      }))
                    }
                  />
                  <div className="mt-6 flex justify-center">
                    <ButtonLigth
                      onClick={handleSubmit}
                      className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                      disabled={
                        storeReviewData?.rating === 0 ||
                        storeReviewData?.content.trim() === ""
                      }
                    >
                      Enviar calificación
                    </ButtonLigth>
                  </div>
                </div>
              </ModalBody>
            ) : (
              <ModalBody>
                {" "}
                <div className="w-full flex justify-center items-center ">
                  {" "}
                  <h3 className="text-xl font-bold">
                    ¡Gracias por tu comentario!
                  </h3>{" "}
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
