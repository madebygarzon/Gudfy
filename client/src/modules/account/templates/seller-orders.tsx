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
    <div className="w-full p-8 border border-gray-200 rounded-lg shadow-2xl">
      <div className="mb-8 flex flex-col gap-y-4">
       <h1 className="text-2xl mt-2 font-bold text-gray-700">Ordenes de la tienda</h1>
      </div>
      <div>
        <div className="flex w-full flex-col ">
          <Tabs className="text-2xl" aria-label="Options">
            <Tab className="" key="Orders" title="Listado de ordenes">
              <Card className="shadow-white shadow-lg">
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
                  Reclamos de ordenes
                  {notifications.map((n) => {
                    if (n.notification_type_id === "NOTI_CLAIM_SELLER_ID") {
                      return <Notification />
                    }
                  })}
                </div>
              }
              className="relative"
            >
              <Card className="shadow-white shadow-lg">
                <CardBody className="border-none">
                  <ClaimSellerTable />
                </CardBody>
              </Card>
            </Tab>
            {/* <Tab key="Compras" title="Compras">
              <Card>
                <CardBody>Listado de Compras</CardBody>
              </Card>
            </Tab> */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SellerOrdersTemplate
