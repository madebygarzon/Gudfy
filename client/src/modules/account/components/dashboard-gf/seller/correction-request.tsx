import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import {
  Modal,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react"
import { Alert } from "@medusajs/ui"
import type { SellerCredentials } from "types/global"
import SellerUpdateRequest from "../../seller-update-request"

type props = {
  comment: string
  data: SellerCredentials & { id: string }
  handlerReset: () => void
}
const CorrectionApplication: React.FC<props> = ({
  handlerReset,
  data,
  comment,
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside")

  return (
    <>
      <div className=" flex flex-col w-full space-y-10 items-center prose ">
        <h1 className="text-center text-[38px] font-black">
          Su solicitud necesita ser corregida
        </h1>
        <Alert
          variant="warning"
          className=" text-center text-[18px] font-light max-w-[700px]"
        >
          {comment.charAt(0).toUpperCase() + comment.slice(1)}
        </Alert>
        <div className="text-center">
          <ButtonMedusa
            onClick={onOpen}
            className="text-[22px] mr-4"
            variant="primary"
          >
            Abrir informacion de la solicitud
          </ButtonMedusa>
        </div>
      </div>
      {}
      <>
        <Modal
          className=""
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 mr-auto ml-auto">
              Solicitud comerciante individual
            </ModalHeader>
            <ModalBody>
              <SellerUpdateRequest
                data={data}
                onClose={onClose}
                handlerReset={handlerReset}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </>
  )
}

export default CorrectionApplication
