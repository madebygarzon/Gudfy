"use client"

import { useState, useEffect } from "react"
import React from "react"
import { useDisclosure } from "@nextui-org/react"
import { getWallet } from "@modules/account/actions/get-wallet"
import { getListPayOrders } from "@modules/account/actions/get-list-seller-pay-orders"
import handlerformatDate from "@lib/util/formatDate"
import Loader from "@lib/loader"

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
  state: "Cancelado" | "Pendiente de pago" | "Completado" | "Finalizado"
}

type dataWallet = {
  id: string
  store_id: string
  aviable_balance: number
  outstanding_balance: number
  balance_paid: number
}
interface props {
  wallet: dataWallet
  setWallet: React.Dispatch<React.SetStateAction<dataWallet>>
}

const WalletTable = ({ wallet, setWallet }: props) => {
  const [listOrders, setList] = useState<orderData[]>()

  const handleReset = () => {
    // handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    "Cancelado" | "Pendiente de pago" | "Completado" | "Finalizado" | "all"
  >("all")
  // const [selectOrderData, setSelectOrderData] = useState<orderData>()

  const getStatusColor = (
    status: "Cancelado" | "Pendiente de pago" | "Completado" | "Finalizado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Pendiente de pago":
        return "bg-yellow-200"
      case "Completado":
        return "bg-blue-200"
      default:
        return ""
    }
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  function handlerOrderNumber(numberOrder: string) {
    return numberOrder.replace("store_order_id_", "")
  }
  const handlerGetDataWallet = () => {
    getListPayOrders().then((e) => {
      setList(e)
    })
    getWallet().then((e) => {
      setWallet(e)
    })
  }

  useEffect(() => {
    handlerGetDataWallet()
  }, [])


  // Calculate totals
  const totalOutstandingBalance = listOrders
    ?.filter((order) => filterStatus === "all" || order.state === filterStatus)
    .reduce((total, order) => total + (order.state === "Pendiente de pago" ? order.total_price_for_product : 0), 0) || 0;

  const totalBalancePaid = listOrders
    ?.filter((order) => filterStatus === "all" || order.state === filterStatus)
    .reduce((total, order) => total + (order.state === "Completado" ? order.total_price_for_product : 0), 0) || 0;

    
  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg shadow-sm">
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
                    | "Pendiente de pago"
                    | "Completado"
                    | "Finalizado"
                    | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Pendiente de pago">Pendiente de pago</option>
              <option value="Completado">Completado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          <div>
            Saldo pendiente:{" "}
            <span className="text-yellow-600 text-lg">
              $ {wallet.outstanding_balance}
            </span>
          </div>
          <div>
            Saldo pagado:{" "}
            <span className="text-gray-600 text-lg">
              $ {wallet.balance_paid}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md table-auto">
            <thead className="border-b border-slate-100">
              <tr>
                <th className="px-4 py-2 w-[20%] text-left">Producto</th>
                <th className="px-4 py-2 w-[10%] text-left">Cantidad</th>
                <th className="px-4 py-2 w-[10%] text-left">Valor</th>
                <th className="px-4 py-2 w-[10%] text-left">Comisión</th>
                <th className="px-4 py-2 w-[15%] text-left">
                  Número de pedido
                </th>
                <th className="px-4 py-2 w-[10%] text-left">Neto</th>
                <th className="px-4 py-2 w-[15%] text-left">Cliente</th>
                <th className="px-4 py-2 w-[10%] text-left">Fecha</th>
                <th className="px-4 py-2 w-[10%] text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {listOrders?.length ? (
                listOrders
                  .filter(
                    (order) =>
                      filterStatus === "all" || order.state === filterStatus
                  )
                  .map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-normal">
                        {order.produc_title}
                      </td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">$ {order.unit_price}</td>
                      <td className="px-4 py-2">
                        $ {(order.total_price_for_product * 0.1).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {handlerOrderNumber(order.number_order)}
                      </td>
                      <td className="px-4 py-2">
                        {order.unit_price * order.quantity -
                          order.total_price_for_product * 0.1}
                      </td>
                      <td className="px-4 py-2">
                        {order.customer_name + " " + order.customer_last_name}
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
                <Loader />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WalletTable
