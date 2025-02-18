"use client"
import React, { useEffect, useState } from "react"
import TableOrder from "../components/orders-table"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import ClaimTable from "../components/order-claim-table.ts"
import Notification from "@modules/common/components/notification"
import { useNotificationContext } from "@lib/context/notification-context"
import SerialCodeTable from "../components/products-serial-codes"
import ButtonLigth from "@modules/common/components/button_light"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { Plus } from "@medusajs/icons"
import TicketForm from "@modules/account/components/create_ticket"
import { getListTickets } from "../actions/tikets/get-list-tikets"

interface Ticket {
  id: string
  status: "Cerrado" | "Abierto" | "Contestado"
  subject: string
  created_at: string
}

export type order = {
  id: string
  pay_method_id: string
  created_at: string
  sellerapproved: string
  customerapproved: string
  quantity_products: number
  total_price: string
  person_name: string
  person_last_name: string
  email: string
  conty: string
  city: string
  phone: string
  state_order:
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  store_variant: [
    {
      store_id: string
      store_name: string
      store_variant_order_id: string
      variant_order_status_id: string
      produc_title: string
      price: string
      quantity: string
      total_price_for_product: string
      serial_code_products: [{ id: string; serial: string }]
    }
  ]
}

const OrdersTemplate = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { notifications } = useNotificationContext()
  const [tickets, setTickets] = useState<Ticket[]>()

  const handleClose = () => {
    onClose()
    handleReset()
  }

  const handleReset = () => {
    handlerGetListTickets()
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
    <div className="w-full  sm:p-8 border border-gray-200 shadow-2xl rounded-lg p-1">
      <div className="mb-2 sm:mb-8 flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-700">
          Gestión de pedidos
        </h2>
        <div className="flex gap-2 sm:gap-4">
          <ButtonLigth
            className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            onClick={onOpen}
          >
            Crear ticket
            <Plus />
          </ButtonLigth>
          <ButtonLigth
            className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            href="/account/tickets"
          >
            Ver mis tickets 👁️
          </ButtonLigth>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="Orders" title="Mis órdenes">
            <Card className="shadow-white shadow-lg">
              <CardBody>
                <div className="overflow-x-auto">
                  <TableOrder />
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="Reclamos"
            title={
              <div className="relative -m-1">
                {notifications.map((n) => {
                  if (n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID") {
                    return (
                      <div
                        key={n.id}
                        className="absolute -top-2 -right-2 flex items-center justify-center"
                      >
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                      </div>
                    )
                  }
                })}
                Mis reclamos
              </div>
            }
          >
            <Card className="shadow-white shadow-lg">
              <CardBody>
                <div className="overflow-x-auto">
                  <ClaimTable />
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Compras" title="Mis compras">
            <Card className="shadow-white shadow-lg">
              <CardBody>
                <div className="overflow-x-auto">
                  <SerialCodeTable />
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
                <h2 className="text-center text-lg sm:text-2xl font-bold text-gray-700">
                  Crear ticket
                </h2>
              </ModalHeader>
              <ModalBody>
                <TicketForm onClose={handleClose} handlerReset={handleReset} />
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default OrdersTemplate
