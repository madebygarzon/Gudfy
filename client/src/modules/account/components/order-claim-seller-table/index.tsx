"use client"

import { useState, useEffect } from "react"
import React from "react"
import InputFile from "@modules/common/components/input-file"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react"
import { useMeCustomer } from "medusa-react"
import type { order } from "../../templates/orders-template"
import handlerformatDate from "@lib/util/formatDate"
import { orderClaim, useOrderGudfy } from "@lib/context/order-context"
import { getListClaimComments } from "@modules/account/actions/get-list-claim-comments"
import { postAddComment } from "@modules/account/actions/post-add-comment"
import { useSellerStoreGudfy } from "@lib/context/seller-store"
import { updateStatusClaim } from "@modules/account/actions/update-status-claim"
import { useNotificationContext } from "@lib/context/notification-context"
import Notification from "@modules/common/components/notification"
import { updateStateNotification } from "@modules/account/actions/update-state-notification"
import io, { Socket } from "socket.io-client"
import Loader from "@lib/loader"
import { ChatIcon, SendIcon } from "@lib/util/icons"
import ButtonLigth from "@modules/common/components/button_light"
import Image from "next/image"
import { XMarkMini } from "@medusajs/icons"

type orders = {
  orders: order[]
}

interface Ticket {
  id: number
  status: "" | "Por pagar" | "Completado"
  orderNumber: string
  createdAt: string
}

