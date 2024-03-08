import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { Trash } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
type props = {
  variantID: string
  handlerDeleteVariant: (id: string) => void
}
export default function ModalDeleteVariant({
  variantID,
  handlerDeleteVariant,
}: props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <IconButton onClick={onOpen} className="text-red-700 ">
        <Trash />
      </IconButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Variación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estas seguro de querer Eliminar esta variación del producto?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Canelar
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handlerDeleteVariant(variantID)
                    onClose()
                  }}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
