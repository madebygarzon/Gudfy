"use client"
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
import { FieldValues, useForm } from "react-hook-form"
import React, { useEffect } from "react"
import { actionSellerApplication } from "../actions/action-seller-application"
import { useAccount } from "@lib/context/account-context"

interface SellerCredentials extends FieldValues {
  identification_number: string
  address: string
}

const SupplierTemplate: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { customer } = useAccount()
  useEffect(() => {
    if (customer!) {
      console.log(customer)
      actionSellerApplication(customer.id)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SellerCredentials>()

  const onSubmit = handleSubmit(async (credentials) => {})

  return (
    <>
      <div className=" flex-col w-full space-y-10">
        <h1 className="text-center text-[38px] font-black">
          ¡ Unete a Gudfy !
        </h1>
        <p className=" text-center text-[18px] font-light max-w-[700px]">
          ¡Únete a nuestro marketplace como vendedor! Completa nuestro
          formulario de aceptación y comparte detalles sobre tu negocio y
          productos. Revisaremos tu solicitud rápidamente para que puedas
          empezar a vender en GUDFY. ¡Esperamos dar la bienvenida a tus
          productos y talento!
        </p>
        <div className="flex justify-center">
          <ButtonMedusa
            onClick={onOpen}
            className="text-[22px]"
            variant="primary"
          >
            Conviértete en vendedor
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
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Solicitud para tu tienda en Gudfy
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Numero de Identificacion"
                    {...register("identification_number", {
                      required: "Identidad requerida",
                    })}
                    autoComplete="number"
                    errors={errors}
                  />
                  <Input
                    label="Numero de Identificacion"
                    {...register("address", {
                      required: "Direccion requerida",
                    })}
                    autoComplete="address"
                    errors={errors}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Enviar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  )
}

export default SupplierTemplate
