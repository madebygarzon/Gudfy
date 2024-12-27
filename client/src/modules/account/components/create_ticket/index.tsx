import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
//import { actionCreateSellerApplication } from "@modules/account/actions/action-seller-application"
import { useMeCustomer } from "medusa-react"
import axios from "axios"
import { addTicket } from "@modules/account/actions/tikets/post-add-ticket"
import InputFile from "@modules/common/components/input-file"
import Image from "next/image"

interface ContactFormValues {
  subject: string
  message: string
}

type Props = {
  onClose: () => void
  handlerReset: () => void
}

const TicketForm = ({ onClose, handlerReset }: Props) => {
  const { customer } = useMeCustomer()
  const [formData, setFormData] = useState<ContactFormValues>({
    subject: "",
    message: "",
  })
  const [image, setImage] = useState<File | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [ticketDelivered, setTicketDelivered] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const onSubmit = handleSubmit(async () => {
    setLoading(true)
    try {
      addTicket(formData, image, customer?.id).then(() => {
        setTicketDelivered(true)
        setLoading(false)
      })
    } catch (error) {
      console.error("Error al crear el ticket:", error)
    }
  })

  return (
    <>
      {ticketDelivered ? (
        <div className="flex flex-col items-center justify-center w-full p-6  rounded-md">
          <p className="mb-4 text-xl font-bold text-lila-gf">
            ¡El ticket fue enviado con éxito!
          </p>
          <ButtonMedusa
            className="px-4 py-2 text-white "
            onClick={() => {
              onClose()
              setTicketDelivered(false)
            }}
          >
            Volver
          </ButtonMedusa>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="">
          <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
            <p className="mb-4 text-xl font-extrabold text-center">
              Crear ticket
            </p>

            <Input
              value={formData.subject}
              label="Asunto"
              {...register("subject", { required: "Campo requerido" })}
              autoComplete="on"
              onChange={handleInputChange}
            />
            <Textarea
              value={formData.message}
              label="Mensaje"
              placeholder="Mensaje"
              {...register("message", { required: "Campo requerido" })}
              className=" rounded  mt-2"
              rows={5}
              onChange={handleInputChange}
            />
            {/* {image ? (
              <Image
                alt="ImagePreview"
                src={URL.createObjectURL(image)}
                width={100}
                height={100}
              />
            ) : ( */}
            <InputFile
              type="Plane"
              alt="Image"
              label="si lo requieres ingresa una imagen"
              file={image}
              setFile={setImage}
            />
            {/* )} */}

            <ButtonMedusa
              isLoading={loading}
              className="mt-4 mb-4 rounded-[5px]"
              type="submit"
              color="primary"
            >
              Enviar
            </ButtonMedusa>
          </div>
        </form>
      )}
    </>
  )
}

export default TicketForm
