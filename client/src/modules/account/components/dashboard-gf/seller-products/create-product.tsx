"use client"
import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react"
import Input from "@modules/common/components/input"
import { useForm } from "react-hook-form"
import { CreateProductInput } from "@modules/account/actions/post-seller-product"
import { Button as ButtonM } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"

export default function CreateProduct() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const onSubmit = handleSubmit(async (credentials) => {
    if (!credentials.title) return alert("Campos sin completar")

    CreateProductInput({
      title: credentials.title,
    })
  })

  return (
    <>
      <div className=" flex-col w-full space-y-10">
        <div className="flex justify-center">
          {/* <ButtonMedusa
            onClick={onOpen}
            className="text-[22px]"
            variant="primary"
          >
            Crea un producto
          </ButtonMedusa> */}
          <ButtonM
            variant="transparent"
            className=" border rounded-[5px]"
            onClick={onOpen}
          >
            Añadir producto
            <Plus />
          </ButtonM>
        </div>
      </div>
      {
        //Pop up Modal
      }
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Crea un producto
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Numero de Identificacion"
                    {...register("title", {
                      required: "Identidad requerida",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" color="primary">
                    Enviar
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  )
}
