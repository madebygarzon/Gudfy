"use client"

import { useState, useEffect } from "react"
import React from "react"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
} from "@heroui/react"
import handlerformatDate from "@lib/util/formatDate"
import Timer from "@lib/util/timer-order"
import { CheckMini, XMarkMini } from "@medusajs/icons"
import { SellerOrder, useSellerStoreGudfy } from "@lib/context/seller-store"
import { EyeSeeIcon } from "@lib/util/icons"
import Loader from "@lib/loader"
import { formatPrice } from "@lib/util/formatPrice"
import DownloadButton from "@modules/common/components/download-button"

const SellerOrderTable: React.FC = () => {
  const {
    dataOrders,
    loadOrdersPage,
    handlerGetListSellerOrder,
    isLoadingOrders,
    totalCount,
    currentPage,
    totalPages,
    pageLimit,
    setPageLimit,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  } = useSellerStoreGudfy()
  
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('')
  
  const handleReset = () => {
    handlerGetListSellerOrder({ page: 1, status: statusFilter, search: searchTerm })
  }
  const [selectOrderData, setSelectOrderData] = useState<SellerOrder>({
    id: "",
    person_name: "",
    created_at: "",
    state_order: "Cancelada",
    products: [
      {
        store_variant_order_id: "",
        variant_order_status_id: "",
        quantity: 0,
        total_price: 0,
        produc_title: "",
        price: 0,
        serial_code_products: [],
      },
    ],
  })

  const handleSearch = () => {
    setSearchTerm(localSearchTerm)
    handlerGetListSellerOrder({ page: 1, status: statusFilter, search: localSearchTerm })
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    handlerGetListSellerOrder({ page: 1, status, search: searchTerm })
  }

  const handlePageLimitChange = (limit: number) => {
    setPageLimit(limit)
    handlerGetListSellerOrder({ page: 1, limit, status: statusFilter, search: searchTerm })
  }


  const handlePageChange = (page: number) => {
    loadOrdersPage(page)
  }

  const getStatusColor = (
    status:
      | "Completado"
      | "Cancelada"
      | "Pendiente de pago"
      | "Finalizado"
      | "En discusión"
  ): string => {
    switch (status) {
      case "Completado":
        return "bg-blue-200"
      case "Cancelada":
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

  useEffect(() => {
    handlerGetListSellerOrder({ page: 1 })
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">
                Estado:
              </label>
              <select
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Pendiente de pago">Pendiente de pago</option>
                <option value="Finalizado">Finalizado</option>
                <option value="En discusión">En discusión</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">
                Por página:
              </label>
              <select
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                value={pageLimit}
                onChange={(e) => handlePageLimitChange(parseInt(e.target.value))}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={300}>300</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <Input
              placeholder="Buscar por ID, cliente o producto..."
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buscar
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {dataOrders.length} de {totalCount} órdenes
            </span>
            <span>
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md md:text-base text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left ">Pago</th>
                <th className="py-2 text-left">Orden</th>
                <th className="py-2 text-left">Fecha</th>
                <th className="py-2 text-left">Detalle </th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingOrders ? (
                dataOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                   
                    <td className=" px-4 py-2">
                      {order.state_order === "Pendiente de pago" ? (
                        <Timer creationTime={order.created_at} />
                      ) : order.state_order === "Cancelada" ? (
                        (<p className="text-red-600">Expirado</p>)
                      ) : order.state_order === "Completado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "Finalizado" ? (
                        <CheckMini className="text-green-600" />
                      ) : order.state_order === "En discusión" ? (
                        <CheckMini className="text-green-600" />
                      ) : (
                        <>asdasd</>
                      )}
                    </td>
                    <td className="px-4 py-2 ">{order.id}</td>
                    <td className="px-4 py-2 ">
                      {handlerformatDate(order.created_at)}
                    </td>

                    <td className="px-4 py-2">
                      <EyeSeeIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setSelectOrderData(order)
                          onOpen()
                        }}
                      />

                    </td>
                  </tr>
                ))
              ) : (
                <Loader />
              )}
            </tbody>
          </table>
          {!isLoadingOrders && !dataOrders.length && (
            <div className="p-10 flex w-full text-center items-center justify-center text-lg">
              <XMarkMini /> No se encontraron órdenes
            </div>
          )}

      
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoadingOrders}
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
                      disabled={isLoadingOrders}
                      size="sm"
                      variant={pageNumber === currentPage ? "solid" : "bordered"}
                      className={pageNumber === currentPage ? "bg-blue-600 text-white" : ""}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoadingOrders}
                size="sm"
                variant="bordered"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
      <ModalOrder
        orderData={selectOrderData}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

interface ModalOrder {
  orderData: SellerOrder
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrder: React.FC<ModalOrder> = ({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed_ID":
        return "bg-blue-200"
      case "Cancel_ID":
        return "bg-red-200"
      case "Payment_Pending_ID":
        return "bg-yellow-200"
      case "Finished_ID":
        return "bg-green-200"
      case "Paid_ID":
        return "bg-gray-200"
      case "Discussion_ID":
        return "bg-orange-200"
      default:
        return ""
    }
  }
  const handlerState = (state_id: string) => {
    switch (state_id) {
      case "Finished_ID":
        return "Finalizado"
      case "Completed_ID":
        return "Completado"
      case "Discussion_ID":
        return "En reclamo"
      case "Paid_ID":
        return "Pagado"
      case "Payment_Pending_ID":
        return "Pendiente por Pagar"
      case "Cancel_ID":
        return "Cancelada"
      default:
        return ""
    }
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center">
              <h2 className="text-center text-2xl mt-2 font-bold text-gray-700">
                Detalles del pedido
              </h2>
            </ModalHeader>

            <ModalBody className="p-6">
              <div className="mb-4">
                <p>
                  <strong>ID del pedido:</strong> {orderData.id}
                </p>
                <p>
                  <strong>Nombre del cliente:</strong> {orderData.person_name}
                </p>
                <p>
                  <strong>Fecha de creación:</strong>{" "}
                  {new Date(orderData.created_at).toLocaleString()}
                </p>
                <p>
               
                </p>
              </div>

              <div className="">
                <table className="min-w-full rounded-lg shadow-2xl p-8">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Estado del producto en la orden
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Título del Producto
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Cantidad
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Precio Unitario
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Precio Total
                      </th>
                      <th className="py-2 px-4 border-b border-slate-200">
                        Codigos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.products.map((product) => (
                      <tr key={product.store_variant_order_id}>
                        <td
                          className={`border-slate-200 px-4 py-2 ${getStatusColor(
                            product.variant_order_status_id
                          )}`}
                        >
                          {handlerState(product.variant_order_status_id)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          {product.produc_title}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          {product.quantity}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          ${formatPrice(product.price)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          ${formatPrice(product.total_price)}
                        </td>
                        <td className="border-slate-200 px-4 py-2">
                          <p className="items-center  font-medium">
                            {product.variant_order_status_id !== "Cancel_ID" &&
                              product.variant_order_status_id !==
                                "Payment_Pending_ID" && (
                                <DownloadButton
                                  data={product.serial_code_products.map(
                                    (sc) => sc.serial
                                  )}
                                  filename={product.produc_title}
                                />
                              )}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-end space-x-4">
              <Button
                onPress={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default SellerOrderTable
