"use client"
import React, { useEffect, useState } from "react"
import TableOrder from "../components/orders-table"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import ClaimTable from "../components/order-claim-table.ts"
import Notification from "@modules/common/components/notification"
import { useNotificationContext } from "@lib/context/notification-context"

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
    }
  ]
}

const OrdersTemplate = () => {
  const { notifications } = useNotificationContext()
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Compras , ordenes, reclamos</h1>
        <p className="text-base-regular">
          Vea sus pedidos anteriores y su estado. También puedes crear
          devoluciones o cambios para sus pedidos si es necesario.
        </p>
      </div>
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Orders" title="Mis Ordenes">
              <Card>
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
                  Reclamos
                  {notifications.map((n) => {
                    if (n.notification_type_id === "NOTI_CLAIM_CUSTOMER_ID") {
                      return <Notification />
                    }
                  })}
                </div>
              }
            >
              <Card>
                <CardBody>
                  <ClaimTable />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Compras" title="Compras">
              <Card>
                <CardBody>Listado de Compras</CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default OrdersTemplate
