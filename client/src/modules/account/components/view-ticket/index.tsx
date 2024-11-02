import React, { useEffect, useState } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import InputFile from "@modules/common/components/input-file"
import { getDataMessagesTicket } from "@modules/account/actions/tikets/get-data-messages-ticket"
import Image from "next/image"
import { addTicketMessage } from "@modules/account/actions/tikets/post-add-ticker-message"

interface ContactFormValues {
  id_ticket: string
  owner_id: string
  message: string
  image: string
  created_at: string
}

type Props = {
  onClose: () => void
  handlerReset: () => void
  ticketId: string
  subject: string
}

const ViewTicket = ({ onClose, handlerReset, ticketId, subject }: Props) => {
  const [message, setMessage] = useState<string>("")
  const [data, setData] = useState<ContactFormValues[]>()
  const [image, setImage] = useState<File | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>()

  const onSubmit = handleSubmit(async () => {
    try {
      // agregar el comentario y cerrar el modal
      addTicketMessage({ ticketId, message }, image)
      onClose()
      handlerReset()
    } catch (error) {
      console.error("Error al crear el ticket:", error)
    }
  })

  useEffect(() => {
    if (ticketId)
      getDataMessagesTicket(ticketId).then((e) => {
        console.log("data de los menssages", e)
        setData(e)
      })
  }, [ticketId])

  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
        <p className="mb-4 text-xl font-extrabold text-center">{subject}</p>
        {ticketId}
        {data?.map((message) => (
          <div
            className={`flex w-full   ${
              message.owner_id === "COMMENT_CUSTOMER_ID"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="my-1 px-3 py-1 bg-slate-200 border rounded-[10px]">
              <p className="text-xs">
                {message.owner_id === "COMMENT_CUSTOMER_ID"
                  ? "Yo"
                  : message.owner_id === "COMMENT_ADMIN_ID"
                  ? "Admin Gudfy"
                  : ""}
              </p>
              {message.message}

              {message.image ? (
                <Image
                  src={message.image}
                  alt={"Image"}
                  height={200}
                  width={200}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
        <Input
          value={message}
          label="Mensaje"
          placeholder="Mensaje"
          {...register("message", { required: "Campo requerido" })}
          className=" rounded  mt-2"
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <InputFile
          alt="Image"
          label="si lo requieres ingresa una imagen"
          setFile={setImage}
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

export default ViewTicket
