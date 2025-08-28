"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Modal, ModalContent, useDisclosure, Input, Button } from "@heroui/react"
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

const dataSelecterPage = [10, 20, 30, 50, 100]

const OrderTable: React.FC = () => {
  const { 
    dataOrders, 
    loadOrdersPage, 
    isLoading, 
    totalCount, 
    totalPages, 
    currentPage, 
    setCurrentPage 
  } = useOrderGudfy()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [rowsPerPage, setRowsPerPage] = useState(dataSelecterPage[0]) 
  const [searchQuery, setSearchQuery] = useState('')
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    | "Cancelada"
    | "Completado"
    | "En discusión"
    | "Finalizado"
    | "Pendiente de pago"
    | "all"
  >("all")
  const [selectOrderData, setTelectOrderData] = useState<order>()

  const handleReset = async() => {
    await loadOrdersPage(currentPage, rowsPerPage, filterStatus === 'all' ? undefined : filterStatus, searchQuery || undefined).then(()=>{
      if (selectOrderData) {
        const updatedOrder = dataOrders.find(order => order.id === selectOrderData.id)
        if (updatedOrder) {
          setTelectOrderData(updatedOrder)
        }
      }
    })
  }

  const filteredOrder = dataOrders

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

  const paginatedOrders = filteredOrder

  useEffect(() => {
    loadOrdersPage(1, rowsPerPage)
  }, []) 
  
  useEffect(() => {
    loadOrdersPage(1, rowsPerPage, filterStatus === 'all' ? undefined : filterStatus, searchQuery || undefined)
  }, [filterStatus, searchQuery, rowsPerPage])

  const handleSearch = () => {
    setSearchQuery(localSearchTerm)
  }
  
  const handlePageChange = (newPage: number) => {
    loadOrdersPage(newPage, rowsPerPage, filterStatus === 'all' ? undefined : filterStatus, searchQuery || undefined)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex justify-between gap-4 w-full">
          <div className="">
            <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar por orden"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              className="bg-lila-gf hover:bg-lila-gf/80 text-white rounded-[5px]"
            >
              Buscar
            </Button>
            </div>
            {filteredOrder && (
              <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <span>
                  Mostrando {paginatedOrders?.length || 0} de {totalCount} órdenes
                </span>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-end gap-2 max-w-md">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">
                Estado:
              </label>
              <select
                id="status-filter"
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lila-gf focus:outline-none text-sm bg-white"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(
                    e.target.value as
                      | "Cancelada"
                      | "Completado"
                      | "En discusión"
                      | "Finalizado"
                      | "Pendiente de pago"
                      | "all"
                  )
                }}
              >
                <option value="all">Todos</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Pendiente de pago">Pendiente de pago</option>
                <option value="Completado">Completado</option>
                <option value="Finalizado">Finalizado</option>
                <option value="En discusión">En discusión</option>
              </select>
            
            </div>
            <div className="flex items-center justify-end  gap-2">
              <label className="font-semibold text-gray-700 text-sm">
                Por página:
              </label>
              <select
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-lila-gf focus:outline-none text-sm bg-white"
                value={rowsPerPage}
                onChange={(e) => {
                  const newRowsPerPage = parseInt(e.target.value)
                  setRowsPerPage(newRowsPerPage)
                  loadOrdersPage(1, newRowsPerPage, filterStatus === 'all' ? undefined : filterStatus, searchQuery || undefined)
                }}
              >
                {dataSelecterPage.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md md:text-base text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left">
                  Estado
                </th>
                <th className="py-2 text-left">
                  Número de orden
                </th>
                <th className="py-2 text-left">
                  Fecha y hora
                </th>
                <th className="py-2 text-left">
                  Tiempo a pagar
                </th>
                <th className="py-2 text-center">
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
                        className={`px-3 py-1 rounded-lg ${getStatusColor(
                          order.state_order
                        )}`}
                      >
                        {order.state_order}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {order.id}
                    </td>
                    <td className="px-4 py-2">
                      {handlerformatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-2">
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
            <div className="p-10 flex w-full text-center items-center justify-center text-lg">
              <XMarkMini /> {searchQuery ? 'No se encontraron resultados' : 'Aún no tienes órdenes'}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              size="sm"
              variant="bordered"
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i
                if (pageNumber > totalPages) return null
                
                return (
                  <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                    size="sm"
                    variant={pageNumber === currentPage ? "solid" : "bordered"}
                    className={pageNumber === currentPage ? "bg-lila-gf text-white" : ""}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>
            
            <Button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              size="sm"
              variant="bordered"
            >
              Siguiente
            </Button>
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
  const { dataOrders } = useOrderGudfy()
  
  const [orderState, setOrderState] = useState<order | undefined>(orderData)

  useEffect(() => {
    setOrderState(orderData)
  }, [orderData])
  
  useEffect(() => {
    if (orderData && dataOrders) {
      const updatedOrder = dataOrders.find(order => order.id === orderData.id)
      if (updatedOrder) {
        setOrderState(updatedOrder)
      }
    }
  }, [dataOrders, orderData])

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
