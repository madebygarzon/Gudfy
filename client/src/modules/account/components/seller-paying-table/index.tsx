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
} from "@nextui-org/react"
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
    getListOrderPayments(storeSeller?.id || " ").then((e) => {
      setListOrdersPayment(e)
    })
  }

  useEffect(() => {
    handlerGetListOrdersPayments()
  }, [storeSeller])

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Numero de Pago</th>
                <th className="px-4 py-2 text-left">Monto Pagado</th>
                <th className="px-4 py-2 text-left">Detalle del pago</th>
              </tr>
            </thead>
            <tbody>
              {listOrdersPayment?.length ? (
                listOrdersPayment?.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.payment_date)}
                    </td>
                    <td className="px-4 py-2 ">{order.payment_id}</td>
                    <td className="px-4 py-2 text-green-600 ">
                      {" "}
                      $ {order.amoun_paid}
                    </td>
                    <td className="px-4 py-2  ">
                      <ButtonMedusa
                        className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72] "
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      >
                        <FaEye />
                        Ver detalle del pago
                      </ButtonMedusa>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="mt-2">
                  <Loader />
                </div>
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

// Información falsa para el modal

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
            <ModalHeader className="text-2xl font-bold text-center mb-4">
              Recibo de Orden
            </ModalHeader>
            <ModalBody>
              {/* Lista de productos */}
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b">Producto</th>
                    <th className="p-2 border-b">N° Pedido</th>
                    <th className="p-2 border-b">Cliente</th>
                    <th className="p-2 border-b text-right">Cantidad</th>
                    <th className="p-2 border-b text-right">Valor Unitario</th>
                    <th className="p-2 border-b text-right">Comisión (1%)</th>
                    <th className="p-2 border-b text-right">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ordePaymenmtData?.products?.map((product, i) => {
                    const totalProducto = product.price * product.quantity
                    const comision = (totalProducto * commission).toFixed(2)
                    return (
                      <tr key={i}>
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
                        <td className="p-2 border-b text-right">${comision}</td>
                        <td className="p-2 border-b text-right">
                          ${totalProducto}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div>
                <p>
                  {" "}
                  <strong>Nota del pago: </strong>
                  {ordePaymenmtData?.payment_note}
                </p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between font-semibold text-lg">
                  <div>Subtotal:</div>
                  <div>${subtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <div>Total Comisión:</div>
                  <div>${totalComision.toFixed(2)}</div>
                </div>
                <div className="flex justify-between font-semibold text-xl mt-4">
                  <div>Total Final:</div>
                  <div>${totalFinal.toFixed(2)}</div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end mt-6">
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                onPress={() => setViewVoucher(true)}
              >
                Ver Comprobante
              </Button>
            </ModalFooter>{" "}
          </>
        ) : (
          <>
            <ModalHeader>
              <Button onPress={() => setViewVoucher(false)}>
                <FaArrowLeft /> Volver
              </Button>
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
