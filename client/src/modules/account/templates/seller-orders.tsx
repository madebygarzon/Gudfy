"use client"
import React, { useEffect, useState } from "react"
//import TableOrder from "../components/seller-orders-table"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import ClaimSellerTable from "../components/order-claim-seller-table"
import { getStore } from "../actions/get-seller-store"
import type { SellerCredentials } from "types/global"
import SellerOrderTable from "../components/seller-orders-table"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"

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

interface SellerRole {
  application: boolean
  state: string
  comment: string
  application_data: SellerCredentials & { id: string }
}

const SellerOrdersTemplate = () => {
  const { notifications } = useNotificationContext()
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi"> Gestiona tus ventas y reclamos</h1>
        <p className="text-base-regular">
          Vea sus pedidos mas recientes y sus estados. También puedes
          interactuar con las ordenes o reclamos
        </p>
      </div>
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Orders" title="Ordenes">
              <Card>
                <CardBody>
                  <div className="flex w-full flex-col">
                    <SellerOrderTable />
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
                    if (n.notification_type_id === "NOTI_CLAIM_SELLER_ID") {
                      return <Notification />
                    }
                  })}
                </div>
              }
              className="relative"
            >
              <Card>
                <CardBody>
                  <ClaimSellerTable />
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

export default SellerOrdersTemplate
