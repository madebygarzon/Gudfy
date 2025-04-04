import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react"
import Link from "next/link"
import OrderRevie from "../order-review"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import type { order } from "../../templates/orders-template"
import Loader from "@lib/loader"

interface ModalOrderProps {
  orderData?: order
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrderCancel = ({
  orderData,
  onOpenChange,
  handleReset,
}: ModalOrderProps) => {
  async function handlerOrderCancel(orderId: string) {
    updateCancelStoreOrder(orderId).then(() => {
      onOpenChange()
      handleReset()
    })
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1"></ModalHeader>
      <ModalBody className="md:px-6 p-1">
        {orderData ? (
          <OrderRevie
            orderData={orderData}
            onClose={onOpenChange}
            handlerReset={handleReset}
          />
        ) : (
          <>
            <Loader />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <div className=" md:p-10"></div>
        {orderData?.state_order === "Pendiente de pago" && (
          <div className="w-full flex gap-2 justify-end">
            <Link href={"/checkout"}>
              <Button className="text-blue-600 bg-transparent border border-blue-600">
                ir a pagar
              </Button>
            </Link>
            <Button
              className="text-red-600 bg-transparent border border-red-600"
              onClick={() => handlerOrderCancel(orderData.id)}
            >
              Cancelar Orden
            </Button>
          </div>
        )}
      </ModalFooter>
    </>
  )
}

export default ModalOrderCancel
