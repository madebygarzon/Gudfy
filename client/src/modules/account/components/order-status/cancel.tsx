import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"
import Link from "next/link"
import OrderRevie from "../order-review"
import { updateCancelStoreOrder } from "@modules/account/actions/update-cancel-store-order"
import type { order } from "../../templates/orders-template"

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
      <ModalBody>
        {orderData ? (
          <OrderRevie
            orderData={orderData}
            onClose={onOpenChange}
            handlerReset={handleReset}
          />
        ) : (
          <>CARGANDO</>
        )}
      </ModalBody>
      <ModalFooter>
        <p>
          A partir de ahora, tiene un plazo de 10 días para presentar cualquier
          reclamo{" "}
          <Link
            className="text-[#402e72] font-bold hover:text-[#2c1f57]"
            href={"/account/support"}
          >
            aquí.
          </Link>{" "}
          Si no recibimos ningún reclamo dentro de este período, consideraremos
          que ha recibido su compra con éxito.
        </p>
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
