"use client"

import { useState, useEffect } from "react"
import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react"
import { FaEye, FaArrowLeft } from "react-icons/fa6"
import Image from "next/image"
import { Button as ButtonMedusa } from "@medusajs/ui"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import handlerformatDate from "@lib/util/formatDate"
import { getListOrderPayments } from "@modules/account/actions/get-list-order-payments"
import { useStore } from "@lib/context/store-context"
import { useSellerStoreGudfy } from "@lib/context/seller-store"
import Loader from "@lib/loader"
import { dataWallet } from "@modules/account/templates/wallet-template"
import { EyeSeeIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"

export type OrderPaymentData = {
  payment_id: string
  amoun_paid: number
  payment_note: string
  voucher: string
  commission: number
  subtotal: number
  payment_date: string
  products: [
    {
      name: string
      price: number
      quantity: number
      total_price: number
      store_order_id: string
      customer_name: string
    }
  ]
}

interface props {
  wallet: dataWallet
  setWallet: React.Dispatch<React.SetStateAction<dataWallet>>
}

const WalletTable = ({ wallet, setWallet }: props) => {
  const [listOrdersPayment, setListOrdersPayment] =
    useState<OrderPaymentData[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { storeSeller } = useSellerStoreGudfy()
  const handleReset = () => {
    // handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    "Pendiente" | "Pagado" | "Cancelado" | "all"
  >("all")
  const [selectOrderPaymentData, setSelectOrderData] =
    useState<OrderPaymentData>()

  const getStatusColor = (
    status: "Pendiente" | "Pagado" | "Cancelado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Pendiente":
        return "bg-yellow-200"
      case "Pagado":
        return "font-Abndsab blod"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handlerGetListOrdersPayments = () => {
    setIsLoading(true)
    getListOrderPayments(storeSeller?.id || " ")
      .then((e) => {
        setListOrdersPayment(e)
      })
      .catch((error) => {
        console.error("Error al cargar datos de pagos:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handlerGetListOrdersPayments()
  }, [storeSeller])

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md md:text-base text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Numero de Pago</th>
                <th className="px-4 py-2 text-left">Monto Pagado</th>
                <th className="px-4 py-2 text-left">Detalle del pago</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : listOrdersPayment && listOrdersPayment.length > 0 ? (
                listOrdersPayment.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.payment_date)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {order.payment_id}
                    </td>
                    <td className="px-4 py-2 text-green-600 ">
                      $ {order.amoun_paid}
                    </td>
                    <td className="px-4 py-2  ">
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-600 text-lg font-medium mb-1">
                        No hay datos disponibles
                      </p>
                      <p className="text-gray-500 text-sm">
                        No se encontraron pagos para mostrar
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalOrder
        ordePaymenmtData={selectOrderPaymentData}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

type Product = {
  id: string
  nombre: string
  pedido: string
  cliente: string
  cantidad: number
  valor: number
}
interface ModalOrder {
  ordePaymenmtData?: OrderPaymentData
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrder = ({
  ordePaymenmtData,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalOrder) => {
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {
      onOpenChange()
      handleReset()
    })
  }
  const commission = 0.01
  const [viewVoucher, setViewVoucher] = useState<boolean | null>(null)
  const subtotal =
    ordePaymenmtData?.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    ) || 0
  const totalComision =
    ordePaymenmtData?.products.reduce(
      (acc, product) => acc + product.price * product.quantity * commission,
      0
    ) || 0
  const totalFinal = subtotal - totalComision
  useEffect(() => {
    setViewVoucher(false)
  }, [isOpen])
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent className="bg-white p-6 rounded-lg shadow-lg">
        {!viewVoucher ? (
          <>
            <ModalHeader className="text-2xl font-bold text-center"></ModalHeader>
            <ModalBody>
              {/* Lista de productos */}
              <h2 className="text-center text-2xl my-4 font-bold text-gray-700 ">
                Recibo de pago
              </h2>

              <div className="overflow-y-scroll max-h-[350px] ">
                <table className="min-w-full rounded-lg shadow-2xl p-8">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Producto
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        N° Pedido
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Cliente
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Cantidad
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Valor Unitario
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Comisión (1%)
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Total Producto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordePaymenmtData?.products?.map((product, i) => {
                      const totalProducto = product.price * product.quantity
                      const comision = (totalProducto * commission).toFixed(2)
                      return (
                        <tr className="border-b border-slate-200" key={i}>
                          <td className="p-2 border-b">{product.name}</td>
                          <td className="p-2 border-b">
                            {product.store_order_id.replace(
                              "store_order_id_",
                              ""
                            )}
                          </td>
                          <td className="p-2 border-b">
                            {product.customer_name}
                          </td>
                          <td className="p-2 border-b text-right">
                            {product.quantity}
                          </td>
                          <td className="p-2 border-b text-right">
                            ${product.price}
                          </td>
                          <td className="p-2 border-b text-right">
                            ${comision}
                          </td>
                          <td className="p-2 border-b text-right">
                            ${totalProducto}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <p className="text-xs">
                  {" "}
                  <strong>Nota del pago: </strong>
                  {ordePaymenmtData?.payment_note}
                </p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between ">
                  <div>
                    <p>Subtotal:</p>
                  </div>
                  <div>${subtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between ">
                  <div>
                    <p>Total Comisión:</p>
                  </div>
                  <div>${totalComision.toFixed(2)}</div>
                </div>
                <div className="flex justify-between text-bold">
                  <div>Total Final:</div>
                  <div>${totalFinal.toFixed(2)}</div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end mt-6">
              {/* <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                onPress={() => setViewVoucher(true)}
              >
                Ver Comprobante
              </Button> */}

              <ButtonLigth
                // variant="transparent"
                className="bg-[#28A745] hover:bg-[#218838] text-white border-none"
                onClick={() => setViewVoucher(true)}
              >
                Ver comprobante
              </ButtonLigth>
            </ModalFooter>{" "}
          </>
        ) : (
          <>
            <ModalHeader>
              <ButtonLigth
                onClick={() => setViewVoucher(false)}
                // variant="transparent"
                className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
              >
                <FaArrowLeft className="mr-2" />
                Volver
              </ButtonLigth>

              {/* <Button onPress={() => setViewVoucher(false)}>
                <FaArrowLeft /> Volver
              </Button> */}
            </ModalHeader>
            <ModalBody className="flex justify-center items-center">
              <Image
                src={ordePaymenmtData?.voucher || ""}
                alt="voucher"
                height={500}
                width={500}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default WalletTable
