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
import SellerRequestPerson from "@modules/account/components/seller_request_person"
import SellerRequestCompany from "@modules/account/components/seller_request_company"
import SellerRequestSimple from "@modules/account/components/seller_request_simple"

type props = {
  handlerReset: () => void
}
const ApplyForSeller: React.FC<props> = ({ handlerReset }) => {
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
      <div className=" flex flex-col w-full space-y-10 items-center">
        <h1 className="mt-8 text-center text-[38px] font-black">
          ¡Postúlate como vendedor en Gudfy!
        </h1>

        <p className=" text-center text-[18px] font-light max-w-[700px]">
          Postúlate ahora para formar parte de nuestro marketplace. Si tienes
          productos digitales y quieres llegar a miles de compradores, este es
          tu lugar. Llena el formulario, cuéntanos sobre tu tienda o negocio y
          empieza tu camino como vendedor en Gudfy. ¡Bienvenido a la comunidad
          de vendedores de Gudfy! 🚀🛍
        </p>
        {/* <h2 className="text-center text-2xl font-semibold">
          ¿Cómo te identificas?
        </h2> */}
        <div className="text-center">
          <ButtonMedusa
            onClick={onOpen}
            className="text-[22px] mr-4"
            variant="primary"
          >
            ¡Postúlate como vendedor aquí!

          </ButtonMedusa>
          {/* <ButtonMedusa
            onClick={onOpen2}
            className="text-[22px]"
            variant="primary"
          >
            Represento una empresa
          </ButtonMedusa> */}
        </div>
      </div>
      {}
      <>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          className=""
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 mr-auto ml-auto">
              Solicitud comerciante individual
            </ModalHeader>
            <ModalBody>
              <SellerRequestSimple
                onClose={onClose}
                handlerReset={handlerReset}
              />
              {/* <SellerRequestPerson
                onClose={onClose}
                handlerReset={handlerReset}
              /> */}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
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
