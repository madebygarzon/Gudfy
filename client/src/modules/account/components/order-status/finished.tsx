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

interface ModalOrderProps {
  orderData?: order
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrderFinished = ({
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
      <ModalBody>
        {orderData ? (
          <OrderRevie
            orderData={orderData}
            onClose={onOpenChange}
            handlerReset={handleReset}
          />
        ) : (
          <>CARGANDO...</>
        )}
      </ModalBody>
    </>
  )
}

export default ModalOrderFinished
