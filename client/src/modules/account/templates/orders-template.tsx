"use client"
import React, { useEffect, useState } from "react"
import TableOrder from "../components/orders-table"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import ClaimTable from "../components/order-claim-table.ts"
import Notification from "@modules/common/components/notification"
import { useNotificationContext } from "@lib/context/notification-context"
import SerialCodeTable from "../components/products-serial-codes"

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
      store_id: string
      store_name: string
      store_variant_order_id: string
      produc_title: string
      price: string
      quantity: string
      total_price_for_product: string
      serial_code_products: [{ id: string; serial: string }]
    }
  ]
}

const OrdersTemplate = () => {
  const { notifications } = useNotificationContext()
  return (
    <div className="w-full p-8 border border-gray-200 shadow-2xl rounded-lg">
      <div className="mb-8 flex flex-col gap-y-4">
       <h2 className="text-2xl mt-2 font-bold text-gray-700">Gestión de pedidos</h2>
      </div>     
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Orders" title="Mis ordenes">
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <div className="flex w-full flex-col">
                    <TableOrder />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="Reclamos"
              title={
                <div className="relative -m-1">
                  Mis reclamos
                  {notifications.map((n) => {
                    if (n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID") {
                      return <Notification />
                    }
                  })}
                </div>
              }
            >
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <ClaimTable />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Compras" title="Mis compras">
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <SerialCodeTable />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default OrdersTemplate
