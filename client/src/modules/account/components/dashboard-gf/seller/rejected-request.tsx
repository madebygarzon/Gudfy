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
}
const RejectedApplication: React.FC<props> = ({ comment }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const [scrollBehavior, setScrollBehavior] =
    React.useState<ModalProps["scrollBehavior"]>("inside")

  return (
    <>
      <div className=" flex flex-col w-full space-y-10 items-center prose ">
        <h1 className="text-center text-[38px] font-black">
          Su solicitud para ser vendedor ha sido rechazada
        </h1>
        <Alert
          variant="error"
          className=" text-center text-[18px] font-light max-w-[700px] bg-white"
        >
          {comment.charAt(0).toUpperCase() + comment.slice(1)}
        </Alert>
        <p className="text-center text-[18px] font-light max-w-[700px]">
          Lamentamos informarte que tu solicitud para convertirte en vendedor en
          GUDFY ha sido rechazada. Apreciamos sinceramente tu interés en formar
          parte de nuestra comunidad. Por favor, ten en cuenta que esta decisión
          no refleja necesariamente tus habilidades o méritos, sino que se debe
          a factores específicos considerados en nuestro proceso de selección.
          Te agradecemos nuevamente por tu tiempo y dedicación. Si tienes alguna
          pregunta o necesitas más información, no dudes en ponerte en contacto
          con nosotros.
        </p>
      </div>
    </>
  )
}

export default RejectedApplication
