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
import OrderRevie from "../order-overview"
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

interface Ticket {
  id: number
  status: "" | "Por pagar" | "Completado"
  orderNumber: string
  createdAt: string
}

const SellerOrderTable: React.FC = () => {
  const { listSellerOrders, handlerGetListSellerOrder, isLoadingOrders } =
    useSellerStoreGudfy()
  const handleReset = () => {
    handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    | "Completado"
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
    | "all"
  >("all")
  const [selectOrderData, setSelectOrderData] = useState<SellerOrder>()

  const filteredOrder =
    filterStatus === "all"
      ? listSellerOrders
      : listSellerOrders?.filter((order) => order.state_order === filterStatus)

  const getStatusColor = (
    status:
      | "Completado"
      | "Cancelado"
      | "Pendiente de pago"
      | "Finalizado"
      | "En discusión"
  ): string => {
    switch (status) {
      case "Completado":
        return "bg-blue-200"
      case "Cancelado":
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

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }

  useEffect(() => {
    handlerGetListSellerOrder()
  }, [])

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4 ">
        <h1 className="text-2xl-semi">Mis Ordenes</h1>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="status-filter" className="mr-2 font-semibold ">
              Filtrar por estado:
            </label>
            <select
              id="status-filter"
              className="p-2 shadow-sm border-x-neutral-500 rounded"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "Cancelado"
                    | "Pendiente de pago"
                    | "Finalizado"
                    | "En discusión"
                    | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Por pagar">Por pagar</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
          <div className="">
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
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Estado de la Orden
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Numero de Orden
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Fecha y hora de Creación
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Tiempo a Pagar
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingOrders ? (
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
                      ) : order.state_order === "Cancelado" ? (
                        // <XMarkMini className="text-red-600" />
                        <p className="text-red-600">Expirado</p>
                      ) : order.state_order === "Completado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "Finalizado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "En discusión" ? (
                        <CheckMini className="text-green-600" />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="px-4 py-2  text-center">
                      <ButtonMedusa
                        className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72]"
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      >
                        <FaEye />
                        Ver detalle de la orden
                      </ButtonMedusa>
                    </td>
                  </tr>
                ))
              ) : (
                <>Cargando...</>
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
  orderData?: SellerOrder
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrder = ({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalOrder) => {
  const { customer } = useMeCustomer()
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {
      onOpenChange()
      handleReset()
    })
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        <>
          {/* {(onClose) =>
          orderData?.state_order === "Pendiente de pago" ? (
            <ModalOrderPending
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : orderData?.state_order === "Cancelado" ? (
            <ModalOrderCancel
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : orderData?.state_order === "Completado" ? (
            <ModalOrderComplete
              customer={customer}
              handleReset={handleReset}
              onOpenChangeMain={onOpenChange}
              orderData={orderData}
            />
          ) : orderData?.state_order === "Finalizado" ? (
            <ModalOrderFinished
              handleReset={handleReset}
              onOpenChange={onOpenChange}
              orderData={orderData}
            />
          ) : (
            <></>
          )
        } */}
        </>
      </ModalContent>
    </Modal>
  )
}

export default SellerOrderTable
