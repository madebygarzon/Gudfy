"use client"

import { useState, useEffect } from "react"
import React from "react"
import { useDisclosure } from "@nextui-org/react"
import { getWallet } from "@modules/account/actions/get-wallet"
import { getListPayOrders } from "@modules/account/actions/get-list-seller-pay-orders"

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
  state: "Pendiente de pago" | "Finalizado"
}

type dataWallet = {
  id: string
  store_id: string
  aviable_balance: number
  outstanding_balance: number
  balance_paid: number
}

const WalletTable: React.FC = () => {
  const [listOrders, setList] = useState<orderData[]>()
  const [wallet, setWallet] = useState<dataWallet>({
    id: "",
    store_id: "",
    aviable_balance: 0,
    outstanding_balance: 0,
    balance_paid: 0,
  })
  const handleReset = () => {
    // handlerGetListSellerOrder()
  }
  const [filterStatus, setFilterStatus] = useState<
    "Pendiente de pago" | "Finalizado" | "Cancelado" | "all"
  >("all")
  // const [selectOrderData, setSelectOrderData] = useState<orderData>()

  const getStatusColor = (
    status: "Pendiente de pago" | "Finalizado" | "Cancelado"
  ): string => {
    switch (status) {
      case "Cancelado":
        return "bg-red-200"
      case "Pendiente de pago":
        return "bg-yellow-200"
      case "Finalizado":
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

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4 ">
        <h1 className="text-2xl-semi">Historico de transacciones</h1>
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
                  e.target.value as "Pendiente de pago" | "Finalizado" | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Por pagar">Por pagar</option>
              <option value="Completado">Completado</option>
            </select>
            <label htmlFor="date-filter" className=" ml-4 mr-2 font-semibold ">
              Filtrar por Fecha:
            </label>
            <select
              id="date-filter"
              className="p-2 shadow-sm border-x-neutral-500 rounded"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "Pendiente de pago" | "Finalizado" | "all"
                )
              }
            >
              <option value="all">Todos</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Por pagar">Por pagar</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
          <div className="flex w-auto gap-7 mr-4 font-bold">
            <div>
              Saldo Pendiente:{" "}
              <span className="text-yellow-600  text-lg">
                {" "}
                $ {wallet.outstanding_balance}
              </span>
            </div>
            <div>
              Saldo Disponible:{" "}
              <span className="text-green-600 text-lg">
                $ {wallet.aviable_balance}{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2  bg-gray-100 text-left">Producto</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Cantidad</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Valor</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Comisión</th>
                <th className="px-4 py-2  bg-gray-100 text-left">
                  Numero de pedido
                </th>
                <th className="px-4 py-2  bg-gray-100 text-left">Neto</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Cliente</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Fecha</th>
                <th className="px-4 py-2  bg-gray-100 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {listOrders?.length ? (
                listOrders?.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 ">{order.produc_title}</td>
                    <td className="px-4 py-2 ">{order.quantity}</td>
                    <td className="px-4 py-2 ">$ {order.unit_price}</td>
                    <td className="px-4 py-2 ">
                      $ {(order.total_price_for_product * 0.1).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 ">{order.number_order}</td>
                    <td className="px-4 py-2 ">
                      {order.unit_price * order.quantity -
                        order.total_price_for_product * 0.1}
                    </td>
                    <td className="px-4 py-2 ">
                      {order.customer_name + " " + order.customer_last_name}
                    </td>
                    <td className="px-4 py-2 ">{order.created_date}</td>
                    <td className=" py-2">
                      <p
                        className={`${getStatusColor(
                          order.state
                        )} px-4 py-2 rounded-lg `}
                      >
                        {order.state === "Pendiente de pago"
                          ? "Pendiente"
                          : order.state === "Finalizado"
                          ? ""
                          : ""}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <>Cargando...</>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WalletTable
