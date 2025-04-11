"use client"

import { useEffect, useState } from "react"
import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react"
import TicketForm from "@modules/account/components/create_ticket"
import { getListTickets } from "../actions/tikets/get-list-tikets"
import ViewTicket from "../components/view-ticket"
import { EyeSeeIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"
import { Plus, ArrowLongLeft, ArrowLongRight } from "@medusajs/icons"
import { Input as InputMedusa, IconButton, Select } from "@medusajs/ui"

interface Ticket {
  id: string
  status: "Cerrado" | "Abierto" | "Contestado"
  subject: string
  created_at: string
}

const dataSelecterPage = [10, 20, 30]

interface propsModal {
  status: "Cerrado" | "Abierto" | "Contestado" | undefined
  subject: string
  ticketId: string
  isOpen: boolean
  onOpen: () => void
  onOpenChange: () => void
  onClose: () => void
}

const ModalViewTicket = ({
  status,
  subject,
  ticketId,
  isOpen,
  onClose,
  onOpenChange,
}: propsModal) => (
  <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {() => (
        <>
          <ModalHeader />
          <ModalBody>
            <ViewTicket
              status={status}
              onClose={onClose}
              handlerReset={() => {}}
              subject={subject}
              ticketId={ticketId}
            />
          </ModalBody>
          <ModalFooter />
        </>
      )}
    </ModalContent>
  </Modal>
)

const TicketTable: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
    onClose: onClose2,
  } = useDisclosure()

  // Pagination controls
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0])
  const [pageTotal, setPageTotal] = useState(1)

  const [filterStatus, setFilterStatus] = useState<
    "Cerrado" | "Abierto" | "Contestado" | "all"
  >("all")

  const handlerSelectTicket = (ticketSelect: Ticket) => {
    setTicket(ticketSelect)
    onOpen2()
  }

  const handlerGetListTickets = async () => {
    try {
      const data = await getListTickets()
      setTickets(data)
    } catch (error) {
      console.error("Error al obtener los tickets:", error)
    }
  }

  useEffect(() => {
    handlerGetListTickets()
  }, [])

  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
      const matchesSearch = searchQuery === '' || 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })

  const paginatedTickets = filteredTickets
    .slice((page - 1) * rowsPerPage, page * rowsPerPage)

  useEffect(() => {
    setPageTotal(Math.ceil(filteredTickets.length / rowsPerPage))
    setPage(1) // Reset to first page when filters change
  }, [filteredTickets.length, rowsPerPage])

  const getStatusColor = (status: "Cerrado" | "Abierto" | "Contestado") => {
    const colors = {
      Cerrado: "bg-red-200",
      Abierto: "bg-green-200",
      Contestado: "bg-blue-200",
    }
    return colors[status] || ""
  }

  return (
    <div className="w-full md:p-8 border border-gray-200 shadow-2xl rounded-lg  p-1">
      <div className="mb-8">
        <h2 className="text-2xl mt-2 font-bold text-gray-700 md:text-start text-center">
          Mis tickets
        </h2>
      </div>

      {/* Filtro y botón de nuevo ticket */}
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-[170px]">
              <InputMedusa
                className="w-full bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300"
                placeholder="Buscar"
                id="search-input"
                type="search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                    e.target.value as "Cerrado" | "Abierto" | "Contestado" | "all"
                  )
                }
              >
                <option value="all">Todos</option>
                <option value="Cerrado">Cerrado</option>
                <option value="Abierto">Abierto</option>
                <option value="Contestado">Contestado</option>
              </select>
            </div>
          </div>
          <ButtonLigth
            className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none"
            onClick={onOpen}
          >
            Nuevo ticket
            <Plus />
          </ButtonLigth>
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="xl"
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
                  <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
                    Crear ticket
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <TicketForm
                    onClose={onClose}
                    handlerReset={handlerGetListTickets}
                  />
                </ModalBody>
                <ModalFooter />
              </>
            )}
          </ModalContent>
        </Modal>
        </div>

        {/* Tabla de tickets */}

        <div className="w-full h-[70vh] overflow-auto">
          <div className="overflow-x-auto max-h-full">
            <table className="w-full bg-white rounded-lg shadow-md text-xs md:text-base">
              <thead className="sticky top-0 bg-white shadow">
                <tr>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Asunto</th>
                  <th className="px-4 py-2 text-left">Fecha de creación</th>
                  <th className="px-4 py-2 text-left">Detalle del ticket</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  paginatedTickets
                    .sort(
                      (a: Ticket, b: Ticket) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((ticket: Ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="py-2">
                          <p
                            className={`${getStatusColor(
                              ticket.status
                            )} px-4 py-2 rounded-lg`}
                          >
                            {ticket.status}
                          </p>
                        </td>
                        <td className="px-4 py-2">{ticket.subject}</td>
                        <td className="px-4 py-2">
                          {ticket.created_at.split("T")[0]}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <EyeSeeIcon
                            className="cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handlerSelectTicket(ticket)}
                          />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No hay tickets disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Controles de paginación */}
        {filteredTickets.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 mt-6 gap-4">
            <div className="flex items-center gap-4">
              <p className="md:text-sm text-xs whitespace-nowrap">{`${filteredTickets.length} tickets`}</p>
              <Select onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setPage(1)
              }}>
                <Select.Trigger className="bg-white text-gray-600">
                  <Select.Value placeholder={rowsPerPage.toString()} />
                </Select.Trigger>
                <Select.Content>
                  {dataSelecterPage.map((item) => (
                    <Select.Item key={item} value={item.toString()}>
                      {item}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="flex items-center gap-4 md:text-base text-sm">
              <span>
                {page} de {pageTotal}
              </span>
              <div className="flex gap-2">
                <IconButton
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  variant="transparent"
                  className="disabled:opacity-50"
                >
                  <ArrowLongLeft />
                </IconButton>
                <IconButton
                  disabled={page === pageTotal}
                  onClick={() => setPage(p => Math.min(pageTotal, p + 1))}
                  variant="transparent"
                  className="disabled:opacity-50"
                >
                  <ArrowLongRight />
                </IconButton>
              </div>
            </div>
          </div>
        )}

        {/* Modal para ver ticket */}
        <ModalViewTicket
          status={ticket?.status}
          isOpen={isOpen2}
          onClose={onClose2}
          onOpen={onOpen2}
          onOpenChange={onOpenChange2}
          subject={ticket?.subject || ""}
          ticketId={ticket?.id || ""}
        />
      </div>
    
  )
}

export default TicketTable
