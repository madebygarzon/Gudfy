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
import SellerRequestCompany from "@modules/account/components/seller_request_company"

type dataCustomer = {
  customer_id: string
  handlerReset: () => void
}

const ApplyForSeller: React.FC<dataCustomer> = ({
  customer_id,
  handlerReset,
}) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside")
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
    onOpenChange: onOpenChange2,
  } = useDisclosure()
  return (
    <>
      <div className=" flex-col w-full space-y-10">
        <h1 className="text-center text-[38px] font-black">
          ¡ Unete a Gudfy !
        </h1>

        <p className=" text-center text-[18px] font-light max-w-[700px]">
          ¡Únete como vendedor en GUDFY! Completa nuestro formulario y comparte
          detalles sobre tu negocio. Revisaremos rápido para que puedas empezar
          a vender. ¡Bienvenido a nuestra comunidad! 🚀🛍️
        </p>
        <h2 className="text-center text-2xl font-semibold">
          ¿Cómo te identificas?
        </h2>
        <div className="text-center">
          <ButtonMedusa
            onClick={onOpen}
            className="text-[22px] mr-4"
            variant="primary"
          >
            Soy comerciante individual
          </ButtonMedusa>
          <ButtonMedusa
            onClick={onOpen2}
            className="text-[22px]"
            variant="primary"
          >
            Represento una empresa
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
              <SellerRequestPerson />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          className=""
          isOpen={isOpen2}
          onOpenChange={onOpenChange2}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 mr-auto ml-auto">
              Represento una empresa
            </ModalHeader>
            <ModalBody>
              <SellerRequestCompany />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </>
  )
}

export default ApplyForSeller
