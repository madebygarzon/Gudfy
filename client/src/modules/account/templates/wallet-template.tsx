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
  available_balance: number
  outstanding_balance: number
  balance_paid: number
}

const WalletTemplate = () => {
  const { notifications } = useNotificationContext()
  const { customer } = useMeCustomer()
  const [wallet, setWallet] = useState<dataWallet>({
    id: "",
    store_id: "",
    available_balance: 0,
    outstanding_balance: 0,
    balance_paid: 0,
  })
  return (
    <div className="w-full p-8 border border-gray-200 rounded-lg">
      <div className="mb-8 flex  gap-y-4 justify-between">
       <h1 className="text-xl font-bold">Billetera de la tienda</h1>
       <div className="flex w-auto gap-7 mr-4 font-bold">
            <div>
              
              <span className="text-yellow-600  ">
              Saldo pendiente:{" "}
                $ {wallet.outstanding_balance}{" "}
              </span>
            </div>
            <div>
             
              <span className="text-green-600 ">
              Saldo disponible:{" "} $ {wallet.available_balance || 0}{" "}
              </span>
            </div>
            <div>
             
              <span className="text-gray-400-600 ">
              Saldo pagado:{" "}
                $ {wallet.balance_paid}{" "}
              </span>
            </div>
          </div>
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
            <Tab key="Pagos" title="Historico de pagos" className="relative">
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
