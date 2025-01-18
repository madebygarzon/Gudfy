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
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import { useOrderGudfy } from "@lib/context/order-context"
import ModalOrderComplete from "../order-status/complete"
import ModalOrderPending from "../order-status/pay-pending"
import ModalOrderCancel from "../order-status/cancel"
import ModalOrderFinished from "../order-status/finished"
import ModalOrderClaim from "../order-status/claim"
import Loader from "@lib/loader"
import { EyeSeeIcon } from "@lib/util/icons"

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
    <div className="w-full p-6">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4">
          <div>
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
          {/* <div className="">
            ¿Necesitas ayuda? Crea un ticket:
            <div className="flex justify-center mt-5">
              <ButtonMedusa
                className="text-white bg-[#402e72]  hover:bg-[#2c1f57] rounded-[5px]"
                onClick={onOpen}
              >
                <FaPlus />
                Nuevo ticket
              </ButtonMedusa>
            </div>
          </div> */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Estado de la orden</th>
                <th className="px-4 py-2 text-left">Numero de orden</th>
                <th className="px-4 py-2 100 text-left">
                  Fecha y hora de creación
                </th>
                <th className="px-4 py-2 text-left">Tiempo a pagar</th>
                <th className="px-4 py-2 text-left">Detalle de la orden</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                filteredOrder?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className=" py-2">
                      <p
                        className={`${getStatusColor(
                          order.state_order
                        )} px-4 py-2 rounded-lg `}
                      >
                        {order.state_order}
                      </p>
                    </td>

                    <td className="px-4 py-2 ">
                      {handlerOrderNumber(order.id)}
                    </td>
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.created_at)}
                    </td>
                    <td>
                      {order.state_order === "Pendiente de pago" ? (
                        <Timer creationTime={order.created_at} />
                      ) : order.state_order === "Cancelada" ? (
                        <p className="text-red-600">Expirado</p>
                      ) : ["Completado", "Finalizado", "En discusión"].includes(
                          order.state_order
                        ) ? (
                        <CheckMini className="text-green-600" />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {/* {(order.state_order === "Completado" ||
                        order.state_order === "Finalizado" ||
                        order.state_order === "Pendiente de pago" ||
                        order.state_order === "En discusión") && (
                        // <EyeSeeIcon />
                        <EyeSeeIcon
                          className="cursor-pointer hover:scale-110 transition-all"
                          onClick={() => {
                            setTelectOrderData(order)
                            onOpen()
                          }}
                        ></EyeSeeIcon>
                      )} */}
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setTelectOrderData(order)
                          onOpen()
                        }}
                      ></EyeSeeIcon>
                    </td>
                  </tr>
                ))
              ) : (
                <div className="p-6">
                  <Loader />
                </div>
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
          orderState?.state_order === "Pendiente de pago" ? (
            <ModalOrderPending
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : orderState?.state_order === "Cancelada" ? (
            <ModalOrderCancel
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : orderState?.state_order === "Completado" ? (
            <ModalOrderComplete
              customer={customer}
              handleReset={handleReset}
              onOpenChangeMain={onOpenChange}
              orderData={orderData}
            />
          ) : orderState?.state_order === "Finalizado" ? (
            <ModalOrderFinished
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : orderState?.state_order === "En discusión" ? (
            <ModalOrderClaim
              customer={customer}
              handleReset={handleReset}
              onOpenChangeMain={onOpenChange}
              orderData={orderData}
            />
          ) : (
            <></>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default TicketTable
