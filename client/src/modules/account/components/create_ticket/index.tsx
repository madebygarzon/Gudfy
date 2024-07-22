import React, { useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
//import { actionCreateSellerApplication } from "@modules/account/actions/action-seller-application"
import { useMeCustomer } from "medusa-react"
import axios from "axios";

interface ContactFormValues {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string;
}

type Props = {
  onClose: () => void
  handlerReset: () => void
}

const TicketForm = ({ onClose, handlerReset }: Props) => {
  const { customer } = useMeCustomer()
  const [formData, setFormData] = useState<ContactFormValues>({
    name: `${customer?.first_name || ""} ${customer?.last_name || ""}`,
    email: customer?.email || "",
    phone: customer?.phone || "",
    subject: "",
    message: "",
    status: "",
  })

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
      const response = await axios.post('/api/tickets', formData);
      console.log('Ticket creado:', response.data);
      onClose();
      handlerReset();
    } catch (error) {
      console.error('Error al crear el ticket:', error);
    }
  })

  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
        <p className="mb-4 text-xl font-extrabold text-center">Crear ticket</p>
        <Input
          value={formData.name}
          label="Nombre"
          {...register("name", { required: "Campo requerido" })}
          autoComplete="on"
          onChange={handleInputChange}
        />
        <Input
          value={formData.email}
          label="Correo electrónico"
          {...register("email", { required: "Campo requerido" })}
          autoComplete="on"
          onChange={handleInputChange}
        />
        <Input
          value={formData.phone}
          label="Número telefónico"
          {...register("phone", { required: "Campo requerido" })}
          autoComplete="on"
          onChange={handleInputChange}
        />
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
        <ButtonMedusa
          className="mt-4 mb-4 rounded-[5px]"
          type="submit"
          color="primary"
        >
          Enviar
        </ButtonMedusa>
      </div>
    </form>
  )
}

export default TicketForm
