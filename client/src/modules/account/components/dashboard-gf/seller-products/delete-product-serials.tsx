"use client"
import React, { useState, useEffect } from "react"
import DeleteSerialCode from "@modules/account/actions/serial-code/delete-serial-code"

import { Modal, ModalContent, ModalBody } from "@nextui-org/react"
import ButtonLigth from "@modules/common/components/button_light"

type props = {
  serials: string[] | string
  onOpenChange: () => void
  isOpen: boolean
  onCloseDelete: () => void
  handlergetListProductSerials: () => void
}

export default function DeletetSerials({
  onCloseDelete,
  serials,
  onOpenChange,
  isOpen,
  handlergetListProductSerials,
}: props) {
  const onDeleteListSerial = () => {
    if (serials.length) {
      DeleteSerialCode(serials)
        .then((response) => {
          handlergetListProductSerials()
          onCloseDelete()
        })
        .catch(() => {
          alert("Error al eliminar la lista de codigos")
        })
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent className="rounded-lg shadow-lg">
        {(onClose) => (
          <>
            <ModalBody className="flex items-center justify-center py-10 px-5 ">
              <strong>
                <span>
                  ¿ Estas seguro de eliminar{" "}
                  {Array.isArray(serials)
                    ? serials.length + " codigos"
                    : "el codigo"}{" "}
                  ?
                </span>
              </strong>
              <ButtonLigth
                color="primary"
                className="bg-[#ff0040cc] hover:bg-[#ff0040] text-white border-none w-full sm:w-auto"
                onClick={onDeleteListSerial}
              >
                Eliminar
              </ButtonLigth>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
