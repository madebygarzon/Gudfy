import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
//import { actionCreateSellerApplication } from "@modules/account/actions/action-seller-application"
import { useMeCustomer } from "medusa-react"
import axios from "axios"
import { addTicket } from "@modules/account/actions/tikets/post-add-ticket"
import InputFile from "@modules/common/components/input-file"
import ButtonLigth from "@modules/common/components/button_light"

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
    try {
      addTicket(formData, image, customer?.id)
      onClose()
      handlerReset()
    } catch (error) {
      console.error("Error al crear el ticket:", error)
    }
  })

  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full  text-sm ml-auto">
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
        <InputFile
          alt="Image"
          label="Adjuntar imagen"
          setFile={setImage}
        />
        <div className="mt-4 flex items-center justify-center gap-2">
          <ButtonLigth
            color="primary"
            className="bg-[#28A745] px-3 hover:bg-[#218838] text-white border-none w-full sm:w-auto"
            type="submit"            
          >
            Crear ticket
          </ButtonLigth>
        </div>
        
      </div>
    </form>
  )
}

export default TicketForm
