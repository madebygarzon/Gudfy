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

type dataWallet = {
  id: string
  store_id: string
  aviable_balance: number
  outstanding_balance: number
  balance_paid: number
}

const WalletTemplate = () => {
  const { notifications } = useNotificationContext()
  const { customer } = useMeCustomer()
  const [wallet, setWallet] = useState<dataWallet>({
    id: "",
    store_id: "",
    aviable_balance: 0,
    outstanding_balance: 0,
    balance_paid: 0,
  })
  return (
    <div className="w-full p-8 border border-gray-200 rounded-lg">
      <div className="mb-8 flex flex-col gap-y-4">
       <h1 className="text-xl font-bold">Billetera de la tienda</h1>
      </div>
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab key="Historico" title="Historico de transacciones">
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <div className="flex w-full flex-col">
                    <WalletTable wallet={wallet} setWallet={setWallet} />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Pagos" title="Pagos" className="relative">
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <PayingTable wallet={wallet} setWallet={setWallet} />
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
