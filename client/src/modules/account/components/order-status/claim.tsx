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
          <div className="container mx-auto px-4 py-1 -mb-2">
            <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
              Detalles del pedido
            </h2>
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
            </div>
            <p className="font-bold text-sm">
              {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
            </p>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Detalles del pedido
              </h2>
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
                            <p>{handlerState(p.variant_order_status_id)}</p>
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
                    <td className="py-2 px-4 ">
                      Binance Pay Entrega Automática
                    </td>
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
            <div className="w-full"></div>
          </div>
        ) : (
          <>CARGANDO...</>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col gap-2 px-4">
          <div className=" flex gap-5">
            <Button className="bg-orange-600 text-white" onClick={onOpen}>
              {" "}
              Presentar otro reclamo Reclamo{" "}
            </Button>
          </div>
          <div>
            {" "}
            Por ahora alguno de tus productos se encuentra en estado de
            reclamación, por lo que puedes visualizarlos en la pestaña de
            Reclamos.
          </div>
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
      idCustomer || " "
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
              <h1>Presentar Reclamos</h1>
            </ModalHeader>
            <ModalBody>
              {viewComment ? (
                <div className="w-full">
                  <div className="p-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 ">
                        {productSelect?.produc_title}
                      </h4>
                      <h5 className="text-sm font-semibold text-gray-600 ">
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
                  <Button
                    className={`${
                      !comment.length
                        ? "bg-slate-500"
                        : " bg-blue-gf text-white"
                    }`}
                    onPress={() => handlerAddClaim()}
                    disabled={!comment.length}
                  >
                    Presentar Reclamo
                  </Button>
                  <Button
                    className=" ml-4"
                    onPress={() => {
                      setViewComment(false)
                    }}
                  >
                    Atrás
                  </Button>
                </div>
              ) : (
                <div className="p-4 flex flex-wrap justify-start gap-4 h-auto overflow-y-auto ">
                  {dataProducts?.map((product) => (
                    <div className="border rounded-lg shadow-lg p-4 w-[40%]  bg-white ">
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
                          <Button
                            className=""
                            onPress={() => {
                              setViewComment(true)
                              setProductSelect(product)
                            }}
                            isDisabled={
                              product.variant_order_status_id ===
                                "Finished_ID" ||
                              product.variant_order_status_id ===
                                "Discussion_ID"
                            }
                          >
                            {product.variant_order_status_id === "Finished_ID"
                              ? "Producto Finalizado"
                              : product.variant_order_status_id ===
                                  "Discussion_ID" && "En reclamación"}
                          </Button>
                        ) : (
                          <div>
                            <Button
                              className=""
                              onPress={() => {
                                setViewComment(true)
                                setProductSelect(product)
                              }}
                            >
                              Presentar Reclamo
                            </Button>{" "}
                            <Button
                              className=""
                              onPress={() => handlerFinishTheVariation(product)}
                            >
                              Finalizar Producto
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              Una vez selecciones uno de los productos y agrege un comentario,
              estos abrirán un ticket de reclamo, el cual puedes ver en la
              sección de compras y pestaña reclamos.
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalOrderClaim
