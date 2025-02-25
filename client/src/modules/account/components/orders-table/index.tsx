"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import { useMeCustomer } from "medusa-react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import { useOrderGudfy } from "@lib/context/order-context"
import ModalOrderCancel from "../order-status/cancel"
import Loader from "@lib/loader"
import { EyeSeeIcon } from "@lib/util/icons"
import ModalOrderDetail from "../order-status/detail-order"

type orders = {
  orders: order[]
}

// interface Ticket {
//   id: number
//   status: "" | "Por pagar" | "Completado"
//   orderNumber: string
//   createdAt: string
// }

const TicketTable: React.FC = () => {
  const { listOrder, handlerListOrder, isLoading } = useOrderGudfy()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const handleReset = (idResetOrder?: string) => {
    handlerListOrder()
    onClose()
    onOpen()
    onOpenChange()
  }

  const [filterStatus, setFilterStatus] = useState<
    | "Cancelada"
    | "Completado"
    | "En discusión"
    | "Finalizado"
    | "Pagado"
    | "Pendiente de pago"
    | "all"
  >("all")

  const [selectOrderData, setTelectOrderData] = useState<order>()

  const filteredOrder =
    filterStatus === "all"
      ? listOrder
      : listOrder?.filter((order) => order.state_order === filterStatus)

  const getStatusColor = (
    status:
      | "Cancelada"
      | "Completado"
      | "En discusión"
      | "Finalizado"
      | "Pagado"
      | "Pendiente de pago"
  ): string => {
    switch (status) {
      case "Completado":
        return "bg-blue-500 text-white"
      case "Cancelada":
        return "text-red-500"
      case "Pendiente de pago":
        return "bg-yellow-400 text-white"
      case "Finalizado":
        return "bg-green-500 text-white"
      case "Pagado":
        return "bg-teal-500 text-white"
      case "En discusión":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-300"
    }
  }

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }

  useEffect(() => {
    handlerListOrder()
  }, [])

  return (
    <div className="w-full p-1 md:p-6">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <label
              htmlFor="status-filter"
              className="font-semibold text-gray-700 text-sm md:text-base"
            >
              Filtrar por estado:
            </label>
            <select
              id="status-filter"
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base bg-white mt-2 md:mt-0"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "Cancelada"
                    | "Completado"
                    | "En discusión"
                    | "Finalizado"
                    | "Pagado"
                    | "Pendiente de pago"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Pendiente de pago">Pendiente de pago</option>
              <option value="Completado">Completado</option>
              <option value="Finalizado">Finalizado</option>
              <option value="En discusión">En discusión</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-scroll" style={{ transform: "scaleX(-1)" }}>
          <table
            className="min-w-full bg-white rounded-lg shadow-md"
            style={{ transform: "scaleX(-1)" }}
          >
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left text-sm md:text-base">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-sm md:text-base">
                  Número de orden
                </th>
                <th className="px-4 py-2 text-left text-sm md:text-base">
                  Fecha y hora
                </th>
                <th className="px-4 py-2 text-left text-sm md:text-base">
                  Tiempo a pagar
                </th>
                <th className="px-4 py-2 text-center text-sm md:text-base">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                filteredOrder?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm md:text-base ${getStatusColor(
                          order.state_order
                        )}`}
                      >
                        {order.state_order}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      {order.id.replace("store_order_id_", "")}
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      {handlerformatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      {order.state_order === "Pendiente de pago" ? (
                        <Timer creationTime={order.created_at} />
                      ) : order.state_order === "Cancelada" ? (
                        <p className="text-red-600">Expirado</p>
                      ) : ["Completado", "Finalizado", "En discusión"].includes(
                          order.state_order
                        ) ? (
                        <CheckMini className="text-green-600" />
                      ) : null}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setTelectOrderData(order)
                          onOpen()
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    <Loader />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!isLoading && !filteredOrder?.length && (
            <div className="p-6 flex items-center justify-center text-gray-700 text-sm md:text-base">
              <XMarkMini /> Aún no tienes órdenes.
            </div>
          )}
        </div>
      </div>
      <ModalOrder
        orderData={selectOrderData}
        isOpen={isOpen}
        handleReset={handleReset}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </div>
  )
}

interface ModalOrder {
  orderData?: order
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
  onClose: () => void
}

const ModalOrder = ({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
  onClose,
}: ModalOrder) => {
  const { customer } = useMeCustomer()
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {
      onOpenChange()
      handleReset()
    })
  }
  const [orderState, setOrderState] = useState<order | undefined>(orderData)

  useEffect(() => {
    setOrderState(orderData)
  }, [orderData])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="5xl"
    >
      <ModalContent>
        {(onClose) =>
          orderState?.state_order === "Cancelada" ? (
            <ModalOrderCancel
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : (
            <ModalOrderDetail
              customer={customer}
              handleReset={handleReset}
              onOpenChangeMain={onOpenChange}
              orderData={orderData}
            />
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default TicketTable
