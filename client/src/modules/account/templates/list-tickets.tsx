"use client"

import { useEffect, useState } from "react"
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
import { FaPlus } from "react-icons/fa6"
import TicketForm from "@modules/account/components/create_ticket"
import { getListTickets } from "../actions/tikets/get-list-tikets"
import { IconButton } from "@medusajs/ui"
import Eye from "@modules/common/icons/eye"
import ViewTicket from "../components/view-ticket"
import { EyeSeeIcon } from "@lib/util/icons"

interface Ticket {
  id: string
  status: "Cerrado" | "Abierto" | "Respondido"
  subject: string
  created_at: string
}

// const fakeData: Ticket[] = [
//   {
//     id: 1,
//     status: "Cerrado",
//     subject: "Problema con la cuenta",
//     createdAt: "2024-07-10",
//   },
//   {
//     id: 2,
//     status: "Abierto",
//     subject: "Error en la aplicación",
//     createdAt: "2024-07-11",
//   },
//   {
//     id: 3,
//     status: "Respondido",
//     subject: "Pregunta sobre características",
//     createdAt: "2024-07-12",
//   },
//   {
//     id: 4,
//     status: "Cerrado",
//     subject: "Problema con la cuenta",
//     createdAt: "2024-07-10",
//   },
//   {
//     id: 5,
//     status: "Abierto",
//     subject: "Error en la aplicación",
//     createdAt: "2024-07-11",
//   },
//   {
//     id: 6,
//     status: "Respondido",
//     subject: "Pregunta sobre características",
//     createdAt: "2024-07-12",
//   },
//   {
//     id: 7,
//     status: "Cerrado",
//     subject: "Problema con la cuenta",
//     createdAt: "2024-07-10",
//   },
//   {
//     id: 8,
//     status: "Abierto",
//     subject: "Error en la aplicación",
//     createdAt: "2024-07-11",
//   },
//   {
//     id: 9,
//     status: "Respondido",
//     subject: "Pregunta sobre características",
//     createdAt: "2024-07-12",
//   },
// ]

const TicketTable: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>()
  const [ticket, setTicket] = useState<Ticket>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
    onClose: onClose2,
  } = useDisclosure()

  const handlerSelectTicket = (ticketSelect: Ticket) => {
    setTicket(ticketSelect)
    onOpen2()
  }

  const handleClose = () => {
    onClose()
    handleReset()
  }

  const handleReset = () => {
    handlerGetListTickets()
  }
  const [filterStatus, setFilterStatus] = useState<
    "Cerrado" | "Abierto" | "Respondido" | "all"
  >("all")

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets?.filter((ticket) => ticket.status === filterStatus)

  const getStatusColor = (
    status: "Cerrado" | "Abierto" | "Respondido"
  ): string => {
    switch (status) {
      case "Cerrado":
        return "bg-red-200"
      case "Abierto":
        return "bg-green-200"
      case "Respondido":
        return "bg-blue-200"
      default:
        return ""
    }
  }

  const handlerGetListTickets = () => {
    getListTickets().then((e) => {
      setTickets(e)
    })
  }

  useEffect(() => {
    handlerGetListTickets()
  }, [])

  return (
    <div className="w-full p-8 border border-gray-200 shadow-2xl rounded-lg">
      <div className="mb-8 flex flex-col gap-y-4">
        <h2 className="text-2xl mt-2 font-bold text-gray-700">Mis tickets</h2>
      </div>
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
                  e.target.value as "Cerrado" | "Abierto" | "Respondido" | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Abierto">Abierto</option>
              <option value="Respondido">Respondido</option>
            </select>
          </div>
          <div className="">
            <Button
              className="text-white bg-[#402e72] hover:bg-[#2c1f57] rounded-[5px]"
              onPress={onOpen}
            >
              <FaPlus />
              Nuevo ticket
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                    <ModalBody>
                      <TicketForm
                        onClose={handleClose}
                        handlerReset={handleReset}
                      />
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Asunto</th>
                <th className="px-4 py-2 text-left">Fecha de Creación</th>
                <th className="px-4 py-2  bg-gray-100 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets?.length ? (
                filteredTickets.map((ticket) => (
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

                    <td className="px-4 py-2 ">{ticket.subject}</td>
                    <td className="px-4 py-2 ">{ticket.created_at}</td>
                    <td className="px-4 py-2  text-center">
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => handlerSelectTicket(ticket)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <div className="flex flex-col my-[10%] w-full text-center"></div>
              )}
            </tbody>
          </table>
        </div>
        <ModalViewTicket
          isOpen={isOpen2}
          onClose={onClose2}
          onOpen={onOpen2}
          onOpenChange={onOpenChange2}
          subject={ticket?.subject || ""}
          ticketId={ticket?.id || ""}
        />
      </div>
    </div>
  )
}

interface propsModal {
  subject: string
  ticketId: string
  isOpen: boolean
  onOpen: () => void
  onOpenChange: () => void
  onClose: () => void
}

const ModalViewTicket = ({
  subject,
  ticketId,
  isOpen,
  onOpen,
  onOpenChange,
}: propsModal) => {
  const handleReset = () => {}
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <ViewTicket
                onClose={onClose}
                handlerReset={handleReset}
                subject={subject}
                ticketId={ticketId}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TicketTable
