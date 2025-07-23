import React, { useEffect, useState, useRef } from "react"
import ButtonMedusa from "@modules/common/components/button"
import { Input, Textarea } from "@heroui/react"
import { useForm } from "react-hook-form"
import InputFile from "@modules/common/components/input-file"
import { getDataMessagesTicket } from "@modules/account/actions/tikets/get-data-messages-ticket"
import Image from "next/image"
import { addTicketMessage } from "@modules/account/actions/tikets/post-add-ticker-message"
import ButtonLigth from "@modules/common/components/button_light"
import { SendIcon } from "@lib/util/icons"
import { PlayMiniSolid } from "@medusajs/icons"
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
  status: "Cerrado" | "Abierto" | "Contestado" | undefined
}

const ViewTicket = ({
  onClose,
  handlerReset,
  ticketId,
  subject,
  status,
}: Props) => {
  const [message, setMessage] = useState<string>("")
  const [data, setData] = useState<ContactFormValues[]>()
  const [image, setImage] = useState<File | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [data])

  const onSubmit = handleSubmit(async () => {
    try {
      await addTicketMessage({ ticketId, message }, image)
      setImage(undefined)
      setMessage("")
      getDataMessagesTicket(ticketId).then((e) => {
        setData(e)
      })
    } catch (error) {
      console.error("Error al crear el ticket:", error)
    }
  })

  useEffect(() => {
    if (ticketId)
      getDataMessagesTicket(ticketId).then((e) => {
        setData(e)
      })
  }, [ticketId])

  return (
    <form onSubmit={onSubmit} className="">
      <div className="border-b border-gray-200 p-8 -mt-10">
        <p className="text-center text-xs">
          Asunto del ticket:{" "}
          <p className="text-lg font-bold text-center">{subject}</p>
        </p>
        <p className="text-center text-xs">
          Ticket número: <span className="font-bold">{ticketId}</span> | Estado
          del ticket: <span className="font-bold">{status}</span>
        </p>
      </div>
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
        <div className="overflow-y-scroll h-72 border-b border-gray-300">
          {data?.map((message) => (
            <div
              className={`flex w-full transition-transform duration-300 ease-in-out ${
                message.owner_id === "COMMENT_CUSTOMER_ID"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 shadow-md text-sm ${
                  message.owner_id === "COMMENT_CUSTOMER_ID"
                    ? "bg-blue-400 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl"
                    : "bg-gray-200 text-gray-900 rounded-br-xl rounded-tr-xl rounded-tl-xl"
                } my-1`}
              >
                <p className="mb-1 text-xs font-bold">
                  {message.owner_id === "COMMENT_CUSTOMER_ID"
                    ? "Yo"
                    : message.owner_id === "COMMENT_ADMIN_ID"
                    ? "Admin Gudfy"
                    : ""}
                </p>
                {message.created_at && (
                  <p className={`text-[10px] mb-2 ${
                    message.owner_id === "COMMENT_CUSTOMER_ID" ? "text-white" : "text-gray-500"
                  }`}>
                    {new Date(message.created_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                )}
                <p>{message.message}</p>
                {message.image ? (
                  <Image
                    src={message.image}
                    alt={"Image"}
                    height={200}
                    width={200}
                    className="mt-2 rounded-md"
                  />
                ) : null}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {status !== "Cerrado" && (
          <>
            <div className="flex items-center w-full gap-2 bg-white px-3 py-2 rounded-full shadow-md">
              <Input
                value={message}
                size="sm"
                radius="sm"
                {...register("message", { required: "Campo requerido" })}
                onChange={(e) => {
                  setMessage(e.target.value)
                }}
                className="flex-1 text-sm focus:outline-none focus:ring-0 border-none placeholder-gray-400"
                placeholder="Escribe un mensaje..."
              />
              <SendIcon
                className={`p-1 flex items-center justify-center w-10 h-8 rounded-full shadow-md transition-all duration-200 ${
                  message?.trim() || image
                    ? "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
                style={{
                  pointerEvents: message?.trim() || image ? "auto" : "none"
                }}
                onClick={(e) => {
                  e.preventDefault()
                  if (message?.trim() || image) {
                    onSubmit()
                  }
                }}
              >
                <PlayMiniSolid type="button" color={message?.trim() || image ? "#FFFFFF" : "#9CA3AF"} />
              </SendIcon>
            </div>
            <div>
              <InputFile
                type="Normal"
                alt="Image"
                label="Adjuntar imagen  "
                file={image}
                setFile={setImage}
                accept="image/*"
              />
            </div>
          </>
        )}

        <ButtonLigth
          color="primary"
          className={`w-full px-3 text-white border-none sm:w-auto ${
            status === "Cerrado"
              ? "bg-gray-400"
              : "bg-[#28A745] hover:bg-[#218838]"
          }`}
          disabled={status === "Cerrado"}
        >
          Cerrar el ticket
        </ButtonLigth>
      </div>
    </form>
  )
}

export default ViewTicket
