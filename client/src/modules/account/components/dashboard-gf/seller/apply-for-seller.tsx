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
import Image from "next/image"
import image_cta_seller from "../../../../../../public/home/cta_image_seller.png"

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
      <div className=" block md:flex w-full md:space-y-10 items-center">
        <div className="px-2 md:ml-6 md:mr-0 mr-8 flex flex-col w-full ">
          <h1 className="mt-8 text-center md:text-start text-[50px] leading-tight font-semibold text-[#1F0054] ">
            ¡Vende tus productos digitales en Gudfy!
          </h1>

          <p className="pt-6 pb-2 text-center md:text-start text-[18px] font-light w-full md:max-w-[700px]">
            ¿Tienes productos digitales y quieres llegar a miles de compradores?
          </p>
          <p className="py-2  text-center md:text-start text-[18px] font-light w-full md:max-w-[700px]">
            Postúlate y forma parte de nuestro marketplace.
          </p>
          <p className="py-2  text-center md:text-start text-[18px] font-light w-full md:max-w-[700px]">
            Cuéntanos sobre tu tienda y empieza hoy mismo.
          </p>
          <p className="pt-2 pb-6 text-center md:text-start text-[18px] font-light w-full md:max-w-[700px]">
            🚀¡Bienvenido a la comunidad de Gudfy!
          </p>

          {/* <h2 className="text-center text-2xl font-semibold">
            ¿Cómo te identificas?
          </h2> */}
          <div className="md:text-start text-center">
            <ButtonMedusa
              onClick={onOpen}
              className="text-[25px] px-8 py-8  bg-[#1F0054] text-white"
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

        <div className="my-8 md:my-0  md:ml-0 flex items-center justify-center md:flex-col w-full">
          <Image
            src={image_cta_seller}
            alt="CTA Seller"
            className="w-[350] sm:w-64 md:w-[400px] h-auto" // 12 rem → 16 rem → 400 px
          />
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
