import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Accordion,
  AccordionItem,
} from "@nextui-org/react"
import Link from "next/link"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import { Customer } from "@medusajs/medusa"
import { addClaim } from "@modules/account/actions/post-add-claim"
import { updateFinishedOrder } from "@modules/account/actions/update-finished-order"
import { retriverProctsOrderClaim } from "@modules/account/actions/get-list-products-in-claim"
import { postFinishTheVariation } from "@modules/account/actions/orders/post-finish-the-variation"
import InputFile from "@modules/common/components/input-file"
import { validateComment } from "@modules/account/actions/get-validate-review"
import { formatPrice } from "@lib/format-price"
import { BlankIcon } from "@lib/util/icons"
import { ThumbUp, ThumbDown, PauseSolid, Loader } from "@medusajs/icons"
import { Button as ButtonIcon } from "@nextui-org/react"
import { AddStoreReview } from "@modules/account/actions/post-add-store-review"
import clsx from "clsx"
import ButtonLigth from "@modules/common/components/button_light"
import DownloadButton from "@modules/common/components/download-button"

interface ModalOrderProps {
  orderData?: order
  onOpenChangeMain: () => void
  handleReset: () => void
  customer: Omit<Customer, "password_hash"> | undefined
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

const ModalOrderDetail = ({
  orderData,
  onOpenChangeMain,
  handleReset,
  customer,
}: ModalOrderProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
    onClose: onClose2,
  } = useDisclosure()
  const [productSelect, setProductSelect] = useState<product | null>(null)

  // para las ordenes que ya estan finalizadas
  const [loading, setLoading] = useState<boolean>(true)
  const [stores, setStore] = useState<string[]>([]) // para saber si la tienda ya ha sido comentada
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
    if (loading && orderData) {
      validateComment(orderData.id).then((e) => {
        setStore(e)
        setLoading(false)
      })
    }
  }, [loading])

  const handlerState = (state_id: string) => {
    let state = "algo"
    switch (state_id) {
      case "Finished_ID":
        state = "Finalizado"
        break

      case "Paid_ID":
        state = "Finalizado"
        break

      case "Completed_ID":
        state = "Completado"
        break

      case "Discussion_ID":
        state = "En reclamo"
        break

      default:
        break
    }
    return state
  }

  const getColorState = (state_id: string) => {
    switch (state_id) {
      case "Finished_ID":
        return "text-green-500"

      case "Paid_ID":
        return "text-green-500"

      case "Completed_ID":
        return "text-blue-500"

      case "Discussion_ID":
        return "text-orange-500"

      default:
        break
    }
  }

  const handlerFinishTheVariation = (product: product) => {
    postFinishTheVariation(product.store_variant_order_id).then(() => {
      handleReset()
    })
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1"></ModalHeader>
      <ModalBody>
        {orderData ? (
          <div className="container mx-auto px-4 py-1 -mb-2">
            <h2 className="text-center text-2xl my-4 font-bold text-gray-700 ">
              Detalles del pedido
            </h2>

            <div className="">
              <table className="min-w-full rounded-lg shadow-2xl p-8">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-slate-200">
                      Producto
                    </th>
                    <th className="py-2 px-4 border-b border-slate-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.store_variant.map((p, i) => (
                    <>
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-4 border-r border-slate-200 flex justify-between">
                          <Accordion isCompact>
                            <AccordionItem
                              key={i}
                              aria-label="Accordion 1"
                              // indicator={}
                              title={
                                <div className="w-full flex">
                                  <div className="w-[60%] text-base">
                                    <p>{`${p.produc_title} – ${p.price} USD x ${p.quantity}`}</p>{" "}
                                  </div>
                                  <div className="w-[40%] text-xs text-center">
                                    <p className="">
                                      Vendido por: {p.store_name}
                                    </p>
                                    <span
                                      className={`${getColorState(
                                        p.variant_order_status_id
                                      )}`}
                                    >
                                      {handlerState(p.variant_order_status_id)}
                                    </span>
                                  </div>
                                </div>
                              }
                              className=""
                            >
                              <div className="py-2 px-4 ">
                                <div className="flex justify-between px-2">
                                  <div className="w-[60%] text-sm font-light">
                                    <p className="items-center  font-medium">
                                      Descargar {p.serial_code_products.length}{" "}
                                      codigos :
                                      <DownloadButton
                                        data={p.serial_code_products.map(
                                          (sc) => sc.serial
                                        )}
                                        filename={p.produc_title}
                                      />
                                    </p>
                                  </div>

                                  <div className="w-[40%] text-center">
                                    {p.variant_order_status_id ===
                                      "Finished_ID" ||
                                    p.variant_order_status_id === "Paid_ID" ? (
                                      <div className="text-center">
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
                                                  onOpen2()
                                                  setStoreReviewData({
                                                    store_name: p.store_name,
                                                    store_id: p.store_id,
                                                    store_order_id:
                                                      orderData.id,
                                                    customer_name: customer
                                                      ? customer?.last_name +
                                                        customer?.first_name
                                                      : " ",
                                                    customer_id:
                                                      customer?.id || " ",
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
                                      </div>
                                    ) : p.variant_order_status_id ===
                                      "Completed_ID" ? (
                                      <div className=" w-full justify-center gap-2">
                                        <Button
                                          size="sm"
                                          className="m-0 p-1 text-sm w-full font-medium rounded-sm mb-0.5 bg-orange-500 text-white"
                                          onPress={() => {
                                            setProductSelect(p)
                                            onOpen()
                                          }}
                                        >
                                          Reclamar
                                        </Button>{" "}
                                        <Button
                                          size="sm"
                                          className="m-0 p-1 text-sm w-full rounded-sm font-medium bg-green-500 text-white"
                                          onPress={() =>
                                            handlerFinishTheVariation(p)
                                          }
                                        >
                                          Finalizar
                                        </Button>
                                      </div>
                                    ) : p.variant_order_status_id ===
                                      "Claim_ID" ? (
                                      <div className="w-full text-center">
                                        {" "}
                                        este producto se encuentra en
                                        reclamacion
                                      </div>
                                    ) : (
                                      <div className="flex gap-2"> </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </AccordionItem>
                          </Accordion>
                        </td>
                        <td className="py-2 px-4 border-b border-slate-200 ">
                          ${formatPrice(parseFloat(p.total_price_for_product))}{" "}
                          USD
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      Subtotal:
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      $
                      {orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product)
                      }, 0)}{" "}
                      USD
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200  ">
                      Comisión de la pasarela de pago:
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      $0.23
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      Método de pago:
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      Binance Pay Entrega Automática
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      Total:
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 ">
                      $
                      {orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product)
                      }, 0.23)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8">
              <p className="text-base">
                El pedido{" "}
                <span className="font-bold text-blue-gf">
                  #{orderData.id.replace("store_order_id_", "")}
                </span>{" "}
                se realizó el{" "}
                <span className="font-bold text-blue-gf">
                  {handlerformatDate(orderData.created_at)}
                </span>
                .
              </p>
              <p className="font-bold text-sm text-blue-gf">
                {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
              </p>
              <h2 className="text-sm  my-4 text-warning-600">
                * A partir de este momento, dispones de un plazo de 3 días para
                presentar cualquier reclamo. En caso de no recibir ningún
                reclamo dentro de este período, asumiremos que has recibido tu
                compra satisfactoriamente y tu orden será marcada como
                Finalizada.*
              </h2>
            </div>
            <div className="w-full"></div>
          </div>
        ) : (
          <>CARGANDO...</>
        )}
      </ModalBody>
      <ModalFooter></ModalFooter>
      <div className="z-30">
        <ModalQualify
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          product={productSelect}
          idOrder={orderData?.id}
          idCustomer={customer?.id}
          handleReset={handleReset}
          onClose={onClose}
        />
        <ModalReviw
          isOpen={isOpen2}
          onOpenChange={onOpenChange2}
          storeReviewData={storeReviewData}
          setStoreReviewData={setStoreReviewData}
          setLoading={setLoading}
        />
      </div>
    </>
  )
}