const ClaimSellerTable: React.FC = () => {
  const { listOrderClaim, handlerListSellerOrderClaim, isLoadingClaim } =
    useOrderGudfy()
  const { storeSeller } = useSellerStoreGudfy()
  const [selectOrderClaim, setSelectOrderClaim] = useState<orderClaim>()
  const { notifications, handlerRetriverNotification, setNotifications } =
    useNotificationContext()
  const handleReset = () => {
    handlerListSellerOrderClaim(storeSeller?.id || " ")
  }
  const [comments, setComments] = useState<ClaimComments[]>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handlerSelectClaimOrder = (claim: orderClaim) => {
    if (notifications.length) {
      let isNotifi = notifications.find((n) => n.order_claim_id === claim.id)

      if (isNotifi)
        updateStateNotification(isNotifi.id, false).then(() => {
          setNotifications((old) => old.filter((n) => n.id !== isNotifi.id))
        })
    }
    getListClaimComments(claim?.id).then((e) => {
      setComments(e)
      setSelectOrderClaim(claim)
      onOpen()
    })
  }

  useEffect(() => {
    handlerListSellerOrderClaim(storeSeller?.id || " ")
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 w-full">
        {/* <div className="flex justify-between mb-4">
          <div></div>
          <div className="">
            ¿Necesitas ayuda? Crea un ticket:
            <div className="flex justify-center mt-5">
              <ButtonMedusa
                className="text-white bg-[#402e72]  hover:bg-[#2c1f57] rounded-[5px]"
                onClick={onOpen}
              >
                <FaPlus />
                Nuevo ticket
              </ButtonMedusa>
            </div>
          </div>
        </div> */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white  rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 text-left">Estado del reclamo</th>
                <th className="py-2 text-left">Orden número</th>
                <th className="py-2 text-left">Detalles del producto</th>
                <th className="py-2 text-left">Cliente que reclama</th>
                <th className="py-2 text-left">Fecha y hora de creación</th>
                <th className="py-2 text-left">Chat</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingClaim ? (
                listOrderClaim?.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td>
                      {claim.status_order_claim_id === "OPEN_ID" ? (
                        <div className="mr-2 p-3 bg-blue-200 rounded-md">
                          En proceso
                        </div>
                      ) : claim.status_order_claim_id === "CANCEL_ID" ? (
                        <div className="mr-2 p-3 bg-red-200 rounded-md">
                          Cerrada
                        </div>
                      ) : claim.status_order_claim_id === "UNSOLVED_ID" ? (
                        <div className="mr-2 p-3 bg-orange-200 rounded-md">
                          Escalada al administrador
                        </div>
                      ) : (
                        claim.status_order_claim_id === "SOLVED_ID" && (
                          <div className="mr-2 p-3 bg-green-200 rounded-md">
                            Cerrada
                          </div>
                        )
                      )}
                    </td>
                    <td className="py-2">{claim.number_order}</td>
                    <td className="py-2">
                      <div>
                        <h3 className="font-semibold">{claim.product_name}</h3>
                        <p className="text-xs">Cantidad: {claim.quantity}</p>
                        <p className="text-xs">por: {claim.store_name}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      {`${claim.customer_name} ${claim.customer_last_name}`}
                      <p className="text-xs">{claim.customer_email}</p>
                    </td>
                    <td className="py-2">
                      {handlerformatDate(claim.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        {notifications.map((n) => {
                          if (
                            n.notification_type_id === "NOTI_CLAIM_SELLER_ID" &&
                            n.order_claim_id === claim.id
                          ) {
                            return <Notification />
                          }
                        })}
                      </div>
                      <ChatIcon
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          handlerSelectClaimOrder(claim)
                        }}
                      />{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <Loader />
              )}
            </tbody>
          </table>
          {!isLoadingClaim && !listOrderClaim?.length && (
            <div className="p-10 flex w-full text-center items-center justify-center text-lg">
              <XMarkMini /> Aun no tienes ordenes
            </div>
          )}
        </div>
      </div>
      <ModalClaimComment
        comments={comments}
        setComments={setComments}
        handleReset={handleReset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        claim={selectOrderClaim}
      />
    </div>
  )
}
type ClaimComments = {
  id?: string
  comment: string
  comment_owner_id: string
  order_claim_id?: string
  customer_id?: string
  created_at?: string
  customer_name?: string
  customer_last_name?: string
  store_name?: string
  image?: string
}

interface ModalClaimComment {
  comments?: ClaimComments[]
  setComments: React.Dispatch<React.SetStateAction<ClaimComments[] | undefined>>
  isOpen: boolean
  onOpenChange: () => void
  handleReset: () => void
  claim?: orderClaim
}

const ModalClaimComment = ({
  setComments,
  comments,
  isOpen,
  onOpenChange,
  handleReset,
  claim,
}: ModalClaimComment) => {
  const [newComment, setNewComment] = useState<string>()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [image, setImage] = useState<File | undefined>()
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)
  const { customer } = useMeCustomer()

  const handlerSubmitComment = () => {
    const dataComment = {
      comment: newComment,
      order_claim_id: comments?.[0].order_claim_id,
      customer_id: customer?.id,
      comment_owner_id: "COMMENT_STORE_ID",
    }

    postAddComment(dataComment, image).then(() => {
      setImage(undefined)
      setNewComment("")
      setComments((old) => {
        return old?.length
          ? [
              ...old,
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_STORE_ID",
              },
            ]
          : [
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_STORE_ID",
              },
            ]
      })
    })
  }

  const handlerStatusClaim = (status: string) => {
    updateStatusClaim(comments?.[0].order_claim_id || " ", status).then(() => {
      handleReset()
      onOpenChange()
    })
  }

  useEffect(() => {
    setImage(undefined)
  }, [])

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001")

    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
      if (data.order_claim_id === comments?.[0].order_claim_id)
        getListClaimComments(comments?.[0].order_claim_id).then((e) => {
          setComments(e)
        })
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [comments?.[0].order_claim_id])

  const customerName = `${claim?.customer_name || "Cliente"} ${
    claim?.customer_last_name || ""
  }`
  const storeName = claim?.store_name || "Tienda"

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior={"inside"}
      size="xl"
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      <ModalContent className="rounded-2xl">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
              <h2 className="text-center text-lg font-semibold">
                Resolución de reclamos
              </h2>
            </ModalHeader>
            <ModalBody className="bg-gray-100 px-8 py-4 overflow-y-auto h-[60vh]">
              <div className="flex flex-col gap-2">
                {comments?.map((comment, index) => (
                  <div
                    key={index}
                    className={`flex w-full transition-transform duration-300 ease-in-out ${
                      comment.comment_owner_id === "COMMENT_STORE_ID"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 shadow-md text-sm ${
                        comment.comment_owner_id === "COMMENT_STORE_ID"
                          ? "bg-blue-400 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl "
                          : "bg-gray-200 text-gray-900 rounded-br-xl rounded-tr-xl rounded-tl-xl"
                      }`}
                    >
                      <p className="mb-1 text-xs font-bold">
                        {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                          ? customerName
                          : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "Admin Gudfy"
                          : storeName}
                      </p>
                      <p>{comment.comment}</p>
                      {comment.image ? (
                        <Image
                          src={comment.image}
                          alt={"Image"}
                          height={200}
                          width={200}
                          className="mt-2 rounded-md"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-slate-200 bg-gray-50 py-3 px-4 rounded-b-2xl">
              <div className="w-full">
                {claim?.status_order_claim_id !== "CANCEL_ID" && (
                  <div className="w-full">
                    <div className="flex items-center w-full gap-2 bg-white px-3 py-2 rounded-full shadow-md">
                      <Input
                        value={newComment}
                        size="sm"
                        radius="sm"
                        className="flex-1 text-sm focus:outline-none focus:ring-0 border-none placeholder-gray-400"
                        placeholder="Escribe un mensaje..."
                        onValueChange={setNewComment}
                      />
                      <SendIcon
                        onClick={handlerSubmitComment}
                        className="cursor-pointer p-1 flex items-center justify-center w-10 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
                      />
                    </div>
                    <div className="mt-2">
                      <InputFile
                        type="Image"
                        alt="Image"
                        label="Adjuntar imagen  "
                        file={image}
                        setFile={setImage}
                        accept="image/*"
                      />
                    </div>
                    <div className="mt-1 px-6 text-xs text-gray-600">
                      <p>
                        <span className="font-extrabold">
                          ⚠️ Aviso Importante:
                        </span>{" "}
                        Está prohibido compartir información personal, enlaces o
                        datos de la cuenta o tienda en este chat. El
                        incumplimiento resultará en suspensión de la cuenta y
                        retención temporal de los fondos en la wallet. Use el
                        chat solo para consultas relacionadas con pedidos.
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4 px-6 text-xs text-gray-600">
                  <div className="flex justify-center gap-2 mt-2">
                    <ButtonLigth
                      className={`bg-[#E74C3C] hover:bg-[#C0392B] text-white border-none w-full sm:w-auto ${
                        claim?.status_order_claim_id === "UNSOLVED_ID" ||
                        claim?.status_order_claim_id === "CANCEL_ID"
                          ? "opacity-50"
                          : ""
                      }`}
                      onClick={() => handlerStatusClaim("UNSOLVED")}
                      isLoading={isLoadingStatus}
                      disabled={
                        claim?.status_order_claim_id === "UNSOLVED_ID" ||
                        claim?.status_order_claim_id === "CANCEL_ID"
                      }
                    >
                      Escalar con un administrador
                    </ButtonLigth>
                  </div>
                  <p className="mt-2">
                    *Si encuentras que este asunto no puede ser resuelto por ti,
                    tienes la posibilidad de escalarlo al administrador.*
                  </p>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ClaimSellerTable
