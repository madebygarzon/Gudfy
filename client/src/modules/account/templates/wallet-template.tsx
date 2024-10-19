"use client"
import React, { useEffect, useState } from "react"
//import TableOrder from "../components/seller-orders-table"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import PayingTable from "../components/seller-paying-table"
import { getStore } from "../actions/get-seller-store"
import type { SellerCredentials } from "types/global"
import WalletTable from "../components/seller_wallet_historic_table"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { useMeCustomer } from "medusa-react"

const WalletTemplate = () => {
  const { notifications } = useNotificationContext()
  const { customer } = useMeCustomer()
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          {customer?.first_name} esta es tu Billetera
        </h1>
        <p className="text-base-regular">
          "En esta billetera digital, podrás visualizar el historial completo de
          tus transacciones, incluyendo tu saldo disponible, saldo pendiente y
          las cantidades retiradas. Además, tendrás un desglose detallado de los
          productos que ya han sido pagados y aquellos que aún están en proceso
          de pago, brindándote un control total sobre tu actividad financiera."
        </p>
      </div>
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Historico" title="Historico">
              <Card>
                <CardBody>
                  <div className="flex w-full flex-col">
                    <WalletTable />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Pagos" title="Pagos" className="relative">
              <Card>
                <CardBody>
                  <PayingTable />
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

export default WalletTemplate
