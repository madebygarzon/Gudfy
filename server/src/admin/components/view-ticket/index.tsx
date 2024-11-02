import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image } from "@medusajs/medusa";
import { getDataMessagesTicket } from "../../actions/tickets/get-data-message-ticket";
import { Button, Input } from "@medusajs/ui";

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
};

const ViewTicket = ({ handlerReset, ticketId, subject }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<ContactFormValues[]>();
  const [image, setImage] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>();

  const onSubmit = handleSubmit(async () => {
    try {
      // agregar el comentario y cerrar el modal
      // addTicketMessage({ ticketId, message }, image);
      handlerReset();
    } catch (error) {
      console.error("Error al crear el ticket:", error);
    }
  });

  useEffect(() => {
    if (ticketId)
      getDataMessagesTicket(ticketId).then((e) => {
        setData(e);
      });
  }, [ticketId]);

  return (
    <form onSubmit={onSubmit} className="">
      <div className="flex flex-col w-full gap-y-2 text-sm ml-auto">
        <p className="mb-4 text-xl font-extrabold text-center">{subject}</p>
        {ticketId}
        {data?.map((message) => (
          <div
            className={`flex w-full   ${
              message.owner_id === "COMMENT_ADMIN_ID"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="my-1 px-3 py-1 bg-slate-200 border rounded-[10px]">
              <p className="text-xs">
                {message.owner_id === "COMMENT_ADMIN_ID"
                  ? "Admin Gudfy"
                  : message.owner_id === "COMMENT_CUSTOMER_ID"
                  ? "Cliente"
                  : ""}
              </p>
              {message.message}

              {message.image ? (
                <img
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
          className=" rounded  mt-2"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        <Button
          className="mt-4 mb-4 rounded-[5px]"
          type="submit"
          color="primary"
        >
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default ViewTicket;
