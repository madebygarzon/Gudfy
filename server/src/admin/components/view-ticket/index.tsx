import React, { useEffect, useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ message: string; image: File | undefined }>();

  const submitMessage = async (formData: { message: string; image: File | undefined }) => {
    if (isLoading) return; 
    
    try {
      setIsLoading(true);
      await addTicketMessage({ ticketId, message: formData.message }, image);
      
      setMessage("");
      setImage(undefined);
      reset();
      handlerReset();
    } catch (error) {
      console.error("Error al crear el ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(submitMessage);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (ticketId) {
      getDataMessagesTicket(ticketId).then((messages) => {
        setData(messages);
      });
    }
  }, [ticketId, handlerReset]);

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-start text-gray-700 ">
          Asunto: {subject}
        </h1>
        
      </div> */}

      <div className="flex-1 px-6 pb-4 flex flex-col gap-4 ">
        <div className="overflow-y-auto space-y-3" style={{ height: '50vh' }}>
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
                <p className="text-[10px] text-gray-500 mb-2">
                  {new Date(message.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
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
          <div ref={messagesEndRef} />
        </div>
        {status == "Cerrado" || status == "Contestado" ? (
          <p className="text-red-500 text-xs">
            El ticket se encuentra {status}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Textarea
                  {...register("message", { required: true })}
                  placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
                  rows={1}
                  className="rounded-md"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                color="primary" 
                className="h-fit px-6"
                disabled={isLoading || (!message.trim() && !image)}
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
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
          </form>
        )}
      </div>
    </div>
  );
};

export default ViewTicket;
