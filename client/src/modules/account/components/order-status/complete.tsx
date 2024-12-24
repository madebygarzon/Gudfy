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
import ButtonLigth from "@modules/common/components/button_light"
import Loader from "@lib/loader"

interface ModalOrderProps {
  orderData?: order
  onOpenChangeMain: () => void
  handleReset: () => void
  customer: Omit<Customer, "password_hash"> | undefined
}

const ModalOrderComplete = ({
  orderData,
  onOpenChangeMain,
  handleReset,
  customer,
}: ModalOrderProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handlerSubTotal = () => {
    if (!orderData?.store_variant) return 0
    return orderData?.store_variant.reduce((sum, p) => {
      return sum + parseFloat(p.total_price_for_product)
    }, 0)
  }

  const handlerFinishedOrder = () => {
    updateFinishedOrder(orderData?.id || " ").then(() => {
      handleReset()
    })
  }
  return (
    <>
      <ModalHeader className="flex flex-col gap-1"></ModalHeader>
      <ModalBody>
        {orderData ? (
          <div className="container mx-auto px-4 py-1 ">
            <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
              Detalles del pedido
            </h2>

            <div className="mb-8">
              <table className="mt-6 min-w-full rounded-lg shadow-2xl p-8">
                <thead className="">
                  <tr>
                    <th className="py-2 px-4 border-b text-gray-700 border-gray-200">
                      Producto
                    </th>
                    <th className="py-2 px-4 border-b text-gray-700 border-gray-200">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.store_variant.map((p, i) => (
                    <>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 border-r border-gray-200  ">
                          <div className="flex justify-between">
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
                            </div>
                          </div>
                          <div>
                            {p.serial_code_products?.map((sc) => (
                              <p key={sc.id} className="ml-2">
                                {sc.serial}
                              </p>
                            ))}
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
                      ${handlerSubTotal()}
                      USD
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-4 border-r border-gray-200 ">
                      Comisión de la pasarela de pago:
                    </td>
                    <td className="py-2 px-4 ">${handlerSubTotal() * 0.01}</td>
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
                      }, handlerSubTotal() * 0.01)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full"></div>

            <div className="ml-4">
              <p className="mt-6 text-sm">
                El pedido <span className="font-bold">#{orderData.id}</span> se
                realizó el{" "}
                <span className="font-bold">
                  {handlerformatDate(orderData.created_at)}
                </span>{" "}
                y está actualmente en estado{" "}
                <span className={"text-gray-700 font-extrabold"}>
                  {orderData.state_order}
                </span>
                .
              </p>
              <p className="text-sm">
                {`Orden por: ${customer?.first_name} ${customer?.last_name} correo: ${customer?.email}`}{" "}
              </p>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col gap-2 px-4">
          <div className="m-4">
            <p className="text-xs">
              * A partir de este momento, dispones de un plazo de 10 días para
              presentar cualquier reclamo. En caso de no recibir ningún reclamo
              dentro de este período, asumiremos que has recibido tu compra
              satisfactoriamente y tu orden será marcada como Finalizada.*
            </p>
          </div>

          <div className="flex justify-center gap-2">
            <ButtonLigth
              className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
              onClick={handlerFinishedOrder}
            >
              {" "}
              Finalizar compra{" "}
            </ButtonLigth>
            <ButtonLigth
              className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
              onClick={onOpen}
            >
              {" "}
              Presentar reclamo{" "}
            </ButtonLigth>
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
  const [viewComment, setViewComment] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")

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
  useEffect(() => {
    setComment("")
  }, [viewComment])
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {" "}
              <h2 className="block mx-auto text-2xl mt-2 font-bold text-gray-700">
                Presentar reclamos
              </h2>
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
                      className="mt-4 block text-gray-700 font-medium mb-2"
                    >
                      Por favor, escribe el motivo de tu reclamo:
                    </label>
                    <textarea
                      id="claimReason"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                      placeholder="Escriba su motivo aquí..."
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
                    className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                    onClick={() => {
                      setViewComment(false)
                    }}
                  >
                    Atrás
                  </ButtonLigth>
                  </div>
                 



                  



                </div>
              ) : (
                <div className="p-4 flex flex-wrap justify-start gap-4 h-auto overflow-y-auto ">
                  {dataProducts?.map((product) => (
                    <div className="rounded-lg shadow-2xl p-8 ">
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

                      <div className="mt-6">
                        <ButtonLigth
                          className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                          onClick={() => {
                            setViewComment(true)
                            setProductSelect(product)
                          }}
                          disabled={productsClaim?.includes(
                            product.store_variant_order_id
                          )}
                        >
                          {productsClaim?.includes(
                            product.store_variant_order_id
                          )
                            ? "¡Hecho!"
                            : "Presentar reclamo"}
                        </ButtonLigth>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="m-4">
                <p className="text-xs">
                  * Al seleccionar un producto y agregar un comentario, se
                  generará automáticamente un ticket de reclamo, el cual estará
                  disponible para su visualización en la sección de compras,
                  bajo la pestaña de mis reclamos. *
                </p>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalOrderComplete
