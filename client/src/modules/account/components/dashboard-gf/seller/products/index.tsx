"use client"
import React from "react"
import ButtonMedusa from "@modules/common/components/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import Input from "@modules/common/components/input"
import { useForm } from "react-hook-form"
import { CreateProductInput } from "@modules/account/actions/post-seller-store"
import { getStore } from "@modules/account/actions/get-seller-store"

export default function Product() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const onSubmit = handleSubmit(async (credentials) => {
    if (!credentials.title) return alert("Campos sin completar")
    const store = await getStore()
    CreateProductInput({
      title: credentials.title,
    })
  })
  return (
    <>
      <div className=" flex-col w-full space-y-10">
        <div className="flex justify-center">
          <ButtonMedusa
            onClick={onOpen}
            className="text-[22px]"
            variant="primary"
          >
            Crea un producto
          </ButtonMedusa>
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
