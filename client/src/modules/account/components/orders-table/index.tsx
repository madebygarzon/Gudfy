"use client"

import { useState } from "react"
import { FaEdit } from "react-icons/fa"
import React from "react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
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

interface Ticket {
  id: number
  status: "Cancelado" | "Por pagar" | "Completado"
  orderNumber: string
  createdAt: string
}

const fakeData: Ticket[] = [
  {
    id: 1,
    status: "Cancelado",
    orderNumber: "#298969",
    createdAt: "2024-07-10 17:34",
  },
  {
    id: 2,
    status: "Por pagar",
    orderNumber: "#298968",
    createdAt: "2024-07-11 10:40",
  },
  {
    id: 3,
    status: "Completado",
    orderNumber: "#298958",
    createdAt: "2024-07-12 16:02",
  },
  {
    id: 4,
    status: "Completado",
    orderNumber: "#298952",
    createdAt: "2024-07-10 10:23",
  },
]

const TicketTable: React.FC = () => {
  const handleClose = () => {}

  const handleReset = () => {}
  const [filterStatus, setFilterStatus] = useState<
    "Cancelado" | "Por pagar" | "Completado" | "all"
  >("all")

  const filteredTickets =
    filterStatus === "all"
      ? fakeData
      : fakeData.filter((ticket) => ticket.status === filterStatus)

  const getStatusColor = (
    status: "Cancelado" | "Por pagar" | "Completado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Por pagar":
        return "bg-yellow-200"
      case "Completado":
        return "bg-green-200"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
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
                    | "Por pagar"
                    | "Completado"
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
                <th className="px-4 py-2  bg-gray-100 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className=" py-2">
                    <p
                      className={`${getStatusColor(
                        ticket.status
                      )} px-4 py-2 rounded-lg `}
                    >
                      {ticket.status}
                    </p>
                  </td>

                  <td className="px-4 py-2 ">{ticket.orderNumber}</td>
                  <td className="px-4 py-2 ">{ticket.createdAt}</td>
                  <td className="px-4 py-2  text-center">
                    <ButtonMedusa
                      className=" bg-ui-button-neutral border-ui-button-neutral hover:bg-ui-button-neutral-hover rounded-[5px] text-[#402e72]"
                      onClick={onOpen}
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
        handleClose={handleClose}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

interface ModalOrder {
  isOpen: boolean
  onOpenChange: () => void
  handleClose: () => void
  handleReset: () => void
}

const ModalOrder = ({
  isOpen,
  onOpenChange,
  handleClose,
  handleReset,
}: ModalOrder) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <OrderRevie onClose={handleClose} handlerReset={handleReset} />
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TicketTable
