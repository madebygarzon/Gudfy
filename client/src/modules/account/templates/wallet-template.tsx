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
import Button from "@modules/common/components/button"
import ButtonLigth from "@modules/common/components/button_light"
import { requestPayment } from "../actions/wallet/request-payment"
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react"
import { updateWallet } from "../actions/wallet/update-wallet"

export type dataWallet = {
  id: string
  store_id: string
  available_balance: number
  outstanding_balance: number
  balance_paid: number
  wallet_address: string
  payment_request: boolean
}

const WalletTemplate = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { notifications } = useNotificationContext()
  const { customer } = useMeCustomer()
  const [wallet, setWallet] = useState<dataWallet>({
    id: "",
    store_id: "",
    available_balance: 0,
    outstanding_balance: 0,
    balance_paid: 0,
    wallet_address: "",
    payment_request: true,
  })
  
  const [walletData, setWalletData] = useState({
    wallet_address: "",
    confirm_wallet_address: ""
  })
  const [walletError, setWalletError] = useState<string>("")
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWalletData({
      ...walletData,
      [name]: value
    })
  }

  const handleSaveWalletAddress = async () => {
    if (walletData.wallet_address !== walletData.confirm_wallet_address) {
      setWalletError("Las direcciones de billetera no coinciden")
      return
    }
    
    if (!walletData.wallet_address || walletData.wallet_address.trim() === "") {
      setWalletError("Por favor ingrese una dirección de billetera válida")
      return
    }
    
    try {
      setIsSaving(true)
      const newWalletAddress = walletData.wallet_address
      
      setWallet(prevWallet => ({
        ...prevWallet,
        wallet_address: newWalletAddress
      }))

      await updateWallet(newWalletAddress)
      onClose()
      
      requestPayment().then(() => {
        setWallet(prevWallet => ({
          ...prevWallet,
          payment_request: true,
          wallet_address: newWalletAddress
        }))
      })
    } catch (error) {
      console.error("Error al guardar la dirección de wallet:", error)
      setWalletError("Ocurrió un error al guardar la dirección. Intente nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlerPaymentRequest = () => {
    if (!wallet.wallet_address || wallet.wallet_address.trim() === "") {
      onOpen()
      return
    }

    requestPayment().then(() => {
      setWallet({
        ...wallet,
        payment_request: true,
      })
    })
  }

  return (
    <div className="w-full p-2 sm:p-8 border border-gray-200 rounded-lg">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size="xl"
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
                <h2 className="text-center text-lg sm:text-2xl font-bold text-gray-700">
                  Registrar dirección de billetera
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="p-4">
                  <p className="mb-4 text-gray-600">Para poder solicitar un pago, necesitas registrar tu dirección de billetera.</p>
                  
                  {walletError && (
                    <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg">
                      {walletError}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Dirección de billetera</label>
                      <Input 
                        name="wallet_address"
                        value={walletData.wallet_address}
                        onChange={handleWalletAddressChange}
                        placeholder="Ingresa tu dirección de billetera"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirmar dirección de billetera</label>
                      <Input 
                        name="confirm_wallet_address"
                        value={walletData.confirm_wallet_address}
                        onChange={handleWalletAddressChange}
                        placeholder="Confirma tu dirección de billetera"
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <ButtonLigth
                  type="button"
                  onClick={handleSaveWalletAddress}
                  className="bg-[#9B48ED] hover:bg-[#7b39c4] text-white border-none w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </div>
                  ) : (
                    "Guardar y solicitar pago"
                  )}
                </ButtonLigth>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-lg sm:text-2xl mt-2 font-bold text-gray-700 capitalize">
        {wallet.wallet_address ? "Billetera: " + wallet.wallet_address : ""}
        </h2>
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
        <div>
          {!wallet.payment_request ? (
            <>
            
            <Button
              onClick={handlerPaymentRequest}
              disabled={wallet.available_balance < 10}
              className={wallet.available_balance < 10 ? "bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed" : ""}
            >
              {wallet.available_balance < 10 ? "Saldo insuficiente" : "Solicitar Pago"}
              
            </Button>
            {wallet.available_balance < 10  &&  <p className="text-xs text-center text-gray-400">Pago minimo de $10</p>}
            </>
          ) : (
            <Button
              disabled
              className="bg-red-200 hover:bg-red-300 text-gray-700"
            >
              Pago en proceso
            </Button>
          )}
        </div>
      </div>
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
              title={<h3 className="md:text-sm text-xs">Histórico de pagos</h3>}
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
