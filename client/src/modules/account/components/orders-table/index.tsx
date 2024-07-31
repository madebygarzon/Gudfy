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
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"

type orders = {
  orders: order[]
}

interface Ticket {
  id: number
  status: "" | "Por pagar" | "Completado"
  orderNumber: string
  createdAt: string
}

const TicketTable: React.FC<orders> = ({ orders }) => {
  const handleClose = () => {}
  console.log(orders)
  const handleReset = () => {}
  const [filterStatus, setFilterStatus] = useState<
    | "Completado"
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
    | "all"
  >("all")
  const [selectOrderData, setTelectOrderData] = useState<order>()

  const filteredOrder =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.state_order === filterStatus)

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
              <Button
                className="text-white bg-[#402e72]  hover:bg-[#2c1f57] rounded-[5px]"
                onPress={onOpen}
              >
                <FaPlus />
                Nuevo ticket
              </Button>
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
              {filteredOrder.map((order) => (
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

                  <td className="px-4 py-2 ">{handlerOrderNumber(order.id)}</td>
                  <td className="px-4 py-2 ">
                    {handlerformatDate(order.created_at)}
                  </td>
                  <td>
                    {order.state_order === "Pendiente de pago" ? (
                      <Timer creationTime={order.created_at} />
                    ) : order.state_order === "Cancelado" ? (
                      <XMarkMini className="text-red-600" />
                    ) : order.state_order === "Completado" ? (
                      <CheckMini className="text-green-600" />
                    ) : (
                      <></>
                    )}
                  </td>
                  <td className="px-4 py-2  text-center">
                    <ButtonMedusa
                      className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72]"
                      onClick={() => {
                        setTelectOrderData(order)
                        onOpen()
                      }}
                    >
                      <FaEye />
                      Ver detalle de la orden
                    </ButtonMedusa>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalOrder
        orderData={selectOrderData}
        handleClose={handleClose}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

interface ModalOrder {
  orderData?: order
  isOpen: boolean
  onOpenChange: () => void
  handleClose: () => void
  handleReset: () => void
}

const ModalOrder = ({
  orderData,
  isOpen,
  onOpenChange,
  handleClose,
  handleReset,
}: ModalOrder) => {
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {})
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              {orderData ? (
                <OrderRevie
                  orderData={orderData}
                  onClose={handleClose}
                  handlerReset={handleReset}
                />
              ) : (
                <>CARGANDO</>
              )}
            </ModalBody>
            <ModalFooter>
              <p>
                A partir de ahora, tiene un plazo de 10 días para presentar
                cualquier reclamo{" "}
                <Link
                  className="text-[#402e72] font-bold  hover:text-[#2c1f57]"
                  href={"/account/support"}
                >
                  aquí.
                </Link>{" "}
                Si no recibimos ningún reclamo dentro de este período,
                consideraremos que ha recibido su compra con éxito.
              </p>
              {orderData?.state_order === "Pendiente de pago" ? (
                <div className="w-full flex gap-2 justify-end">
                  <Button className="text-blue-600 bg-transparent border border-blue-600 ">
                    {" "}
                    ir a pagar
                  </Button>{" "}
                  <Button
                    className="text-red-600 bg-transparent border border-red-600 "
                    onClick={() => handlerOrderCancel(orderData.id)}
                  >
                    {" "}
                    Cancelar Orden{" "}
                  </Button>{" "}
                </div>
              ) : (
                <></>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TicketTable
