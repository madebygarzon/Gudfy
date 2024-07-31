"use client"
import React, { useEffect, useState } from "react"
import TableOrder from "../components/orders-table"
import { getListOrders } from "../actions/get-list-orders"
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react"
import { useMeCustomer } from "medusa-react"

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
    | "Cancelado"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión"
  store_variant: [
    {
      produc_title: string
      total_price_for_product: string
      quantity: string
      price: string
      store_name: string
    }
  ]
}

const OrdersTemplate = () => {
  const { customer } = useMeCustomer()
  const [orders, setOrders] = useState<order[]>([])
  useEffect(() => {
    getListOrders(customer?.id || "").then((e) => {
      setOrders(e)
    })
  }, [])
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
          <TableOrder orders={orders} />
        </div>
      </div>
    </div>
  )
}

export default OrdersTemplate
