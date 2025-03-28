import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image } from "@medusajs/medusa";
import { getDataMessagesTicket } from "../../actions/tickets/get-data-message-ticket";
import { Button, Input, Textarea } from "@medusajs/ui";
import { addTicketMessage } from "../../actions/tickets/post-add-message-ticket";
import InputFile from "./input-file";

interface ContactFormValues {
  id_ticket: string;
  owner_id: string;
  message: string;
  image: string;
  created_at: string;
}

type Props = {
  handlerReset: () => void;
  ticketId: string;
  subject: string;
  status: "Cerrado" | "Abierto" | "Contestado";
};

const ViewTicket = ({ handlerReset, ticketId, subject, status }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<ContactFormValues[]>([]);
  const [image, setImage] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ message: string; image: File | undefined }>();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      addTicketMessage({ ticketId, message: formData.message }, image).then(
        () => {
          handlerReset();
          reset();
        }
      );
    } catch (error) {
      console.error("Error al crear el ticket:", error);
    }
  });

  useEffect(() => {
    if (ticketId) {
      getDataMessagesTicket(ticketId).then((messages) => {
        setData(messages);
      });
    }
  }, [ticketId, handlerReset]);

  return (
    <form onSubmit={onSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col w-full gap-4 text-sm">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          {subject}
        </h1>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {data.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${
                message.owner_id === "COMMENT_ADMIN_ID"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.owner_id === "COMMENT_ADMIN_ID"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <p className="text-xs font-semibold">
                  {message.owner_id === "COMMENT_ADMIN_ID"
                    ? "Admin Gudfy"
                    : "Cliente"}
                </p>
                <p className="mt-1">{message.message}</p>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Imagen del mensaje"
                    className="mt-2 w-40 h-40 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {status == "Cerrado" || status == "Contestado" ? (
          <p className="text-red-500 text-xs">
            El ticket se encuentra {status}
          </p>
        ) : (
          <>
            <Textarea
              {...register("message", { required: true })}
              placeholder="Escribe tu mensaje aquí..."
              rows={3}
              className="rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && (
              <p className="text-red-500 text-xs">El mensaje es requerido</p>
            )}
            <InputFile
              type="Normal"
              alt="Image"
              label="Adjuntar imagen"
              file={image}
              setFile={setImage}
              accept="image/*"
            />

            <Button type="submit" color="primary" className="mt-4 w-full">
              Enviar
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ViewTicket;
