"use client"
import React, { useEffect, useState } from "react"
import { Tabs, Tab, Card, CardBody } from "@heroui/react"
import PayingTable from "../components/seller-paying-table"
import { getStore } from "../actions/get-seller-store"
import type { SellerCredentials } from "types/global"
import WalletTable from "../components/seller_wallet_historic_table"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { useMeCustomer } from "medusa-react"

export type dataWallet = {
  id: string
  store_id: string
  available_balance: number
  outstanding_balance: number
  balance_paid: number
  wallet_address: string
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
    wallet_address: "",
  })

  return (
    <div className="w-full p-2 sm:p-8 border border-gray-200 rounded-lg">
      {/* Encabezado */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-lg sm:text-2xl mt-2 font-bold text-gray-700 capitalize">
          Billetera: {wallet.wallet_address}
        </h2>
        {/* Saldos */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-7 sm:mr-4 font-bold">
          <div>
            <span className="text-yellow-600 text-sm sm:text-base">
              Saldo pendiente: $ {wallet.outstanding_balance}
            </span>
          </div>
          <div>
            <span className="text-green-600 text-sm sm:text-base">
              Saldo disponible: $ {wallet.available_balance || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm sm:text-base">
              Saldo pagado: $ {wallet.balance_paid}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            <Tab
              key="Historico"
              title={
                <h3 className="md:text-sm text-xs">
                  Histórico de transacciones
                </h3>
              }
            >
              <Card className="shadow-white shadow-lg">
                <CardBody className="p-0">
                  <div className="flex w-full flex-col">
                    <WalletTable wallet={wallet} setWallet={setWallet} />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="Pagos"
              title={
                <h3 className="md:text-sm text-xs">
                  Histórico de transacciones
                </h3>
              }
              className="relative"
            >
              <Card className="shadow-white shadow-lg">
                <CardBody>
                  <PayingTable wallet={wallet} setWallet={setWallet} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default WalletTemplate