type product = {
  store_id: string
  store_name: string
  store_variant_order_id: string
  variant_order_status_id: string
  produc_title: string
  price: string
  quantity: string
  total_price_for_product: string
}

interface ModalOrder {
  product?: product | null
  idOrder?: string
  idCustomer?: string
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  handleReset: () => void
}

const ModalQualify = ({
  isOpen,
  onOpenChange,
  product,
  idOrder,
  idCustomer,
  handleReset,
  onClose,
}: ModalOrder) => {
  const [viewComment, setViewComment] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [image, setImage] = useState<File | undefined>()

  const handlerAddClaim = () => {
    if (!product) return

    addClaim(
      idOrder || " ",
      { ...product, comment },
      idCustomer || " ",
      image
    ).then(() => {
      setViewComment(false)
      handleReset()
      onClose()
    })
  }
  useEffect(() => {
    setComment("")
  }, [viewComment])
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <>
          <ModalHeader>
            {" "}
            <h1>Presentar Reclamos</h1>
          </ModalHeader>
          <ModalBody>
            <div className="w-full">
              <div className="p-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 ">
                    {product?.produc_title}
                  </h4>
                  <h5 className="text-sm font-semibold text-gray-600 ">
                    Por: {product?.store_name}
                  </h5>
                  <p className="text-gray-700 text-sm">
                    Precio: {product?.price} Cantidad: {product?.quantity}
                  </p>
                  <p className="text-gray-900 font-bold text-sm">
                    Total Precio: ${product?.total_price_for_product}
                  </p>
                </div>
                <label
                  htmlFor="claimReason"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Por favor, escriba el motivo de su reclamo:
                </label>
                <textarea
                  id="claimReason"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Escriba su motivo aquí..."
                />
              </div>
              <InputFile
                type="Image"
                alt="Image"
                label="Adjuntar imagen"
                file={image}
                setFile={setImage}
              />
              <Button
                className={`${
                  !comment.length ? "bg-slate-500" : " bg-blue-gf text-white"
                }`}
                onPress={() => handlerAddClaim()}
                isDisabled={!comment.length}
              >
                Presentar Reclamo
              </Button>
              <Button
                className=" ml-4"
                onPress={() => {
                  onClose()
                }}
              >
                Atrás
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            Una vez selecciones uno de los productos y agrege un comentario,
            estos abrirán un ticket de reclamo, el cual puedes ver en la sección
            de compras y pestaña reclamos.
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}

interface ModalReviw {
  storeReviewData?: propsStoreReviwe
  setStoreReviewData: React.Dispatch<React.SetStateAction<propsStoreReviwe>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  onOpenChange: () => void
}

const ModalReviw = ({
  storeReviewData,
  setStoreReviewData,
  setLoading,
  isOpen,
  onOpenChange,
}: ModalReviw) => {
  const [success, setSuccess] = useState<boolean>(false)

  const handleRatingClick = (rate: number) => {
    setStoreReviewData((data) => ({
      ...data,
      rating: rate,
    }))
  }

  const handleSubmitAddReview = () => {
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
                    Califica la tienda {storeReviewData?.store_name}
                  </h2>
                  <p className="py-4 text-sm">
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
                      onClick={handleSubmitAddReview}
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

export default ModalOrderDetail
