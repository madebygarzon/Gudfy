"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Modal, ModalContent, useDisclosure, Input } from "@heroui/react"
import { IconButton, Select, Input as InputMedusa } from "@medusajs/ui"
import { XMark, ArrowLongRight, ArrowLongLeft } from "@medusajs/icons"
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

const dataSelecterPage = [10, 20, 30]

const OrderTable: React.FC = () => {
  const { listOrder, handlerListOrder, isLoading } = useOrderGudfy()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  // Pagination and search state
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0])
  const [pageTotal, setPageTotal] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectOrderData, setTelectOrderData] = useState<order>()

  const handleReset = async() => {
    await handlerListOrder().then(()=>{
      if (selectOrderData) {
        // Use a small timeout to ensure the list is updated first
        
          // Find the updated order data with the same ID
          const updatedOrder = listOrder?.find(order => order.id === selectOrderData.id)
          if (updatedOrder) {
            setTelectOrderData(updatedOrder)
          }
        
      }
    })
    // If there's a selected order, update its data after refreshing the list
    
  }

  const [filterStatus, setFilterStatus] = useState<
    | "Cancelada"
    | "Completado"
    | "En discusión"
    | "Finalizado"
    | "Pendiente de pago"
    | "all"
  >("all")

  

  // Filter by status and search query
  const filteredOrder = listOrder
    ?.filter(order => {
      if (filterStatus !== "all") {
        return order.state_order === filterStatus
      }
      return true
    })
    .filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const getStatusColor = (
    status:
      | "Cancelada"
      | "Completado"
      | "En discusión"
      | "Finalizado"
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
     
      case "En discusión":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-300"
    }
  }

  // Update total pages when filtered data or rows per page changes
  useEffect(() => {
    if (!filteredOrder) return
    setPageTotal(Math.ceil(filteredOrder.length / rowsPerPage))
  }, [filteredOrder, rowsPerPage])

  // Get paginated data
  const paginatedOrders = filteredOrder
    ?.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  useEffect(() => {
    handlerListOrder()
  }, [])

  return (
    <div className="w-full ">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="w-full md:w-[170px]">
            <InputMedusa
              className="w-full bg-white h-[48px] hover:bg-gray-100 text-gray-600 text-sm border border-gray-300"
              placeholder="Buscar"
              id="search-input"
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                paginatedOrders?.map((order) => (
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
                      {order.id}
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      {handlerformatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      {order.proof_of_payment !== null ? "- -" : order.state_order === "Pendiente de pago" ? (
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
              <XMarkMini /> {searchQuery ? 'No se encontraron resultados' : 'Aún no tienes órdenes'}
            </div>
          )}
        </div>

        {/* Controles de paginación */}
        {filteredOrder && filteredOrder.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 mt-6 gap-4">
            <div className="flex items-center gap-4">
              <p className="md:text-sm text-xs whitespace-nowrap">{`${filteredOrder.length} órdenes`}</p>
              <Select onValueChange={(value) => {
                const newRowsPerPage = parseInt(value)
                setRowsPerPage(newRowsPerPage)
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
  handleReset: () => Promise<void>
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
  const { listOrder } = useOrderGudfy()
  
  // Inicializar el estado con orderData
  const [orderState, setOrderState] = useState<order | undefined>(orderData)

  // Actualizar orderState cuando cambia orderData
  useEffect(() => {
    setOrderState(orderData)
  }, [orderData])
  
  // Actualizar orderState cuando cambia listOrder y hay un orderData seleccionado
  useEffect(() => {
    if (orderData && listOrder) {
      const updatedOrder = listOrder.find(order => order.id === orderData.id)
      if (updatedOrder) {
        setOrderState(updatedOrder)
      }
    }
  }, [listOrder, orderData])

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
              orderData={orderState}
            />
          ) : (
            <ModalOrderDetail
              customer={customer}
              handleReset={handleReset}
              onOpenChangeMain={onOpenChange}
              orderData={orderState}
            />
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default OrderTable
