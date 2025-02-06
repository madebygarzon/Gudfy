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
import { FaPlus, FaEye } from "react-icons/fa6"
import OrderRevie from "../order-review"
import { PlusMini } from "@medusajs/icons"
import { Button as ButtonMedusa } from "@medusajs/ui"
import Link from "next/link"
import { getListOrders } from "@modules/account/actions/get-list-orders"
import { useMeCustomer } from "medusa-react"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import { useOrderGudfy } from "@lib/context/order-context"
import ModalOrderComplete from "../order-status/complete"
import ModalOrderPending from "../order-status/pay-pending"
import ModalOrderCancel from "../order-status/cancel"
import ModalOrderFinished from "../order-status/finished"
import { SellerOrder, useSellerStoreGudfy } from "@lib/context/seller-store"
import { EyeSeeIcon } from "@lib/util/icons"
import Loader from "@lib/loader"
import { formatPrice } from "@lib/format-price"
import DownloadButton from "@modules/common/components/download-button"

const SellerOrderTable: React.FC = () => {
  const { listSellerOrders, handlerGetListSellerOrder, isLoadingOrders } =
    useSellerStoreGudfy()
  const handleReset = () => {
    handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
    | "all"
  >("all")
  const [selectOrderData, setSelectOrderData] = useState<SellerOrder>({
    id: "",
    person_name: "",
    created_at: "",
    state_order: "Cancelada",
    products: [
      {
        store_variant_order_id: "",
        variant_order_status_id: "",
        quantity: 0,
        total_price: 0,
        produc_title: "",
        price: 0,
        serial_code_products: [],
      },
    ],
  })

  const filteredOrder =
    filterStatus === "all"
      ? listSellerOrders
      : listSellerOrders?.filter((order) => order.state_order === filterStatus)

  const getStatusColor = (
    status:
      | "Completado"
      | "Cancelada"
      | "Pendiente de pago"
      | "Finalizado"
      | "En discusión"
  ): string => {
    switch (status) {
      case "Completado":
        return "bg-blue-200"
      case "Cancelada":
        return "bg-red-200"
      case "Pendiente de pago":
        return "bg-yellow-200"
      case "Finalizado":
        return "bg-green-200"
      case "En discusión":
        return "bg-orange-300"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    handlerGetListSellerOrder()
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="w-96 flex flex-wrap items-center justify-between gap-4  bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <label
              htmlFor="status-filter"
              className="mr-4 font-semibold text-gray-700 text-sm lg:text-base"
            >
              Filtrar por estado:
            </label>
            <select
              id="status-filter"
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm lg:text-base bg-white"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "Cancelada"
                    | "Pendiente de pago"
                    | "Finalizado"
                    | "En discusión"
                    | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Pendiente de pago">Pendiente de pago</option>
              <option value="Finalizado">Finalizado</option>
              <option value="En discusión">En discusión</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                {/* <th className="py-2 text-left">Estado de la orden</th> */}
                <th className="py-2 text-left">Pago</th>
                <th className="py-2 text-left">Numero de orden</th>
                <th className="py-2 text-left">Fecha y hora de creación</th>
                <th className="py-2 text-left">Detalle de la orden</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingOrders ? (
                filteredOrder?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* <td className=" py-2">
                      <p
                        className={`${getStatusColor(
                          order.state_order
                        )} px-4 py-2 rounded-lg `}
                      >
                        {order.state_order}
                      </p>
                    </td> */}
                    <td className=" px-4 py-2">
                      {order.state_order === "Pendiente de pago" ? (
                        <Timer creationTime={order.created_at} />
                      ) : order.state_order === "Cancelada" ? (
                        // <XMarkMini className="text-red-600" />
                        <p className="text-red-600">Expirado</p>
                      ) : order.state_order === "Completado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "Finalizado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "En discusión" ? (
                        <CheckMini className="text-green-600" />
                      ) : (
                        <>asdasd</>
                      )}
                    </td>
                    <td className="px-4 py-2 ">{order.id}</td>
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.created_at)}
                    </td>

                    <td className="px-4 py-2">
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      />

                      {/* <ButtonMedusa
                        className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72]"
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      >
                        <FaEye />
                        Ver detalle de la orden
                      </ButtonMedusa> */}
                    </td>
                  </tr>
                ))
              ) : (
                <Loader />
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalOrder
        orderData={selectOrderData}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

interface ModalOrder {
  orderData: SellerOrder
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrder: React.FC<ModalOrder> = ({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed_ID":
        return "bg-blue-200"
      case "Cancel_ID":
        return "bg-red-200"
      case "Payment_Pending_ID":
        return "bg-yellow-200"
      case "Finished_ID":
        return "bg-green-200"
      case "Paid_ID":
        return "bg-gray-200"
      case "Discussion_ID":
        return "bg-orange-200"
      default:
        return ""
    }
  }
  const handlerState = (state_id: string) => {
    switch (state_id) {
      case "Finished_ID":
        return "Finalizado"
      case "Completed_ID":
        return "Completado"
      case "Discussion_ID":
        return "En reclamo"
      case "Paid_ID":
        return "Pagado"
      case "Payment_Pending_ID":
        return "Pendiente por Pagar"
      case "Cancel_ID":
        return "Cancelada"
      default:
        return ""
    }
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="flex justify-center">
              <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
                Detalles del pedido
              </h2>
            </ModalHeader>

            {/* Body */}
            <ModalBody className="p-6">
              {/* Order Information */}
              <div className="mb-4">
                <p>
                  <strong>ID del pedido:</strong> {orderData.id}
                </p>
                <p>
                  <strong>Nombre del cliente:</strong> {orderData.person_name}
                </p>
                <p>
                  <strong>Fecha de creación:</strong>{" "}
                  {new Date(orderData.created_at).toLocaleString()}
                </p>
                <p>
                  {/* <strong>Estado del Pedido:</strong> {orderData.state_order} */}
                </p>
              </div>

              {/* Products Table */}
              <div className="">
                <table className="min-w-full rounded-lg shadow-2xl p-8">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Estado del producto en la orden
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Título del Producto
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Cantidad
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Precio Unitario
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Precio Total
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Codigos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.products.map((product) => (
                      <tr key={product.store_variant_order_id}>
                        <td
                          className={`border-slate-200 px-4 py-2 ${getStatusColor(
                            product.variant_order_status_id
                          )}`}
                        >
                          {handlerState(product.variant_order_status_id)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          {product.produc_title}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          {product.quantity}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          ${formatPrice(product.price)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          ${formatPrice(product.total_price)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          <p className="items-center  font-medium">
                            <DownloadButton
                              data={product.serial_code_products.map(
                                (sc) => sc.serial
                              )}
                              filename={product.produc_title}
                            />
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex justify-end space-x-4">
              {/* <Button
                onPress={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cerrar
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default SellerOrderTable
