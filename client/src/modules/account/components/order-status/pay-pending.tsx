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
import Loader from "@lib/loader"
import ButtonLigth from "@modules/common/components/button_light"

interface ModalOrderProps {
  orderData?: order
  onOpenChange: () => void
  handleReset: () => void
}

const ModalOrderPending = ({
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
          <Loader />
        )}
      </ModalBody>
      <ModalFooter>
        <div>
          <div className="m-4">
            <p className="text-xs">
              * A partir de ahora, tiene un plazo de 10 días para presentar
              cualquier reclamo{" "}
              <Link
                className="text-[#402e72] font-bold hover:text-[#2c1f57]"
                href={"/account/tickets"}
              >
                aquí.
              </Link>{" "}
              Si no recibimos ningún reclamo dentro de este período,
              consideraremos que ha recibido su compra con éxito.*
            </p>
          </div>
          <div className="">
            {orderData?.state_order === "Pendiente de pago" && (
              <div className="w-full flex gap-2 justify-center">
                <Link href={"/checkout"}>
                  <ButtonLigth className="bg-[#28A745] hover:bg-[#218838] text-white border-none">
                    ir a pagar
                  </ButtonLigth>
                </Link>
                <ButtonLigth
                  className="bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none"
                  onClick={() => handlerOrderCancel(orderData.id)}
                >
                  Cancelar orden
                </ButtonLigth>
              </div>
            )}
          </div>
        </div>
      </ModalFooter>
    </>
  )
}

export default ModalOrderPending
