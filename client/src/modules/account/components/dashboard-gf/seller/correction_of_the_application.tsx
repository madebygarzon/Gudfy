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
} from "@nextui-org/react"
import SellerRequestPerson from "@modules/account/components/seller_request_person"

type props = {
  handlerReset: () => void
}
const CorrectionApplication: React.FC<props> = ({ handlerReset }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside")

  return (
    <>
      <div className=" flex flex-col w-full space-y-10 items-center">
        <h1 className="text-center text-[38px] font-black">
          Su solicitud necesita ser corregida
        </h1>
        <p className=" text-center text-[18px] font-light max-w-[700px]">
          Mensaje informativo para la correccion de la solicitud
        </p>
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
              <SellerRequestPerson
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
