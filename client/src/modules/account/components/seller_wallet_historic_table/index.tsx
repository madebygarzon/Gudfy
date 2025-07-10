"use client"

import { useState, useEffect } from "react"
import React from "react"
import { useDisclosure } from "@heroui/react"
import { getWallet } from "@modules/account/actions/get-wallet"
import { getListPayOrders } from "@modules/account/actions/get-list-seller-pay-orders"
import handlerformatDate from "@lib/util/formatDate"
import Loader from "@lib/loader"
import { dataWallet } from "@modules/account/templates/wallet-template"
import { formatPrice } from "@lib/util/formatPrice"

export type orderData = {
  produc_title: string
  unit_price: number
  quantity: number
  comision: number
  number_order: string
  customer_name: string
  customer_last_name: string
  created_date: string
  total_price_for_product: number
  state: "Cancelado" | "Completado" | "Finalizado" | "Pagado"
}

interface props {
  wallet: dataWallet
  setWallet: React.Dispatch<React.SetStateAction<dataWallet>>
}

const WalletTable = ({ wallet, setWallet }: props) => {
  const commission = 0.01
  const [listOrders, setList] = useState<orderData[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [filterStatus, setFilterStatus] = useState<
    "Cancelado" | "Pagado" | "Completado" | "Finalizado" | "all"
  >("all")

  const getStatusColor = (
    status: "Cancelado" | "Pagado" | "Completado" | "Finalizado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Finalizado":
        return "bg-green-200"
      case "Completado":
        return "bg-blue-200"
      case "Pagado":
        return "bg-gray-200"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handlerGetDataWallet = () => {
    setIsLoading(true)
    Promise.all([
      getListPayOrders(),
      getWallet()
    ])
      .then(([orders, walletData]) => {
        setList(orders)
        setWallet(walletData)
      })
      .catch(error => {
        console.error("Error al cargar datos:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handlerGetDataWallet()
  }, [])


  const totalBalancePaid =
    listOrders
      ?.filter(
        (order) => filterStatus === "all" || order.state === filterStatus
      )
      .reduce(
        (total, order) =>
          total +
          (order.state === "Completado" ? order.total_price_for_product : 0),
        0
      ) || 0

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap  justify-between gap-4 p-4 rounded-lg shadow-sm">
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
                    | "Cancelado"
                    | "Pagado"
                    | "Completado"
                    | "Finalizado"
                    | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Pagado">Pagado</option>
              <option value="Completado">Completado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md table-auto md:text-base text-sm">
            <thead className="border-b border-slate-100">
              <tr>
                <th className="px-4 py-2 w-[15%] text-left">Orden</th>
                <th className="px-4 py-2 w-[20%] text-left">Producto</th>
                <th className="px-4 py-2 w-[10%] text-left">Cantidad</th>
                <th className="px-4 py-2 w-[10%] text-left">Valor</th>
                <th className="px-4 py-2 w-[10%] text-left">Comisión</th>
                <th className="px-4 py-2 w-[10%] text-left">Neto</th>
                <th className="px-4 py-2 w-[10%] text-left">Fecha</th>
                <th className="px-4 py-2 w-[10%] text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : listOrders && listOrders.length > 0 ? (
                listOrders
                  .filter(
                    (order) =>
                      filterStatus === "all" || order.state === filterStatus
                  )
                  .map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {order.number_order}
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        {order.produc_title}
                      </td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">$ {order.unit_price}</td>
                      <td className="px-4 py-2">
                        ${" "}
                        {formatPrice(order.unit_price * commission)}
                      </td>
                      <td className="px-4 py-2">
                        
                        {formatPrice(
                         ( order.unit_price * order.quantity) - formatPrice((order.unit_price * order.quantity) * commission)
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {handlerformatDate(order.created_date)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <p
                          className={`${getStatusColor(
                            order.state
                          )} px-4 py-1 rounded-lg`}
                        >
                          {order.state}
                        </p>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 text-gray-400 mb-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                        />
                      </svg>
                      <p className="text-gray-600 text-lg font-medium mb-1">No hay datos disponibles</p>
                      <p className="text-gray-500 text-sm">No se encontraron transacciones para mostrar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WalletTable
