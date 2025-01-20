import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
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
import ButtonLigth from "@modules/common/components/button_light"
import Loader from "@lib/loader"

interface ModalOrderProps {
  orderData?: order
  onOpenChangeMain: () => void
  handleReset: () => void
  customer: Omit<Customer, "password_hash"> | undefined
}

const ModalOrderClaim = ({
  orderData,
  onOpenChangeMain,
  handleReset,
  customer,
}: ModalOrderProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handlerState = (state_id: string) => {
    let state = "algo"
    switch (state_id) {
      case "Finished_ID":
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

  return (
    <>
      <ModalHeader className="flex flex-col gap-1"></ModalHeader>
      <ModalBody>
        {orderData ? (
          <div className="container mx-auto px-4 py-1">
            <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
              Detalles del pedidos
            </h2>

            <div className="mb-8">
              <table className="max-h-80 overflow-y-auto mt-6 min-w-full rounded-lg shadow-2xl px-16 py-8">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-gray-700 border-gray-200">
                      Producto
                    </th>
                    <th className="py-2 px-4 border-b text-gray-700 border-gray-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {orderData.store_variant.map((p, i) => (
                    <>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 border-r border-gray-200">
                          <div className="flex justify-between">
                            {p.produc_title} – ${p.price} USD x {p.quantity}
                            <br />
                          </div>
                          <div className="text-sm font-light">
                            <p>Vendido por: {p.store_name}</p>
                            <p>{handlerState(p.variant_order_status_id)}</p>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 ">
                          ${p.total_price_for_product} USD
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200">
                      Subtotal:
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      $
                      {orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product)
                      }, 0)}{" "}
                      USD
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200 ">
                      Comisión de la pasarela de pago:
                    </td>
                    <td className="py-2 px-4 ">$0.23</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200">
                      Método de pago:
                    </td>
                    <td className="py-2 px-4 ">
                      Binance Pay Entrega Automática
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200">
                      Total:
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      $
                      {orderData.store_variant.reduce((sum, p) => {
                        return sum + parseFloat(p.total_price_for_product)
                      }, 0.23)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                <span className={"text-orange-500"}>
                  {orderData.state_order}
                </span>
                .
              </p>
              <p className="font-bold">
                {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
              </p>
            </div>

            <div className="w-full"></div>
          </div>
        ) : (
          <Loader />
        )}
      </ModalBody>
      <ModalFooter>
        <div className="block mx-auto px-4">
          <div className=" flex justify-center gap-5">
            <ButtonLigth
              className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
              onClick={onOpen}
            >
              {" "}
              Presentar otro reclamo{" "}
            </ButtonLigth>
          </div>
          <p className="mt-2 text-xs">
              {" "}
              Actualmente, algunos de tus productos están en estado de
              reclamación. Puedes revisarlos en la pestaña "Reclamos".
            </p>
        </div>
      </ModalFooter>
      <div className="z-30">
        <ModalQualify
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          dataProducts={orderData?.store_variant}
          idOrder={orderData?.id}
          idCustomer={customer?.id}
          handleReset={handleReset}
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
  dataProducts?: product[]
  idOrder?: string
  idCustomer?: string
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

const ModalQualify = ({
  isOpen,
  onOpenChange,
  dataProducts,
  idOrder,
  idCustomer,
  handleReset,
}: ModalOrder) => {
  const [productsClaim, setProductsClaim] = useState<string[]>()
  const [productSelect, setProductSelect] = useState<product | null>(null)
  const [productListClaim, setProductListClaim] = useState<string[]>([]) // produictos que ya se encuentran en reclamacion
  const [viewComment, setViewComment] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [image, setImage] = useState<File | undefined>()

  const handlerRetriver = () => {
    retriverProctsOrderClaim(idOrder || " ").then((data) => {
      setProductListClaim(data)
    })
  }

  const handlerAddClaim = () => {
    if (!productSelect) return
    setProductsClaim((old) =>
      old?.length
        ? [...old, productSelect.store_variant_order_id]
        : [productSelect.store_variant_order_id]
    )
    addClaim(
      idOrder || " ",
      { ...productSelect, comment },
      idCustomer || " ",
      image
    ).then(() => {
      setViewComment(false)
      handleReset()
    })
  }
  const handlerFinishTheVariation = (product: product) => {
    postFinishTheVariation(product.store_variant_order_id).then(() => {
      handleReset()
    })
  }
  useEffect(() => {
    setComment("")
    handlerRetriver()
  }, [viewComment])
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {" "}
              <h2 className="block mx-auto text-2xl mt-2 font-bold text-gray-700">
                Presentar reclamo
              </h2>
            </ModalHeader>
            <ModalBody>
              {viewComment ? (
                <div className="w-full">
                  <div className="p-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {productSelect?.produc_title}
                      </h4>
                      <h5 className="text-sm font-semibold text-gray-600">
                        Por: {productSelect?.store_name}
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Precio: {productSelect?.price} Cantidad:{" "}
                        {productSelect?.quantity}
                      </p>
                      <p className="text-gray-900 font-bold text-sm">
                        Total Precio: ${productSelect?.total_price_for_product}
                      </p>
                    </div>
                    <label
                      htmlFor="claimReason"
                      className="mt-4 block text-gray-700 font-medium mb-2"
                    >
                      Por favor, escribe el motivo de su reclamo:
                    </label>
                    <textarea
                      id="claimReason"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                      placeholder="Escriba su motivo aquí..."
                    />
                    <InputFile
                      type="Normal"
                      alt="Image"
                      label="Adjuntar imagen"
                      file={image}
                      setFile={setImage}
                      accept="image/*"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <ButtonLigth
                      className={`${
                        !comment.length
                          ? "bg-[#28A745] hover:bg-[#218838] text-white border-none"
                          : "bg-[#28A745] hover:bg-[#218838] text-white border-none"
                      }`}
                      onClick={() => handlerAddClaim()}
                      disabled={!comment.length}
                    >
                      Presentar reclamo
                    </ButtonLigth>
                    <ButtonLigth
                      className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none ml-4"
                      onClick={() => {
                        setViewComment(false)
                      }}
                    >
                      Atrás
                    </ButtonLigth>
                  </div>
                </div>
              ) : (
                <div className="p-3 flex flex-wrap justify-start gap-2 h-auto overflow-y-auto">
                  {dataProducts?.map((product) => (
                    <div className="rounded-lg shadow-2xl p-8">
                      <h4 className="text-lg font-bold text-gray-800 ">
                        {product.produc_title}
                      </h4>
                      <h5 className="text-sm font-semibold text-gray-600 ">
                        Por: {product.store_name}
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Precio: {product.price} Cantidad: {product.quantity}
                      </p>
                      <p className="text-gray-900 font-bold text-sm">
                        Total Precio: ${product.total_price_for_product}
                      </p>
                      <div className="flex justify-center w-full mt-2">
                        {product.variant_order_status_id === "Finished_ID" ||
                        product.variant_order_status_id === "Discussion_ID" ? (
                          <ButtonLigth
                            className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                            onClick={() => {
                              setViewComment(true)
                              setProductSelect(product)
                            }}
                            disabled={
                              product.variant_order_status_id ===
                                "Finished_ID" ||
                              product.variant_order_status_id ===
                                "Discussion_ID"
                            }
                          >
                            {product.variant_order_status_id === "Finished_ID"
                              ? "Producto finalizado"
                              : product.variant_order_status_id ===
                                  "Discussion_ID" && "En reclamación..."}
                          </ButtonLigth>
                        ) : (
                          <div className="">
                            <ButtonLigth
                              className="bg-[#E74C3C] hover:bg-[#C0392B] w-full text-white border-none"
                              onClick={() => {
                                setViewComment(true)
                                setProductSelect(product)
                              }}
                            >
                              Presentar reclamo
                            </ButtonLigth>{" "}
                            <ButtonLigth
                              className="bg-[#28A745] hover:bg-[#218838] w-full text-white border-none mt-2"
                              onClick={() => handlerFinishTheVariation(product)}
                            >
                              Finalizar producto
                            </ButtonLigth>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <p className="text-center text-xs">
                Al seleccionar un producto y agregar un comentario, se generará
                automáticamente un ticket de reclamo. Podrás visualizar este
                ticket en la sección de compras, dentro de la pestaña de
                reclamos
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalOrderClaim
