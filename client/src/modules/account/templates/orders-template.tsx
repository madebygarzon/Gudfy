import React, { useEffect, useState } from "react"
import TableOrder from "../components/orders-table"
import { getListOrders } from "../actions/get-list-orders"
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react"

const OrdersTemplate = () => {
  const [orders, setOrders] = useState()
  useEffect(() => {
    getListOrders().then((e) => {
      setOrders(e)
    })
  })
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Compras y ordenes</h1>
        <p className="text-base-regular">
          Vea sus pedidos anteriores y su estado. También puedes crear
          devoluciones o cambios para sus pedidos si es necesario.
        </p>
      </div>
      <div>
        <div className="flex w-full flex-col">
          <TableOrder />
        </div>
      </div>
    </div>
  )
}

export default OrdersTemplate
